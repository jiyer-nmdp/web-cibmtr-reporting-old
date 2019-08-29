import { Injectable } from "@angular/core";
import { AppConfig } from "../app.config";
import { Observable, from } from "rxjs";

import { CustomHttpClient } from "../client/custom.http.client";
import { concatMap } from "rxjs-compat/operators/concatMap";

@Injectable()
export class ObservationService {
  constructor(private http: CustomHttpClient) {}

  // Below method submit new records to the cibmtr
  postNewRecords(selectedResources): Observable<any> {
    return from(selectedResources).pipe(
      concatMap(selectedResource => {
        return this.http.post(
          AppConfig.cibmtr_fhir_update_url + "/Observation",
          selectedResource
        );
      })
    );
  }

  // Below method submit updated records to the cibmtr
  postUpdatedRecords(selectedResources): Observable<any> {
    // Prepare the map of Id and resources
    let sMap = {};
    selectedResources.forEach(selectedResource => {
      sMap[selectedResource.resource.id] = selectedResource.resource;
    });

    return from(Object.keys(sMap)).pipe(
      concatMap(key => {
        return this.http.put(
          AppConfig.cibmtr_fhir_update_url + "/Observation/" + key,
          sMap[key]
        );
      })
    );
  }

  getCibmtrObservations(subject): Observable<any> {
    const url =
      AppConfig.cibmtr_fhir_update_url +
      "/Observation?subject=" +
      subject +
      "&_total=accurate&_count=1000";
    return this.http.get(url);
  }
}
