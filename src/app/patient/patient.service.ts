import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConfig } from "../app.config";
import { IPatientContext } from "../model/patient.";

@Injectable()
export class PatientService {
  constructor(private http: HttpClient) {}

  headers: HttpHeaders = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);

  getPatient(identifier): Observable<IPatientContext> {
    return this.http.get<IPatientContext>(
      AppConfig.PATIENT_ENDPOINT.concat(identifier),
      {
        headers: this.headers
      }
    );
  }

  getObservation(identifier): Observable<IPatientContext> {
    return this.http.get<IPatientContext>(
      AppConfig.OBSERVATION_ENDPOINT.concat(identifier).concat(
        "&",
        AppConfig.OBSERVATION_CODES
      ),
      {
        headers: this.headers
      }
    );
  }

  getCrid(payload): Observable<any> {
    let url = "http://localhost:8080/CRID";
    let headers = {
      "Content-Type": "application/json"
    };
    return this.http.put(url, payload, { headers });
  }
}
