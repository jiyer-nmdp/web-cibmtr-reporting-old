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
  getPatient(identifier): Observable<IPatientContext> {
    let url = this._localStorageService.get("iss") + "/Patient/" + identifier;

    return this.http.get<IPatientContext>(url, {
      headers: this.buildEhrHeaders()
    });
  }

  getObservation(identifier): Observable<IPatientContext> {
    return this.http.get<IPatientContext>(
      this._localStorageService.get("iss") +
        "/Observation?patient=" +
        identifier +
        "&" +
        AppConfig.observation_codes,
      {
        headers: this.buildEhrHeaders()
      }
    );
  }

  /*getObservation(identifier): Observable<IPatientContext> {
    return this.http.get<IPatientContext>(
      "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3/Observation?patient=" +
        identifier +
        "&" +
        AppConfig.observation_codes,
      {
        headers: this.buildEhrHeaders()
      }
    );
  }*/

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
}
