import { Component, OnInit } from "@angular/core";
import { ObservationAgvhdService } from "./observation.agvhd.service";
import { UtilityService } from "../utility.service";
import { finalize, mergeMap, expand, map, reduce } from "rxjs/operators";
import { EMPTY, from } from "rxjs";
import { AppConfig } from "../app.config";
import { HttpClient } from "@angular/common/http";
import { SpinnerService } from "../spinner/spinner.service";

@Component({
  selector: "app-observation",
  templateUrl: "./observation.agvhd.component.html",
  styleUrls: ["./observation.agvhd.component.scss"],
})
export class ObservationAgvhdComponent implements OnInit {
  agvhd: any;
  savedBundle: any;
  toggle: any = [];
  codes: any = [];
  keys: any;
  toggleAll: boolean; // this is for showAll
  now: any;
  selectedNewEntries = [];
  selectedUpdatedEntries = [];
  selectedNewResources = [];
  selectedUpdatedResources = [];
  psScope: string;
  cibmtrPatientFullUri: string;
  isAllSelected: boolean;
  isAlldisabled: boolean;
  totalSuccessCount: number;
  totalFailCount: number;

  constructor(
    private http: HttpClient,
    public observationagvhdService: ObservationAgvhdService,
    utility: UtilityService,
    private spinner: SpinnerService
  ) {
    let data = utility.data;
    this.agvhd = utility.bundleObservations(data.agvhd).entry;
    this.psScope = data.psScope;
  }

  ngOnInit() {
    const subj = this.agvhd[0].resource.subject.reference;
    const psScope = this.psScope;

    this.now = new Date();

    if (this.agvhd.length > 0 && this.agvhd[0].resource.subject) {
      this.spinner.start();
      this.observationagvhdService
        .getCibmtrObservations(subj, psScope)
        .pipe(
          expand((response) => {
            let next =
              response.link && response.link.find((l) => l.relation === "next");
            if (next) {
              let modifiedUrl =
                AppConfig.cibmtr_fhir_url + "?" + next.url.split("?")[1];
              return this.http.get(modifiedUrl);
            } else {
              return EMPTY;
            }
          }),
          //{return response.entry ? flatMap((array) => array)) : response}
          map((response: any) => {
            if (response.entry) {
              return response.entry.flatMap((array) => array);
            }
            return [];
          }),
          reduce((acc, x) => acc.concat(x), [])
        )
        .subscribe(
          (savedEntries) => {
            this.spinner.end();
            let ehr_entries = this.agvhd;
            if (ehr_entries && ehr_entries.length > 0) {
              // filtering the entries to only Observations
              let observationEntries = ehr_entries.filter(function (item) {
                return item.resource.resourceType === "Observation";
              });
              for (let i = 0; i < AppConfig.codes.length; i++) {
                let matchingEntries = [];
                for (let j = 0; j < observationEntries.length; j++) {
                  let matchingEntry = observationEntries[
                    j
                  ].resource.code.coding.filter(function (coding) {
                    return AppConfig.codes[i] === coding.code;
                  });
                  if (matchingEntry && matchingEntry.length > 0) {
                    let observationEntry = observationEntries[j];
                    // Case I - The record has not been submitted
                    observationEntry.state = "bold";
                    if (savedEntries && savedEntries.length > 0) {
                      // Case II - The record has been submitted and there were no updates
                      // we cannot submit these records unless there is a change in data.
                      // sse stands for submitted saved entry
                      let sse = savedEntries.filter((savedEntry) => {
                        return (
                          savedEntry.resource.identifier &&
                          observationEntry.fullUrl ===
                            savedEntry.resource.identifier[0].value &&
                          observationEntry.resource.issued ===
                            savedEntry.resource.issued
                        );
                      });

                      // use - updated saved entry
                      let use = savedEntries.filter((savedEntry) => {
                        return (
                          savedEntry.resource.identifier &&
                          observationEntry.fullUrl ===
                            savedEntry.resource.identifier[0].value &&
                          observationEntry.resource.issued !=
                            savedEntry.resource.issued
                        );
                      });

                      if (sse.length > 0) {
                        observationEntry.selected = true;
                        observationEntry.state = "lighter";
                        observationEntry.resource.id = sse[0].resource.id;
                      }
                      // Case III - The record has been submitted and there were updates made after
                      else if (use.length > 0) {
                        observationEntry.state = "normal";
                        observationEntry.resource.id = use[0].resource.id;
                      }
                    }
                    matchingEntries.push(observationEntry);
                  }
                }
                if (matchingEntries && matchingEntries.length > 0) {
                  this.codes[AppConfig.codes[i]] = {
                    matchingEntries: matchingEntries,
                    text: matchingEntries[0].resource.code.text,
                  };
                }
                this.toggle.push(false);
              }
              this.keys = Object.keys(this.codes);
            }
          },
          (error) => {
            this.spinner.reset();
            console.log(
              "error occurred while fetching saved observations",
              error
            );
          }
        );
    }
  }

