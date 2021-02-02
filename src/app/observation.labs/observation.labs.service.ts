import { Injectable } from "@angular/core";
import { AppConfig } from "../app.config";
import { Observable, from } from "rxjs";
import { CustomHttpClient } from "../client/custom.http.client";
import { concatMap } from "rxjs-compat/operators/concatMap";
import { LocalStorageService } from "angular-2-local-storage";
import { UtilityService } from "../utility.service";
import { catchError } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class ObservationLabsService {
  constructor(
    private http: CustomHttpClient,
    private _localStorageService: LocalStorageService,
    private utilityService: UtilityService
  ) {}

  // Below method submit new records to the cibmtr
  getDataFromNewRecords(selectedResources, psScope): Array<Observable<any>> {
    let selectedChunkResources = this.utilityService.chunk(selectedResources);
    let bundles = [];

    selectedChunkResources.forEach((selectedChunkResource) => {
      bundles.push(this.getBundleEntry(selectedChunkResource, psScope));
    });
    return bundles;
  }

  getBundleObservable(bundle) {
    return this.http
      .post(AppConfig.cibmtr_fhir_update_url + "Bundle", bundle)
      .pipe(catchError((error) => of(error)));
  }

  getBundleEntry(selectedNewChunkResource, psScope) {
    let entries = [];

    selectedNewChunkResource.forEach((selectedChunkElement) => {
      const { id, status, ...remainingfields } = selectedChunkElement;
      entries.push({
        resource: {
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
        },
        request: {
          method: "POST",
          url: "Observation",
        },
      });
    });

    if (selectedNewChunkResource.state === "normal") {
      this.getUpdatedEntry(selectedNewChunkResource, psScope);
    }

    return {
      resourceType: "Bundle",
      type: "transaction",
      entry: entries,
    };
  }

  // Below method submit updated records to the cibmtr
  getUpdatedEntry(selectedupdatedResources, psScope) {
    let entries = [];

    selectedupdatedResources.forEach((selectedChunkElement) => {
      const { fullUrl, resource } = selectedChunkElement;
      entries.push({
        resource: {
          ...resource,
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
                fullUrl,
            },
          ],
        },
        request: {
          method: "PUT",
          url: `Observation/${resource.id}`,
        },
      });
    });
  }

  getCibmtrObservationsLabs(subject, psScope): Observable<any> {
    const url =
      AppConfig.cibmtr_fhir_update_url +
      "Observation?subject=" +
      subject +
      "&_security=" +
      psScope +
      "&_total=accurate&_count=1000&category=laboratory";
    return this.http.get(url);
  }
}
