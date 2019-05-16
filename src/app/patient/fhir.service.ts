import { Injectable } from "@angular/core";
import { AppConfig } from "../app.config";
import { Observable } from "rxjs";
import "rxjs/Rx";
import { CustomHttpClient } from "../client/custom.http.client";

@Injectable()
export class FhirService {
  constructor(private http: CustomHttpClient) {}

  lookupPatientCrid(identifier): Observable<any> {
    let fhirGetUrl = AppConfig.cibmtr_fhir_base_url.concat(identifier);
    return this.http.get(fhirGetUrl);
  }

  getCrid(payload): Observable<any> {
    let cridUrl = AppConfig.crid_service_endpoint;
    return this.http.put(cridUrl, payload);
  }

  submitPatient(updatedEhrPatient) {
    let fhirPostUrl = AppConfig.cibmtr_fhir_update_url + "/Patient";
    return this.http.post(fhirPostUrl, updatedEhrPatient);
  }

  handleError(error: any): Observable<any> {
    if (error == null) {
      error = "undefined";
    }
    if (error != null) {
      console.error("An error occurred" + error);
      return Observable.throw(error.message || error);
    } else {
      console.error("An unknown error occurred");
      return Observable.throw("Unknown error");
    }
  }
}
