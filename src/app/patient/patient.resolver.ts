import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve,
} from "@angular/router";
import { BsModalRef } from "ngx-bootstrap/modal";
import { forkJoin, throwError, Observable } from "rxjs";
import { IPatientContext } from "../model/patient.";
import { PatientService } from "./patient.service";
import { LocalStorageService } from "angular-2-local-storage";
import { IIdentifiers } from "../model/identifiers";
import { HttpHeaders } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { HttpErrorResponse } from "@angular/common/http";
import { map, mergeMap, catchError } from "rxjs/operators";
import { SpinnerService } from "../spinner/spinner.service";
import { GlobalErrorHandler } from "../global-error-handler";
import { UtilityService } from "../shared/utility.service";

@Injectable()
export class PatientResolver implements Resolve<IPatientContext[]> {
  bsModalRef: BsModalRef;
  constructor(
    private patientDetailService: PatientService,
    private _localStorageService: LocalStorageService,
    private http: HttpClient,
    private spinner: SpinnerService,
    private utilityService: UtilityService,
    private _globalErrorHanlder: GlobalErrorHandler
  ) {}

  resolve(): any {
    //Commented the below code as EPIC STU3 identifiers

    //Post call to get the STU3 patient id by retreving the patient identifier from local storage

    let issurl: string = this._localStorageService.get("iss");

    if (issurl.includes("DSTU2")) {
      let ehrHeaders: HttpHeaders = new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set(
          "Authorization",
          `Bearer ${this._localStorageService.get("accessToken")}`
        );

      return this.http
        .get(
          this.utilityService.rebuild_DSTU2_STU3_Url(
            this._localStorageService.get("iss")
          ) +
            "/Patient/" +
            this._localStorageService.get("patient"),
          { headers: ehrHeaders }
        )
        .pipe(
          catchError((e: any) => Observable.throw(this.handleError(e))),
          map((response: IIdentifiers) => {
            let stu3_id = response.identifier.filter((id) => {
              if (id.type && id.type.text === "FHIR STU3") {
                return id.value;
              }
            });
            if (stu3_id && stu3_id.length > 0) {
              return stu3_id[0].value;
            } else {
              alert(
                "Warning. Patient Identifier not Found. Please contact your internal Epic Consultant to review this case."
              );
            }
          }),
          mergeMap((stu3_id) => this.getEhrDataSets(stu3_id))
        );
    } else {
      return this.getEhrDataSets(this._localStorageService.get("patient"));
    }
  }

  getEhrDataSets(id) {
    this.spinner.start();
    return forkJoin([
      this.patientDetailService.getPatient(id),
      this.patientDetailService.getObservationPriorityLabs(id),
    ]);
  }

  handleError(error: HttpErrorResponse) {
    this.spinner.reset();
    let errorMessage = `Unexpected Failure EPIC API \n${
      error.status
    } \n Message : ${error.url || error.message}. `;

    alert(errorMessage);
    console.log(errorMessage);
    this._globalErrorHanlder.handleError(errorMessage);
    return throwError(error);
  }
}
