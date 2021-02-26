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
import { UtilityService } from "../utility.service";

@Injectable()
export class PatientService {
  constructor(
    private http: HttpClient,
    private _localStorageService: LocalStorageService,
    private utilityService: UtilityService
  ) {}

  getPatient(identifier): Observable<IPatientContext> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(this._localStorageService.get("iss")) +
          "/Patient/" + identifier;
    return this.http
        .get<IPatientContext>(url, {
          headers: this.buildEhrHeaders(),
          })
        .catch((e: any) =>
          Observable.throw(this.handleError(e, new Date().getTime()))
        );
  }

  getObservation(identifier): Observable<IPatientContext> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(this._localStorageService.get("iss")) +
          "/Observation?patient=" + identifier + "&" + AppConfig.observation_codes;
      return this.utilityService.getPage(url, this.buildEhrHeaders());
   }

  getObservationPriorityLabs(identifier): Observable<IPatientContext> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(this._localStorageService.get("iss")) +
          "/Observation?patient=" + identifier + "&_count=1000&code=http://loinc.org%7c&code=" + AppConfig.loinc_codes.join(",");
    return  this.utilityService.getPage(url, this.buildEhrHeaders());
  }

  getObservationLabs(identifier): Observable<IPatientContext> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(this._localStorageService.get("iss")) +
      "/Observation?category=laboratory&_count=1000&patient=" + identifier;
    return this.utilityService.getPage(url, this.buildEhrHeaders()) ;
  }

  getObservationVitalSigns(identifier): Observable<IPatientContext> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(this._localStorageService.get("iss")) +
      "/Observation?category=vital-signs&_count=1000&patient=" + identifier ;
    return this.utilityService.getPage(url, this.buildEhrHeaders());
  }

  getObservationCoreChar(identifier): Observable<IPatientContext> {
    let url =
        this.utilityService.rebuild_DSTU2_STU3_Url(this._localStorageService.get("iss")) +
          "/Observation?category=core-characteristics&patient=" + identifier;
    return this.utilityService.getPage(url, this.buildEhrHeaders());
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
