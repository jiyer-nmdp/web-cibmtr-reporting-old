import { Component, OnInit } from "@angular/core";
import { Patient } from "../model/patient.";
import { ActivatedRoute } from "@angular/router";
import { throwError, Observable } from "rxjs";
import { ObservationComponent } from "../observation/observation.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FhirService } from "./fhir.service";
import { ObservationService } from "../observation/observation.service";
import { NgForOf } from "@angular/common";
import { take } from "rxjs/operators";

@Component({
  selector: "app-main",
  templateUrl: "./patient.component.html"
})
export class PatientComponent implements OnInit {
  bsModalRef: BsModalRef;
  ehrpatient: Patient;
  bundle: any;
  cibmtrObservations: any;
  fhirVersionStr: string = "STU3";
  crid: string;
  fhirApp: string = "FHIR";
  cridApp: string = "CRID";
  lookupPatientCrid$: Observable<any>;
  crid$: Observable<any>;
  cridCallComplete: Boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private modalService: BsModalService,
    private observationService: ObservationService,
    private fhirService: FhirService
  ) {}

  ngOnInit() {
    this._route.data.subscribe(
      results => {
        this.ehrpatient = results.pageData[0];
        this.bundle = results.pageData[1];
        // Check if patient exists in FHIR Server and if Yes then want to get the CRID value
        this.checkPatientExistsInFhir(this.ehrpatient);
      },
      error => {
        return throwError(error);
      }
    );
  }

  getGivenName(ehrpatient) {
    let givenName;
    if (ehrpatient.name[0].given.length > 0) {
      givenName = ehrpatient.name[0].given.join(" ");
    }
    return givenName;
  }

  checkPatientExistsInFhir(ehrpatient) {
    this.cridCallComplete = false;
    let identifiers = ehrpatient.identifier
      .filter(
        i =>
          i.system !== undefined &&
          i.system !== "" &&
          (i.value !== undefined && i.value !== "")
      )
      .map(i => encodeURI("".concat(i.system, "|", i.value)));
    identifiers.forEach(identifier => {
      //make a call to FHIR
      this.fhirService
        .lookupPatientCrid(identifier)
        .pipe(take(1))
        .toPromise()
        .then(resp => {
          let total = resp.total;
          if (total && total > 0) {
            if (resp.entry) {
              resp.entry.filter(entry => {
                if (entry.resource) {
                  if (
                    entry.resource.identifier &&
                    entry.resource.identifier.length > 0
                  ) {
                    let filteredCrid = entry.resource.identifier.filter(
                      i => i.system === "http://cibmtr.org/fhir/crid"
                    );

                    if (filteredCrid && filteredCrid.length > 0) {
                      this.crid = filteredCrid[0].value;
                    }
                  }
                }
              });
            }
          }
        })
        .finally(() => (this.cridCallComplete = true))
        .catch(this.handleErrorv2);
    });
  }

  private handleErrorv2(error: any): Promise<any> {
    if (error == null) {
      error = "undefined";
    }
    if (error != null) {
      console.error("An error occurred" + error);
      return Promise.reject(error.message || error);
    } else {
      console.error("An unknown error occurred");
      return Promise.reject("Unknown error");
    }
  }

  formatIdentifier(identifiers) {
    let identifier = "";
    if (identifiers && identifiers.length > 0) {
      for (let i = 0; i < identifiers.length; i++) {
        identifier = identifier + identifiers[i].value;

        if (i < identifiers.length - 1) {
          identifier = identifier + ", ";
        }
      }
    }
    return identifier;
  }

  formatContact(telecom) {
    let contact = "";
    for (let i = 0; i < telecom.length; i++) {
      contact = contact + telecom[i].value + " (" + telecom[i].use + ")";
      if (i < telecom.length - 1) {
        contact = contact + ", ";
      }
    }
    return contact;
  }

  displayMaritalStatus(status) {
    if (status && status.coding) {
      return status.coding[0].display;
    }
    return "";
  }

  register(e: any, ehrpatient: Patient) {
    this.cridCallComplete = false;
    e.stopPropagation();
    e.preventDefault();
    let genderLowerCase;
    if (ehrpatient.gender) {
      genderLowerCase = ehrpatient.gender.toLowerCase();
    }

    let payload = {
      ccn: 11054,
      patient: {
        firstName: this.getGivenName(ehrpatient),
        lastName: ehrpatient.name[0].family,
        birthDate: ehrpatient.birthDate,
        gender: genderLowerCase === "male" ? "M" : "F"
      }
    };

    this.fhirService
      .getCrid(payload)
      .pipe(take(1))
      .subscribe(
        result => {
          // look for Perfect Match
          if (result && result.perfectMatch) {
            this.crid = result.perfectMatch[0].crid;
          } else {
            this.crid = result.crid;
          }

          let updatedEhrPatient = this.appendCridIdentifier(
            ehrpatient,
            this.crid
          );

          //Now that we got the CRID save the Info into FHIR
          this.fhirService
            .submitPatient(updatedEhrPatient)
            .retry(0)
            .subscribe(
              () => {
                console.log("Submitted patient");
              },
              error => {
                this.handleError(error, this.fhirApp);
              }
            );
        },
        error => {
          this.handleError(error, this.cridApp);
        },
        () => (this.cridCallComplete = true)
      );
  }

  // Update the existing ehr patient with the CRID value
  appendCridIdentifier(ehrpatient: Patient, crid: string) {
    let updatedEhrPatient = {
      ...ehrpatient,
      identifier: [
        ...ehrpatient.identifier,
        {
          use: "official",
          system: "http://cibmtr.org/identifier/CRID",
          value: crid
        }
      ]
    };
    return updatedEhrPatient;
  }

  getDetails(bundle: any) {
    // make a http get call to fhir to get the list of saved observations
    let savedBundle = {};
    if (
      bundle &&
      bundle.entry &&
      bundle.entry.length > 0 &&
      bundle.entry[0].resource.subject
    ) {
      const subj = bundle.entry[0].resource.subject.reference;
      const now = new Date();
      this.observationService.getCibmtrObservations(subj).subscribe(
        response => (savedBundle = response),
        error =>
          console.log(
            "error occurred while fetching saved observations",
            error
          ),
        () => {
          this.bsModalRef = this.modalService.show(ObservationComponent, {
            initialState: {
              bundle,
              savedBundle,
              now
            }
          });
        }
      );
    }
  }

  getPatientidetifier() {
    return;
  }

  handleError(error: Response, system: string) {
    let text: string =
      `ERROR in call to ${system} web service.  Status: ` +
      error.status +
      ".  Text: " +
      error.statusText;
    alert(text);
  }
}
