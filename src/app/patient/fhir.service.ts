import { Injectable } from "@angular/core";
import { AppConfig } from "../app.config";
import { Observable } from "rxjs";
import "rxjs/Rx";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class FhirService {
  constructor(private http: HttpClient) {}

  lookupPatientIdentifier(identifier): Observable<any> {
    const fhirGetUrl =
      AppConfig.cibmtr_fhir_url + "Patient?identifier=".concat(identifier);
    return this.http.get(fhirGetUrl);
  }

  getCrid(payload): Observable<any> {
    const cridUrl = AppConfig.crid_service_endpoint;
    return this.http.put(cridUrl, payload);
  }

  //Create EHR Patient in Cibmtr FHIR Server
  submitPatient(createEhrPatient) {
    const fhirPostUrl = AppConfig.cibmtr_fhir_url + "Patient";
    return this.http.post(fhirPostUrl, createEhrPatient);
  }

  //Update EHR Patient in Cibmtr FHIR Server
  updatePatient(updatedEhrPatient, logical_id) {
    const fhirUpdate = AppConfig.cibmtr_fhir_url + "Patient/" + logical_id;
    return this.http.put(fhirUpdate, updatedEhrPatient);
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
