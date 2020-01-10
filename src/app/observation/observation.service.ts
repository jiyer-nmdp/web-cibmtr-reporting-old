import { Injectable } from "@angular/core";
import { AppConfig } from "../app.config";
import { Observable, from } from "rxjs";

import { CustomHttpClient } from "../client/custom.http.client";
import { concatMap } from "rxjs-compat/operators/concatMap";

@Injectable()
export class ObservationService {
  constructor(private http: CustomHttpClient) {}

  // Below method submit new records to the cibmtr
  postNewRecords(selectedResources, psScope): Observable<any> {
    return from(selectedResources).pipe(
      concatMap(selectedResource => {
        return this.http.post(
          AppConfig.cibmtr_fhir_update_url + "Observation",
          {
            ...selectedResource,
            meta: {
              security: [
                {
                  system: AppConfig.cibmtr_centers_namespace,
                  code: psScope
                }
              ]
            }
          }
        );
      })
    );
  }

  // Below method submit updated records to the cibmtr
  postUpdatedRecords(selectedResources, psScope): Observable<any> {
    // Prepare the map of Id and resources
    let sMap = {};
    selectedResources.forEach(selectedResource => {
      sMap[selectedResource.resource.id] = selectedResource.resource;
    });

    return from(Object.keys(sMap)).pipe(
      concatMap(key => {
        return this.http.put(
          AppConfig.cibmtr_fhir_update_url + "Observation/" + key,
          {
            ...sMap[key],
            meta: {
              security: [
                {
                  system: AppConfig.cibmtr_centers_namespace,
                  code: psScope
                }
              ]
            }
          }
        );
      })
    );
  }

  getCibmtrObservations(subject, psScope): Observable<any> {
    const url =
      AppConfig.cibmtr_fhir_update_url +
      "Observation?subject=" +
      subject +
      "&_security=" +
      psScope +
      "&_total=accurate&_count=1000";
    return this.http.get(url);
  }
}
