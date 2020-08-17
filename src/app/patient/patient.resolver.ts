import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve,
} from "@angular/router";
import { BsModalRef } from "ngx-bootstrap/modal";
import { forkJoin, throwError } from "rxjs";
import { IPatientContext } from "../model/patient.";
import { PatientService } from "./patient.service";
import { LocalStorageService } from "angular-2-local-storage";
import { AppConfig } from "../app.config";
import { IIdentifiers } from "../model/identifiers";
import { HttpHeaders } from "@angular/common/http";
import { NmdpWidget } from "@nmdp/nmdp-login/Angular/service/nmdp.widget";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class PatientResolver implements Resolve<IPatientContext[]> {
  bsModalRef: BsModalRef;
  constructor(
    private patientDetailService: PatientService,
    private _localStorageService: LocalStorageService,
    private http: HttpClient
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    //Commented the below code as EPIC STU3 identifiers

    //Post call to get the STU3 patient id by retreving the patient identifier from local storage

    //let issurl: string = this._localStorageService.get("iss");

    let issurl: string = this._localStorageService.get("iss");

    if (issurl.includes("DSTU2")) {
      let body = {
        PatientID: this._localStorageService.get("patient"),
        PatientIDType: "FHIR",
        UserID: "1",
        UserIDType: "External",
      };

      let ehrHeaders: HttpHeaders = new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set(
          "Authorization",
          `Bearer ${this._localStorageService.get("accessToken")}`
        );

      //format - https://domain/IC-instance/api/epic/2015/Common/Patient/GetPatientIdentifiers/Patient/Identifiers

      let epicidentifier: string = this._localStorageService.get("iss");

      let epic_identifier_url = epicidentifier.replace(
        /\/api\/.*/,
        AppConfig.getPatientIdentifier
      );

      return this.http
        .post(decodeURIComponent(epic_identifier_url.toString()), body, {
          headers: ehrHeaders,
        })
        .subscribe(
          (response: IIdentifiers) => {
            let filteredIdentifiers = response.Identifiers.filter(
              (identifier) => identifier.IDType === "FHIR STU3"
            );

            // If there is one
            if (filteredIdentifiers) {
              let id = filteredIdentifiers[0].ID;
              return forkJoin([
                this.patientDetailService.getPatient(id),
                this.patientDetailService.getObservation(id),
                this.patientDetailService.getObservationVitalSigns(id),
                this.patientDetailService.getObservationLabs(id),
                this.patientDetailService.getObservationCoreChar(id),
              ]);
            } else {
              // there is no patient id hence throw the error
              return alert("Invalid Patient Identifier");
            }
          },
          (error) => {
            alert(error);
            throwError(error);
          }
        );
    } else {
      let id = this._localStorageService.get("patient");
      return forkJoin([
        this.patientDetailService.getPatient(id),
        this.patientDetailService.getObservation(id),
        this.patientDetailService.getObservationVitalSigns(id),
        this.patientDetailService.getObservationLabs(id),
        this.patientDetailService.getObservationCoreChar(id),
      ]);
    }
  }
}
