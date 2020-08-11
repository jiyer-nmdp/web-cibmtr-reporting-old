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

  getObservationLabs(identifier): Observable<IPatientContext> {
    return this.http
      .get<IPatientContext>(
        this._localStorageService.get("iss") +
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
        this._localStorageService.get("iss") +
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

  getObservationCodeChar(identifier): Observable<IPatientContext> {
    return this.http
      .get<IPatientContext>(
        this._localStorageService.get("iss") +
          "/Condition?patient=" +
          identifier,
        {
          headers: this.buildEhrHeaders(),
        }
      )
      .catch((e: any) =>
        Observable.throw(this.handleError(e, new Date().getTime()))
      );
  }

  getCondition(identifier): Observable<IPatientContext> {
    return this.http
      .get<IPatientContext>(
        this._localStorageService.get("iss") +
          "/Condition?patient=" +
          identifier,
        {
          headers: this.buildEhrHeaders(),
        }
      )
      .catch((e: any) =>
        Observable.throw(this.handleError(e, new Date().getTime()))
      );
  }

  getMedicationStatement(identifier): Observable<IPatientContext> {
    return this.http
      .get<IPatientContext>(
        this._localStorageService.get("iss") +
          "/MedicationStatements?patient=" +
          identifier,
        {
          headers: this.buildEhrHeaders(),
        }
      )
      .catch((e: any) =>
        Observable.throw(this.handleError(e, new Date().getTime()))
      );
  }

  getProcedure(identifier): Observable<IPatientContext> {
    return this.http
      .get<IPatientContext>(
        this._localStorageService.get("iss") +
          "/Procedure?patient=" +
          identifier,
        {
          headers: this.buildEhrHeaders(),
        }
      )
      .catch((e: any) =>
        Observable.throw(this.handleError(e, new Date().getTime()))
      );
  }

  getDiagnosticReport(identifier): Observable<IPatientContext> {
    return this.http
      .get<IPatientContext>(
        this._localStorageService.get("iss") +
          "/DiagnosticReport?patient=" +
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
        `Bearer ${this._localStorageService.get("accessToken")}`
      );

    return ehrHeaders;
  }

  handleError(error: HttpErrorResponse, timestamp: any) {
    let errorMessage = `Unable to process request for \nURL : ${error.url}.  \nStatus: ${error.status}. \nStatusText: ${error.statusText} \nTimestamp : ${timestamp}`;
    alert(errorMessage);
    console.log(errorMessage);
  }
}
