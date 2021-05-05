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
        `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1cm46ZXBpYzphcHBvcmNoYXJkLmN1cnByb2QiLCJjbGllbnRfaWQiOiJiNWFhYTBjNi02OTA5LTQ0NzMtYTExZS1mYTc0OTJjZGNlNmQiLCJlcGljLmVjaSI6InVybjplcGljOkN1cnJlbnQtQXBwLU9yY2hhcmQtUHJvZHVjdGlvbiIsImVwaWMubWV0YWRhdGEiOiJ3dVdQcmFyVkVKU3RGdmRxc1d6MGI1QWh0Y0JWa0V5d2JXVTJxY1IxSDl5akhWeHlzVUtfZVRVVVRvdlRDaXFNb0ZYY1R1Y2Rscjh6b2I3MWpvUFd0NjdTVHhTUU11ZlBiNEc0ZFFFUVU3SHlNYXRkWnlyVXQwMHdaUkJ6QVVodyIsImVwaWMudG9rZW50eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjIwMjQ2MjQ4LCJpYXQiOjE2MjAyNDI2NDgsImlzcyI6InVybjplcGljOmFwcG9yY2hhcmQuY3VycHJvZCIsImp0aSI6IjRlNWI1ZjU1LTM0ZGEtNDFmOS1iOTQxLTEyZDE1ZWNjZjcwMyIsIm5iZiI6MTYyMDI0MjY0OCwic3ViIjoiZVE0dTQ0SE56Mi45VmxiWHdiU2c3THczIn0.JlycR1Iwr5lBdWn1a1Le0rOstDko1Foov9KaIdLY6Ek9AJ32ZcCoPChSm-KACvUWc-WgscnzMDw8YMfIk_EkMfx9SQ1OhHwemM1VyvkxsRcktVpU_-1DRZsLfo65_R44hphTi800Gk0BTKU4Nygj-ZTzHAl3RA2-DGJCZqe_ylnYzNR6JVbPcWq-wQfuU7ZFC-bWIvMvlQXBbzSd6KEczECILRoAmeoveDiGjSYLv4eSk5paJP24NJ_m_YQzkGOGxfrLUIi0QS8clLz4n9PDhKHjO_mcEHOIByfj4nmRCSouVZVBuo15h-CbvavvxtGd_AA82oQOo3AT3ctZerUwuw`
      );

    return ehrHeaders;
  }

  handleError(error: HttpErrorResponse, timestamp: any) {
    let errorMessage = `Unable to process request for \nURL : ${error.url}.  \nStatus: ${error.status}. \nStatusText: ${error.statusText} \nTimestamp : ${timestamp}`;
    alert(errorMessage);
    console.log(errorMessage);
  }
}
