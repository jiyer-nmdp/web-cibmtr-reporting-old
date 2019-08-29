import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve
} from "@angular/router";
import { forkJoin, throwError } from "rxjs";
import { IPatientContext } from "../model/patient.";
import { PatientService } from "./patient.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppConfig } from "../app.config";
import { IIdentifiers } from "../model/identifiers";
import {
  LocalStorageModule,
  LocalStorageService
} from "angular-2-local-storage";
@Injectable()
export class PatientResolver implements Resolve<IPatientContext[]> {
  constructor(
    private patientDetailService: PatientService,
    private http: HttpClient,
    private _localStorageService: LocalStorageService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    //Post call to get the STU3 patient id by retreving the patient identifier from local storage

    let body = {
      PatientID: this._localStorageService.get("patient"),
      PatientIDType: "FHIR",
      UserID: "1",
      UserIDType: "External"
    };

    let ehrHeaders: HttpHeaders = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set(
        "Authorization",
        `Bearer ${this._localStorageService.get("accessToken")}`
      );

    return this.http
      .post(AppConfig.patient_identifiers, body, {
        headers: ehrHeaders
      })
      .switchMap((response: IIdentifiers) => {
        let filteredIdentifiers = response.Identifiers.filter(
          identifier => identifier.IDType === "FHIR STU3"
        );

        // If there is one
        if (filteredIdentifiers) {
          let ID = filteredIdentifiers[0].ID;
          return forkJoin([
            this.patientDetailService.getPatient(ID),
            this.patientDetailService.getObservation(ID)
          ]);
        } else {
          // there is no patient id hence throw the error
          return throwError("Invalid patient identifier");
        }
      });
  }
}