  submitToCibmtr() {
    //reset
    this.selectedNewEntries = [];
    this.selectedUpdatedEntries = [];
    this.selectedNewResources = [];
    this.selectedUpdatedResources = [];

    // New Records
    this.selectedNewEntries.push(
      this.agvhd.filter((m) => m.selected === true && m.state === "bold")
    );

    this.selectedNewResources = Array.prototype.concat.apply(
      [],
      this.selectedNewEntries
    );

    // Updated Records
    this.selectedUpdatedEntries.push(
      this.agvhd.filter((m) => m.selected === true && m.state === "normal")
    );

    this.selectedUpdatedResources = Array.prototype.concat.apply(
      [],
      this.selectedUpdatedEntries
    );

    let totalEntries = [
      ...this.selectedNewResources,
      ...this.selectedUpdatedResources,
    ];

    if (totalEntries && totalEntries.length > 0) {
      let bundles = this.observationagvhdService.getBundles(
        totalEntries,
        this.psScope
      );

      let _successCount = 0;

      this.spinner.start();
      from(bundles)
        .pipe(
          mergeMap((bundle) =>
            this.observationagvhdService.getBundleObservable(bundle)
          ),
          finalize(() => {
            this.spinner.end();
            this.totalSuccessCount = _successCount;
            this.totalFailCount = totalEntries.length - _successCount;
            this.checkForSelectAll();
          })
        )
        .subscribe(
          (response: any) => {
            response.entry &&
              response.entry.forEach((entry) => {
                let idValue = entry.resource.identifier[0].value;
                const matchedEntry = totalEntries.find((e) => {
                  return idValue === e.fullUrl;
                });
                matchedEntry.state = "lighter";
                _successCount++;
              });
          },
          (errorBundle) => {
            this.spinner.reset();
            console.log(
              "error occurred while fetching saved observations",
              errorBundle
            );
          }
        );
    }
  }
  checkForSelectAll() {
    this.keys.forEach((key, i) => {
      this.codes[key].isAllSelected = this.codes[key].matchingEntries.every(
        (matchingEntry) => matchingEntry.selected
      );
      this.codes[key].isAlldisabled = this.codes[key].matchingEntries.every(
        (matchingEntry) =>
          matchingEntry.selected && matchingEntry.state === "lighter"
      );
    });
  }

  toggleObservations(index) {
    this.toggle[index] = this.toggle[index] === false ? true : false;
    if (this.toggle[index] === true) {
      this.keys.forEach((key, i) => {
        if (index === i) {
          this.codes[key].isAllSelected = this.codes[key].matchingEntries.every(
            (matchingEntry) => matchingEntry.selected
          );
          this.codes[key].isAlldisabled = this.codes[key].matchingEntries.every(
            (matchingEntry) =>
              matchingEntry.selected && matchingEntry.state === "lighter"
          );
        }
      });
    }
  }

  toggleAllObservations() {
    this.toggleAll = this.toggleAll === false ? true : false;
    if (this.toggleAll === true) {
      this.keys.forEach((key, index) => {
        this.toggle[index] = false;
      });
    }
    if (this.toggleAll === false) {
      this.keys.forEach((key, index) => {
        this.codes[key].isAllSelected = this.codes[key].matchingEntries.every(
          (matchingEntry) => matchingEntry.selected
        );
        this.codes[key].isAlldisabled = this.codes[key].matchingEntries.every(
          (matchingEntry) =>
            matchingEntry.selected && matchingEntry.state === "lighter"
        );
        this.toggle[index] = true;
      });
    }
  }

  selectAll(key) {
    let toggleStatus = !this.codes[key].isAllSelected;
    this.codes[key].matchingEntries.forEach((matchingEntry) => {
      if (matchingEntry.state != "lighter") {
        matchingEntry.selected = toggleStatus;
      }
    });
  }

  resourcevalue(entry) {
    if (
      entry.resource.valueCodeableConcept &&
      entry.resource.valueCodeableConcept.coding[0] &&
      entry.resource.valueCodeableConcept.coding[0].code
    ) {
      return entry.resource.valueCodeableConcept.coding[0].code;
    } else if (entry.resource.valueDateTime) {
      return entry.resource.valueDateTime;
    } else if (entry.resource.valueString) {
      return entry.resource.valueString;
    } else if (
      entry.resource.valueQuantity &&
      (entry.resource.valueQuantity.value || entry.resource.valueQuantity.unit)
    ) {
      if (
        entry.resource.valueQuantity.value &&
        entry.resource.valueQuantity.unit
      ) {
        return (
          entry.resource.valueQuantity.value +
          " " +
          entry.resource.valueQuantity.unit
        );
      } else if (entry.resource.valueQuantity.value) {
        return entry.resource.valueQuantity.value;
      } else {
        return;
      }
    } else if (entry.resource.valueTime) {
      return entry.resource.valueTime;
    } else if (entry.resource.valueBoolean) {
      return entry.resource.valueBoolean;
    }
  }

  toggleOption = function (key) {
    this.codes[key].isAllSelected = this.codes[key].matchingEntries.every(
      function (matchingEntry) {
        return matchingEntry.selected;
      }
    );
  };
}
