import { Component, OnInit } from "@angular/core";
import { Patient } from "../model/patient.";
import { ActivatedRoute } from "@angular/router";
import { throwError } from "rxjs";
import { ObservationComponent } from "../observation/observation.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { PatientService } from "./patient.service";

@Component({
  selector: "app-main",
  templateUrl: "./patient.component.html"
})
export class PatientComponent implements OnInit {
  bsModalRef: BsModalRef;
  patient: Patient;
  bundle: any;
  fhirVersionStr: string = "STU3";
  crid: string;

  constructor(
    private _route: ActivatedRoute,
    private modalService: BsModalService,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    this._route.data.subscribe(
      results => {
        this.patient = results.pageData[0];
        this.bundle = results.pageData[1];
      },
      error => {
        return throwError(error);
      }
    );
  }

  /**
   *
   * @param identifiers
   */
  formatIdentifier(identifiers) {
    let identifier = "";
    if (identifiers && identifiers.length > 0) {
      let filteredIdentifier = identifiers.filter(function(identifier) {
        if (identifier && identifier.type) {
          return (
            identifier.type.text === "EPIC" ||
            identifier.type.text === "EXTERNAL"
          );
        }
      });

      for (let i = 0; i < filteredIdentifier.length; i++) {
        identifier = identifier + filteredIdentifier[i].value;

        if (i < filteredIdentifier.length - 1) {
          identifier = identifier + ", ";
        }
      }
    }

    return identifier;
  }

  /**
   *
   * @param telecom
   */
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

  /**
   *
   * @param patient
   */
  register(patient: Patient) {
    let payload = {
      ccn: 11054,
      patient: {
        firstName: patient.name[0].given[0],
        lastName: patient.name[0].family,
        birthDate: patient.birthDate,
        gender: patient.gender === "male" ? "M" : "F"
      }
    };

    this.patientService.getCrid(payload).subscribe(result => {
      if (result && result.perfectMatch) {
        this.crid = result.perfectMatch[0].crid;
      } else {
        this.crid = result.crid;
      }
    });
  }

  /**
   *
   * @param bundle
   */
  getDetails(bundle: any) {
    this.bsModalRef = this.modalService.show(ObservationComponent, {
      initialState: bundle
    });
  }

  /**
   *
   */
  getPatientidetifier() {
    return;
  }
}
