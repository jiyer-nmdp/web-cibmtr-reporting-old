import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConfig } from "../app.config";
import { IPatientContext } from "../model/patient.";

@Injectable()
export class PatientService {
  constructor(private http: HttpClient) {}

  ehrHeaders: HttpHeaders = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);

  getPatient(identifier): Observable<IPatientContext> {
    let url = AppConfig.patient_endpoint + identifier;
    return this.http.get<IPatientContext>(url, {
      headers: this.ehrHeaders
    });
  }

  getObservation(identifier): Observable<IPatientContext> {
    return this.http.get<IPatientContext>(
      AppConfig.observation_endpoint
        .concat(identifier)
        .concat("&", AppConfig.observation_codes),
      {
        headers: this.ehrHeaders
      }
    );
  }
}
