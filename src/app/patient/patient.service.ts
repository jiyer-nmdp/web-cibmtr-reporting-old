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
      this.utilityService.rebuild_DSTU2_STU3_Url(
        this._localStorageService.get("iss")
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
        this.utilityService.rebuild_DSTU2_STU3_Url(
          this._localStorageService.get("iss")
        ) +
          "/Observation?patient=" +
        "/Patient/" +identifier +
          "&" +
          AppConfig.observation_codes,
        {
          headers: this.buildEhrHeaders(),
        }
      )
      .catch((e: any) => Observable.of(null));
  }

  getObservationPriorityLabs(identifier): Observable<any> {

    let url = this.utilityService.rebuild_DSTU2_STU3_Url(
      this._localStorageService.get("iss")
      ) +
      "/Observation?patient=" +
      "/Patient/" + identifier + "&code=http://loinc.org%7c&code=" + AppConfig.loinc_codes.join(",");

    let result =  this.utilityService.getPage(url, this.buildEhrHeaders());
    result.subscribe(a => {console.log(a);
    console.log("priority");});
    return result;
  }

  getObservationLabs(identifier): Observable<any> {

    let url = this.utilityService.rebuild_DSTU2_STU3_Url(
          this._localStorageService.get("iss")
        ) +
      "/Observation?category=laboratory&_count=1000&patient=" +
      "/Patient/" + identifier;

    let result = this.utilityService.getPage(url, this.buildEhrHeaders()) ;
    result.subscribe(a => {console.log(a);
      console.log("labs");});
    return result;
    return result;
  }

  getObservationVitalSigns(identifier): Observable<any> {
    let url = this.utilityService.rebuild_DSTU2_STU3_Url(
          this._localStorageService.get("iss")
        ) +
      "/Observation?category=vital-signs&_count=200&patient=" +
      "/Patient/" + identifier ;

    let result =
    this.utilityService.getPage(url, this.buildEhrHeaders());
    result.subscribe(a => {console.log(a);
    console.log("vitals");});
    return result;
  }

  getObservationCoreChar(identifier): Observable<any> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(
          this._localStorageService.get("iss")
        ) +
          "/Observation?category=core-characteristics&patient=" +
        "/Patient/" + identifier;

    let result =
      this.utilityService.getPage(url, this.buildEhrHeaders());
    result.subscribe(a => {console.log(a);
      console.log("coreChars");});
    return result;
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
