import { Injectable } from "@angular/core";
import { AppConfig } from "../app.config";
import { Observable, from } from "rxjs";

import { CustomHttpClient } from "../client/custom.http.client";
import { concatMap } from "rxjs-compat/operators/concatMap";
import { LocalStorageService } from "angular-2-local-storage";
import { UtilityService } from "../utility.service";

@Injectable()
export class ObservationAgvhdService {
  constructor(
    private http: CustomHttpClient,
    private _localStorageService: LocalStorageService,
    private utilityService: UtilityService
  ) {}

  // Below method submit new records to the cibmtr
  postNewRecords(selectedResources, psScope): Observable<any> {
    return from(selectedResources).pipe(
      concatMap((selectedResource: any) => {
        const { id, ...remainingfields } = selectedResource;
        return this.http.post(
          AppConfig.cibmtr_fhir_update_url + "Observation",
          {
            ...remainingfields,
            status: status || "unknown",
            meta: {
              security: [
                {
                  system: AppConfig.cibmtr_centers_namespace,
                  code: psScope,
                },
              ],
            },
            identifier: [
              {
                use: "official",
                system: AppConfig.epic_logicalId_namespace,
                value:
                  this.utilityService.rebuild_DSTU2_STU3_Url(
                    this._localStorageService.get("iss")
                  ) +
                  "/Observation/" +
                  id,
              },
            ],
          }
        );
      })
    );
  }

  // Below method submit updated records to the cibmtr
  postUpdatedRecords(selectedResources, psScope): Observable<any> {
    // Prepare the map of Id and resources
    let sMap = {};

    selectedResources.forEach((selectedResource) => {
      sMap[selectedResource.resource.id] = selectedResource.resource;
    });

    //Updated the FHIR will Overwrite the Existing Attribute , Creating the Identifier and Meta tags again.
    return from(Object.keys(sMap)).pipe(
      concatMap((key) => {
        const ehrId: any = sMap[key];
        return this.http.put(
          AppConfig.cibmtr_fhir_update_url + "Observation/" + key,
          {
            ...sMap[key],
            meta: {
              security: [
                {
                  system: AppConfig.cibmtr_centers_namespace,
                  code: psScope,
                },
              ],
            },
            identifier: [
              {
                use: "official",
                system: AppConfig.epic_logicalId_namespace,
                value: ehrId.extension[0].valueUri,
              },
            ],
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
