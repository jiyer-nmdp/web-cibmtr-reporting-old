import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
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

  ehrHeaders: HttpHeaders = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .set(
      "Authorization",
      `Bearer ${this._localStorageService.get("accessToken")}`
    );

  getPatient(identifier): Observable<IPatientContext> {
    let url =
      this._localStorageService.get("iss") +
      "/Patient/" +
      this._localStorageService.get("patient");

    return this.http.get<IPatientContext>(url, {
      headers: this.ehrHeaders
    });
  }

  getObservation(identifier): Observable<IPatientContext> {
    var observationUrl =
      this._localStorageService.get("iss") +
      "/Observation?patient=" +
      this._localStorageService.get("patient") +
      AppConfig.observation_codes;

    return this.http.get<IPatientContext>(observationUrl, {
      headers: this.ehrHeaders
    });
  }
}
