import { Component, OnInit } from "@angular/core";
import { Patient } from "../model/patient.";
import { ActivatedRoute } from "@angular/router";
import { throwError } from "rxjs";
import { ObservationComponent } from "../observation/observation.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { PatientService } from "./patient.service";
import { FhirService } from "./fhir.service";

@Component({
  selector: "app-main",
  templateUrl: "./patient.component.html"
})
export class PatientComponent implements OnInit {
  bsModalRef: BsModalRef;
  ehrpatient: Patient;
  bundle: any;
  fhirVersionStr: string = "STU3";
  crid: string;
  fhirApp: string = "FHIR";
  cridApp: string = "CRID";

  constructor(
    private _route: ActivatedRoute,
    private modalService: BsModalService,
    private patientService: PatientService,
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

  checkPatientExistsInFhir(ehrpatient) {
    let identifiers = ehrpatient.identifier.map(i => i.value);
    identifiers.forEach(identifier => {
      //make a call to FHIR
      this.fhirService.lookupPatientCrid(identifier).subscribe(
        crid => {
          if (crid && crid != undefined) {
            this.crid = crid;
          }
        },
        (error: Response) => {
          this.handleError(error, this.fhirApp);
        }
      );
    });
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

  register(ehrpatient: Patient) {
    let payload = {
      ccn: 11054,
      patient: {
        firstName: ehrpatient.name[0].given[0],
        lastName: ehrpatient.name[0].family,
        birthDate: ehrpatient.birthDate,
        gender: ehrpatient.gender === "male" ? "M" : "F"
      }
    };

    this.fhirService.getCrid(payload).subscribe(
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
        this.fhirService.submitPatient(updatedEhrPatient).subscribe(
          result => {
            console.log("Successfully Updated the EHR Patient into FHIR");
          },
          error => this.handleError(error, this.fhirApp)
        );
      },
      error => this.handleError(error, this.cridApp)
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
          system: "http://cibmtr.org/fhir/crid",
          value: crid
        }
      ]
    };
    return updatedEhrPatient;
  }

  getDetails(bundle: any) {
    this.bsModalRef = this.modalService.show(ObservationComponent, {
      initialState: bundle
    });
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
