import { Injectable } from "@angular/core";
import { AppConfig } from "../app.config";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { UtilityService } from "../utility.service";
import { map, retry, catchError } from "rxjs/operators";
import { EMPTY } from "rxjs";

@Injectable()
export class ObservationCoreService {
  constructor(
    private http: HttpClient,
    private utilityService: UtilityService
  ) {}

  // Below method submit new records to the cibmtr
  getBundles(selectedResources, psScope): Array<Observable<any>> {
    let selectedChunkResources = this.utilityService.chunk(
      selectedResources,
      this.utilityService.chunkSize
    );
    let bundles = [];

    selectedChunkResources.forEach((selectedChunkResource) => {
      bundles.push(this.getBundleEntry(selectedChunkResource, psScope));
    });
    return bundles;
  }

  getBundleObservable(bundle) {
    return this.http.post(AppConfig.cibmtr_fhir_url + "Bundle", bundle).pipe(
      map(() => bundle),
      retry(1),
      catchError(() => EMPTY)
    );
  }

  // Below method submit updated records to the cibmtr
  getBundleEntry(selectedNewChunkResource, psScope) {
    let entries = [];
    selectedNewChunkResource.forEach((selectedChunkElement) => {
      if (selectedChunkElement.state === "normal") {
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
                value: fullUrl,
              },
            ],
          },
          request: {
            method: "PUT",
            url: `Observation/${resource.id}`,
          },
        });
      } else {
        const { fullUrl, resource } = selectedChunkElement;
        delete resource.id;
        entries.push({
          resource: {
            ...resource,
            status: "unknown",
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
                value: fullUrl,
              },
            ],
          },
          request: {
            method: "POST",
            url: "Observation",
          },
        });
      }
    });
    return {
      resourceType: "Bundle",
      type: "transaction",
      entry: entries,
    };
  }

  // getCibmtrObservationsCoreChar(subject, psScope): Observable<any> {
  //   const url =
  //     AppConfig.cibmtr_fhir_url +
  //     "Observation?subject=" +
  //     subject +
  //     "&_security=" +
  //     psScope +
  //     "&_total=accurate&_count=500&category=core-characteristics";
  //   return this.http.get(url);
  // }
}
