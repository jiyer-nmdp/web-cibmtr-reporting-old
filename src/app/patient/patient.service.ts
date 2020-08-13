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

  getPatient(identifier): Observable<IPatientContext> {
    let url =
      this.rebuild_DSTU2_STU3_Url(
        "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3"
      ) +
      "/Patient/" +
      identifier;
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
        this.rebuild_DSTU2_STU3_Url(
          "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3"
        ) +
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

  getObservationLabs(identifier): Observable<IPatientContext> {
    return this.http
      .get<IPatientContext>(
        this.rebuild_DSTU2_STU3_Url(
          "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3"
        ) +
          "/Observation?category=laboratory&patient=" +
          identifier,
        {
          headers: this.buildEhrHeaders(),
        }
      )
      .catch((e: any) =>
        Observable.throw(this.handleError(e, new Date().getTime()))
      );
  }

  getObservationVitalSigns(identifier): Observable<IPatientContext> {
    return this.http
      .get<IPatientContext>(
        this.rebuild_DSTU2_STU3_Url(
          "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3"
        ) +
          "/Observation?category=vital-signs&patient=" +
          identifier,
        {
          headers: this.buildEhrHeaders(),
        }
      )
      .catch((e: any) =>
        Observable.throw(this.handleError(e, new Date().getTime()))
      );
  }

  getObservationCoreChar(identifier): Observable<IPatientContext> {
    return this.http
      .get<IPatientContext>(
        this.rebuild_DSTU2_STU3_Url(
          "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3"
        ) +
          "/Observation?category=core-characteristics&patient=" +
          identifier,
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
        "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJHZW5lcmljLUhzaSIsImNsaWVudF9pZCI6ImI1YWFhMGM2LTY5MDktNDQ3My1hMTFlLWZhNzQ5MmNkY2U2ZCIsImVwaWMuZWNpIjoidXJuOmVwaWM6Q3VycmVudC1BcHAtT3JjaGFyZC1Qcm9kdWN0aW9uIiwiZXBpYy5tZXRhZGF0YSI6IjdrVVdWYkVqOTRDVlpVVERnYmxCVzFmQ01fXzdRYjctX0Z3OC1mMEsyWWl5QVI1Y191emNNWlZDNWEwbjk5ZTFkTG8wZGF1MVBGLTlYdWEtUXlTMGZfYmg0bkVDMDRJOWJwN3VScHVZSzl2c3dNYzI1M09yZGNEMldjZ1lUbXNNIiwiZXBpYy50b2tlbnR5cGUiOiJhY2Nlc3MiLCJleHAiOjE1OTcyOTU2MzUsImlhdCI6MTU5NzI5MjAzNSwiaXNzIjoiR2VuZXJpYy1Ic2kiLCJqdGkiOiI0M2RiN2UxOC02ZTJhLTRhNjUtODE1Ny00MTg2ZTRmMjY2MGQiLCJuYmYiOjE1OTcyOTIwMzUsInN1YiI6ImVsZ0NNSzgxNklwZVJkOGxvdGo5ektTOXRpTS5PcUpqQVAxUXVNRnIuMC5ZMyJ9.Ms6W81uQuluUwZvtfgXHPH6fLGVTxxE2P092NRVBZKI48LQS5TlyON-KeOV-kK820etjT87Sp5N8DMpUp4xhVWGK3rEEOCRFRihkk1RkMDimJj_rDX2QyvwYg0782VihUdvybGypHWmmu9-0nUuU4ugZqn5ewKMd9MlNwEXkzMCzLsGdBJWuKuqHkSsKe1p6lMPtwgy0OzQ-jnYc-CQ_q0xKx2JcfOaJEX5gzgpZ7v-aZ1Z6loXgIypEEIXIMReBVe9zFF1dWRIIjEAng8KVw-Yaq7o3IHZjF1-W5roAV_yJfz_ZN-WUhVkLokfvvaKYevC2MUAjNBpd7ge7DEw6PQ"
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
    return url;
  }
}
