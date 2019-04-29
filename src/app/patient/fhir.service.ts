import { Injectable } from "@angular/core";
import { Headers, RequestOptions } from "@angular/http";
import { NMDPHttpInterceptor } from "@nmdp/nmdp-login/Angular/interceptor/nmdp.interceptor";
import { AppConfig } from "../app.config";
import { Observable } from "rxjs";

@Injectable()
export class FhirService {
  private headers: Headers = new Headers({
    "Content-type": "application/json"
  });
  private options: RequestOptions = new RequestOptions({
    headers: this.headers
  });

  constructor(private http: NMDPHttpInterceptor) {}

  lookupPatientCrid(identifier): Promise<any> {
    let crid = undefined;
    let url = AppConfig.fhir_patient_lookup.concat(identifier);

    return this.http
      .get(url, this.options)
      .toPromise()
      .then(resp => {
        let total = resp.json().total;
        if (total && total > 0) {
          crid = resp.json().identifiers.filter(identifier => {
            return identifier.system === "http://cibmtr.org/fhir/crid";
          });
          return crid;
        }
      })
      .catch(this.handleError);
  }

  getCrid(payload): Observable<any> {
    let url = AppConfig.crid_service_endpoint;
    return this.http.put(url, payload, this.options);
  }

  submitPatient(updatedEhrPatient) {
    let fhirUrl = AppConfig.cibmtr_fhir_base_url + "/Patient";
    return this.http.post(fhirUrl, updatedEhrPatient, this.options);
  }

  handleError(error: any): Promise<any> {
    if (error == null) {
      error = "undefined";
    }
    if (error != null) {
      console.error("An error occurred" + error);
      return Promise.reject(error.message || error);
    } else {
      console.error("An unknown error occurred");
      return Promise.reject("Unknown error");
    }
  }
}
