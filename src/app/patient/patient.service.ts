import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConfig } from "../app.config";
import { IPatientContext } from "../model/patient.";
import { LocalStorageService } from "angular-2-local-storage";

@Injectable()
export class PatientService {
  constructor(
    private http: HttpClient,
    private _localStorageService: LocalStorageService
  ) {}

  //iss_possible_format - https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/DSTU2 or https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3

  getPatient(identifier): Observable<IPatientContext> {
    let url = this._localStorageService.get("iss") + "/Patient/" + identifier;
    return this.http
      .get<IPatientContext>(url, {
        headers: this.buildEhrHeaders(),
      })
      .catch((e: any) =>
        Observable.throw(this.handleError(e, new Date().getTime()))
      );
  }

  getObservation(identifier): Observable<IPatientContext> {
    return this.http
      .get<IPatientContext>(
        this._localStorageService.get("iss") +
          "/Observation?patient=" +
          identifier +
          "&" +
          AppConfig.observation_codes,
        {
          headers: this.buildEhrHeaders(),
        }
      )
      .catch((e: any) =>
        Observable.throw(this.handleError(e, new Date().getTime()))
      );
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

  handleError(error: HttpErrorResponse, timestamp: any) {
    let errorMessage = `Unable to process request for \nURL : ${error.url}.  \nStatus: ${error.status}. \nStatusText: ${error.statusText} \nTimestamp : ${timestamp}`;
    alert(errorMessage);
    console.log(errorMessage);
  }

  rebuild_DSTU2_STU3_Url(url: string) {
    if (url.includes("DSTU2")) {
      return url.replace("DSTU2", "STU3");
    }
  }
}
