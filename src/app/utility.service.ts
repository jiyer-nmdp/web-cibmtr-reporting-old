import { Injectable } from "@angular/core";
import { EMPTY, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { expand, map, reduce } from "rxjs/operators";
import {AppConfig} from "./app.config";
import {LocalStorageService} from "angular-2-local-storage";

@Injectable({
  providedIn: "root",
})
export class UtilityService {
  //IE data clone issue with router state object
  data: any;
  chunkSize: number = 30;

  constructor(private http: HttpClient,  private _localStorageService: LocalStorageService) {}

  //Reusable methods defined in this Components

  /**
   * Recursively fetch next url page
   * @param url
   * @param theHeaders
   */
  getPage(url, theHeaders) {
    return this.http.get(url, { headers: theHeaders }).pipe(
      expand((response: any) => {
        let next =
          response.link && response.link.find((l) => l.relation === "next");
        if (next) {
          return this.http.get(next.url, { headers: theHeaders });
        } else {
          return EMPTY;
        }
      }),
      map((response: any) => {
        if (response.entry) {
          return response.entry.flatMap((array) => array);
        }
        return [];
      }),
      reduce((acc: any[], x: any) => acc.concat(x), [])
    );
  }

  //rewrite if iss url contains "DSTU2" string
  rebuild_DSTU2_STU3_Url(url: string) {
    if (url.includes("DSTU2")) {
      return url.replace("DSTU2", "STU3");
    }
    return url;
  }

  /**
   * Bundle Chunck
   * @param observations
   */
  chunk(array, size) {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
      chunked_arr.push(array.slice(index, size + index));
      index += size;
    }
    return chunked_arr;
  }

  /**
   * Create a Fhir bundle of the returned observations
   * @param observations
   */

  bundleObservations(observations) {
    let filteredObservations;
    let obsArray = JSON.parse(observations);
    if (obsArray) {
      filteredObservations = obsArray.filter((obs) => {
        return obs.resource && obs.resource.resourceType === "Observation";
      });
    }
    if (filteredObservations) {
      return {
        entry: filteredObservations,
        total: filteredObservations.length,
        resourceType: "Bundle",
      };
    }
  }
  /**
   * Common utility method for cibmtr observations
   * @param subject
   * @param psScope
   * @param category
   */
  getCibmtrObservations(subject, psScope, category): Observable<any> {
    const url =
      AppConfig.cibmtr_fhir_url +
      "Observation?subject=" +
      (subject.startsWith("http") ? subject : this._localStorageService.get("iss") + "/" + subject) +
      "&_security=" +
      psScope +
      "&_total=accurate&_count=500&category=" + category;
    return this.http.get(url);
  }


  /**
   * Correct Resource URL in logicahealth resources
   * @param selectedEntries
   */
  buildSelectedResources(selectedEntries) {
    let selectedResources = [];
    const flattenSelectedEntries = Array.prototype.concat.apply(
      [],
      selectedEntries
    );
    flattenSelectedEntries.forEach((selectedEntry) => {
      selectedResources.push(selectedEntry);
    });

    selectedResources.forEach((selectedEntry) => {
      if (!selectedEntry.resource.subject.reference.startsWith("http")) {
        selectedEntry.resource.subject.reference = this._localStorageService.get("iss") + "/" + selectedEntry.resource.subject.reference;
      }
      if (selectedEntry.resource.performer && !selectedEntry.resource.performer[0].reference.startsWith("http")) {
        selectedEntry.resource.performer[0].reference = this._localStorageService.get("iss") + "/" + selectedEntry.resource.performer[0].reference;
      }
    });
    return selectedResources;
  }
}
