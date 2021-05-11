import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
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
        "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3"
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
        "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3"
      ) +
      "/Observation?patient=" +
      identifier +
      "&_count=1000&" +
      AppConfig.observation_codes;
    return this.utilityService
      .getPage(url, this.buildEhrHeaders())
      .catch((e: any) => Observable.of(null));
  }

  getObservationPriorityLabs(identifier): Observable<IPatientContext> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(
        "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3"
      ) +
      "/Observation?patient=" +
      identifier +
      "&_count=1000&code=" +
      AppConfig.loinc_codes;
    return this.utilityService
      .getPage(url, this.buildEhrHeaders())
      .catch((e: any) => Observable.of(null));
  }

  getObservationLabs(identifier): Observable<IPatientContext> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(
        "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3"
      ) +
      "/Observation?category=laboratory&_count=1000&patient=" +
      identifier;
    return this.utilityService
      .getPage(url, this.buildEhrHeaders())
      .catch((e: any) => Observable.of(null));
  }

  getObservationVitalSigns(identifier): Observable<IPatientContext> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(
        "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3"
      ) +
      "/Observation?category=vital-signs&_count=1000&patient=" +
      identifier;
    return this.utilityService
      .getPage(url, this.buildEhrHeaders())
      .catch((e: any) => Observable.of(null));
  }

  getObservationCoreChar(identifier): Observable<IPatientContext> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(
        "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3"
      ) +
      "/Observation?category=core-characteristics&_count=1000&patient=" +
      identifier;
    return this.utilityService
      .getPage(url, this.buildEhrHeaders())
      .catch((e: any) => Observable.of(null));
  }

  buildEhrHeaders() {
    let ehrHeaders: HttpHeaders = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1cm46ZXBpYzphcHBvcmNoYXJkLmN1cnByb2QiLCJjbGllbnRfaWQiOiJmZTMwZTE2NC1hMjY1LTRmNzEtOWIxNC01NzBiZThjYjNmMjciLCJlcGljLmVjaSI6InVybjplcGljOkN1cnJlbnQtQXBwLU9yY2hhcmQtUHJvZHVjdGlvbiIsImVwaWMubWV0YWRhdGEiOiJBZi1FOXo0VXVjQ281czZWbUMxVFpaTnE0V25aRXdWUGs1RURZTkRMcGtEMDBHWjE1MFFFTzFKMkRhbkxmRElMcEVlWG5ybXVpYktOZjI3Ui03Q2M4dG51NGt0MkNQRUhndmI2SHk1UHpPcFZ4UUl0TGRBcDZSX01hYkE1WU1qdCIsImVwaWMudG9rZW50eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjIwNzEwMTUwLCJpYXQiOjE2MjA3MDY1NTAsImlzcyI6InVybjplcGljOmFwcG9yY2hhcmQuY3VycHJvZCIsImp0aSI6ImYzYmMwNTZmLWMxMTQtNDllZS04OGZhLTUzNjZjYmQ1YmMwMSIsIm5iZiI6MTYyMDcwNjU1MCwic3ViIjoiZVE0dTQ0SE56Mi45VmxiWHdiU2c3THczIn0.U0w1D6cmqSeJQqC01lhh16rZBcrAUjwzUD8lMEUuwaQ2M09Gu9x2F6anNd84oyG6_POXjuXwlo0R6gxDLgDjgo5slNesmtD8eKD1blTWH2F1Zgt2FMxAJpDovzVRt5Km-ixkHcWNWaJwidTQA9ijvMXcjBR_Ip-MggQjqPIM508p_TfKe2s1aB7GNkErK28wZz5NLkYVe9jiPT1vGJJXdAg1PgHIvvV2lAEmYlKze5_N4K0aqPi2NeKt9zrT_kchv7DayKoTISwa0fP1y2SjrpNDFQJSf5zyf1lUHoX6w31-qqSN4jzdpE890RdEu5xwmcOT5BL6dhDWrie-j1PaFQ `
      );

    return ehrHeaders;
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = `Unable to process request for \nURL : ${error.url}.  \nStatus: ${error.status}. \nStatusText: ${error.statusText} \nTimestamp : ${timestamp}`;
    alert(errorMessage);
    return throwError(errorMessage);
  }
}
