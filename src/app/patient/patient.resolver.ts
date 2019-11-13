import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve
} from "@angular/router";
import { BsModalRef } from "ngx-bootstrap/modal";
import { forkJoin } from "rxjs";
import { IPatientContext } from "../model/patient.";
import { PatientService } from "./patient.service";
import { LocalStorageService } from "angular-2-local-storage";
@Injectable()
export class PatientResolver implements Resolve<IPatientContext[]> {
  bsModalRef: BsModalRef;
  constructor(
    private patientDetailService: PatientService,
    private _localStorageService: LocalStorageService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    //Commented the below code as EPIC STU3 identifiers

    //Post call to get the STU3 patient id by retreving the patient identifier from local storage
    /*let body = {
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
          identifier => identifier.IDType === "FHIR STU3"s
        );*/

    // if (!this.nmdpWidget.isLoggedIn()) {
    //   return;
    // }

    //let decodedValue = this.getDecodedAccessToken(this.nmdpWidget.getAccessToken());

    let id = this._localStorageService.get("patient");
    return forkJoin([
      this.patientDetailService.getPatient(id),
      this.patientDetailService.getObservation(id)
    ]);
  }
}
