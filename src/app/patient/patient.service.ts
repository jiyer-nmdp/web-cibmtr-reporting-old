import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders
} from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import { AppConfig } from "../app.config";
import { IPatientContext } from "../model/patient.";
import { LocalStorageService } from "angular-2-local-storage";
import { UtilityService } from "../utility.service";
import {MessageTrayService} from "../message-tray.service";
import {catchError, tap} from "rxjs/operators";

@Injectable()
export class PatientService {
  constructor(
    private http: HttpClient,
    private _localStorageService: LocalStorageService,
    private utilityService: UtilityService,
    private mTrayService: MessageTrayService
  ) {}

  getPatient(identifier): Observable<IPatientContext> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(
        this._localStorageService.get("iss")
      ) +
      "/Patient/" +
      identifier;
    return this.http
      .get<IPatientContext>(url, {
        headers: this.buildEhrHeaders(),
      });
       // .subscribe(
       //  error => {
       //    throw error;
       //  });
         // tap( (resp : any) => (this.handleSuccess(resp, "getPatient"))),
         // catchError( e => { throw e; }));//(e: any) => Observable.throw(this.handleError(e))));
  }

  getObservationPriorityLabs(identifier): Observable<any> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(
        this._localStorageService.get("iss")
      ) +
      "/Observation?patient=" +
      identifier +
      "&_count=1000&code=" +
      AppConfig.loinc_codes;
    return this.utilityService
      .getPage(url, this.buildEhrHeaders());
      //   .pipe(
      // //   tap( (resp : any) => (this.handleSuccess(resp, "getObservtionPriorityLabs"))),
      // //
      //    catchError(e => { throw e; }));
  }

  getObservationLabs(identifier): Observable<any> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(
        this._localStorageService.get("iss")
      ) +
      "/Observation?category=laboratory&_count=1000&patient=" +
      identifier;
    return this.utilityService
      .getPage(url, this.buildEhrHeaders());
      // .pipe(
      //    tap( (resp : any) => (this.handleSuccess(resp, "getObservationAllLabs"))),
      //    catchError(e => { throw e; }));
  }

  buildEhrHeaders() {
    let ehrHeaders: HttpHeaders = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set(
        "Authorization",
        `Bearer ${this._localStorageService.get("accessToken")}`
      );

    return ehrHeaders;
  }

  // handleError(error: HttpErrorResponse) {
  //   let errorMessage = `Unable to process request for \nURL : ${error.url}.  \nStatus: ${error.status}. \nStatusText: ${error.statusText}`;
  //   alert(errorMessage);
  //   this.mTrayService.addErrorMessages(errorMessage);
  //   return throwError(errorMessage);
  // }

//   handleSuccess(success: HttpResponse<any>, apiCall: string) {
//     let message = `Success in ${apiCall} API \n${
//       success.status
//     } \n Message : ${success.url || success.body}. `;
//
// //    alert(message);
//     console.log(message);
//     //this.mTrayService.addRespMessages(message);
//     throw message;
// //    return throwError(message);
//   }
}
