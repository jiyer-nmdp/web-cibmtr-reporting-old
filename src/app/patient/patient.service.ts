import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import {Observable, throwError, of, forkJoin} from "rxjs";
import { AppConfig } from "../app.config";
import { IPatientContext } from "../model/patient.";
import { LocalStorageService } from "angular-2-local-storage";
import { UtilityService } from "../utility.service";
import {catchError, tap, map} from "rxjs/operators";
import {GlobalErrorHandler} from "../global-error-handler";

@Injectable()
export class PatientService {
  constructor(
    private http: HttpClient,
    private _localStorageService: LocalStorageService,
    private utilityService: UtilityService,
    private _gEH: GlobalErrorHandler
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
      })
      .pipe(
        tap(),
        catchError(this.handleError));
  }

  getObservationPriorityLabs(identifier): Observable<IPatientContext> {
    const requestUrls:any[] = [];
    const splitLoincCodesArray = this.utilityService.chunk(AppConfig.loinc_codes.toString().split(','),150);
    splitLoincCodesArray.forEach((loincs) =>
    {
      const loinc_codes = loincs.join(',');
      const url = this.utilityService.rebuild_DSTU2_STU3_Url
        (this._localStorageService.get("iss")) +
        "/Observation?patient=" +
        identifier +
        "&_count=1000&code=" +
        loinc_codes;
      requestUrls.push(this.utilityService.getPage(url, this.buildEhrHeaders()));
    });
    return forkJoin(requestUrls).pipe(
      map((res: []) =>
      {
        const bundles:any[] = [];
        res.forEach((r1: any) =>
          {
            if (r1 instanceof Array)
            {
              r1.forEach(r => bundles.push(r));
            }
          }
        );
        return bundles;
      }),
      catchError((error) =>
        {this._gEH.handleError(error);
          return of(null); }
      ));
  }

  getObservationLabs(identifier): Observable<any> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(
        this._localStorageService.get("iss")
      ) +
      "/Observation?category=laboratory&_count=1000&patient=" +
      identifier;
    return this.utilityService.getPage(url, this.buildEhrHeaders())
      .pipe(
      tap(success => {this._gEH.handleError( "Retrived all labs successfully." );
        this._gEH.handleError(success);}),
      catchError((error) =>
        {this._gEH.handleError(error);
          return of(null); }
      ));;
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

  handleError(error: HttpErrorResponse) {
    let errorMessage = `Unable to process request for \nURL : ${error.url}.  \nStatus: ${error.status}. \nStatusText: ${error.statusText}`;
    alert(errorMessage);
    throw errorMessage;
    return throwError(errorMessage);
  }
}
