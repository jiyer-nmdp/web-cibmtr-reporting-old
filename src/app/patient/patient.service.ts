import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import { AppConfig } from "../app.config";
import { IPatientContext } from "../model/patient.";
import { LocalStorageService } from "angular-2-local-storage";
import { UtilityService } from "../utility.service";
import { catchError, timestamp } from "rxjs/operators";

@Injectable()
export class PatientService {
  constructor(
    private http: HttpClient,
    private _localStorageService: LocalStorageService,
    private utilityService: UtilityService
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
      .pipe(catchError(this.handleError));
  }

  getObservation(identifier): Observable<IPatientContext> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(
        this._localStorageService.get("iss")
      ) +
      "/Observation?patient=" +
      identifier +
      "&_count=1000&" +
      AppConfig.observation_codes;
    return this.utilityService
      .getPage(url, this.buildEhrHeaders())
      .pipe(catchError(() => of(null)));
  }

  getObservationPriorityLabs(identifier): Observable<IPatientContext> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(
        this._localStorageService.get("iss")
      ) +
      "/Observation?patient=" +
      identifier +
      "&_count=1000&code=" +
      AppConfig.loinc_codes;
    return this.utilityService
      .getPage(url, this.buildEhrHeaders())
      .pipe(catchError(() => of(null)));
  }

  getObservationLabs(identifier): Observable<IPatientContext> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(
        this._localStorageService.get("iss")
      ) +
      "/Observation?category=laboratory&_count=1000&patient=" +
      identifier;
    return this.utilityService
      .getPage(url, this.buildEhrHeaders())
      .pipe(catchError(() => of(null)));
  }

  getObservationVitalSigns(identifier): Observable<IPatientContext> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(
        this._localStorageService.get("iss")
      ) +
      "/Observation?category=vital-signs&_count=1000&patient=" +
      identifier;
    return this.utilityService
      .getPage(url, this.buildEhrHeaders())
      .pipe(catchError(() => of(null)));
  }

  getObservationCoreChar(identifier): Observable<IPatientContext> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(
        this._localStorageService.get("iss")
      ) +
      "/Observation?category=core-characteristics&_count=1000&patient=" +
      identifier;
    return this.utilityService
      .getPage(url, this.buildEhrHeaders())
      .pipe(catchError(() => of(null)));
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
    return throwError(errorMessage);
  }
}
