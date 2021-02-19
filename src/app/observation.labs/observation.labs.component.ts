import { Component, OnInit } from "@angular/core";
import { Patient } from "../model/patient.";
import { ObservationLabsService } from "./observation.labs.service";
import { UtilityService } from "../utility.service";
import { mergeMap } from "rxjs/operators";
import { EMPTY, from } from "rxjs";
import { AppConfig } from "../app.config";
import { CustomHttpClient } from "../client/custom.http.client";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";

@Component({
  selector: "app-observation.labs",
  animations: [
    trigger("alertState", [
      state(
        "show",
        style({
          opacity: 1,
        })
      ),
      state(
        "hide",
        style({
          opacity: 0,
        })
      ),
      transition("show => hide", animate("600ms ease-out")),
      transition("hide => show", animate("1000ms ease-in")),
    ]),
  ],
  templateUrl: "./observation.labs.component.html",
  styleUrls: ["./observation.labs.component.scss"],
})
export class ObservationLabsComponent implements OnInit {
  labs: any;
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
  ehrpatient: Patient;
  isAllSelected: boolean;
  isAlldisabled: boolean;
  totalSuccessCount: number;
  totalFailCount: number;
  success: boolean = false;
  error: boolean = false;

  constructor(
    private http: CustomHttpClient,
    public observationlabsService: ObservationLabsService,
    utility: UtilityService
  ) {
    let data = utility.data;
    this.labs = JSON.parse(data.labs);
    this.psScope = data.psScope;
  }

  ngOnInit() {
    const subj = this.labs.entry[0].resource.subject.reference;
    const psScope = this.psScope;

    this.now = new Date();

    if (
      this.labs &&
      this.labs.entry &&
      this.labs.entry.length > 0 &&
      this.labs.entry[0].resource.subject
    ) {
      this.observationlabsService
        .getCibmtrObservationsLabs(subj, psScope)
        .expand((response) => {
          let next =
            response.link && response.link.find((l) => l.relation === "next");
          if (next) {
            let modifiedUrl =
              AppConfig.cibmtr_fhir_update_url + "?" + next.url.split("?")[1];
            return this.http.get(modifiedUrl);
          } else {
            return EMPTY;
          }
        })
        //{return response.entry ? flatMap((array) => array)) : response}
        .map((response) => {
          if (response.entry) {
            return response.entry.flatMap((array) => array);
          }
          return [];
        })
        .reduce((acc, x) => acc.concat(x), [])
        .subscribe(
          (savedEntries) => {
            let entries = this.labs.entry;
            if (entries && entries.length > 0) {
              // filtering the entries to only Observations
              let observationEntries = entries.filter(function (item) {
                return item.resource.resourceType === "Observation";
              });

              for (let j = 0; j < observationEntries.length; j++) {
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
              }
            }
          },
          (error) => {
            console.log(
              "error occurred while fetching saved observations",
              error
            );
          }
        );
    }
  }

  getNodeValue(value) {
    if (value) {
      if (
        value.valueCodeableConcept &&
        value.valueCodeableConcept.coding[0] &&
        value.valueCodeableConcept.coding[0].code
      ) {
        return value.valueCodeableConcept.coding[0].code;
      } else if (value.valueDateTime) {
        return value.valueDateTime;
      } else if (value.valueString) {
        return value.valueString;
      } else if (
        value.valueQuantity &&
        (value.valueQuantity.value || value.valueQuantity.unit)
      ) {
        if (value.valueQuantity.value && value.valueQuantity.unit) {
          return value.valueQuantity.value + " " + value.valueQuantity.unit;
        } else if (value.valueQuantity.value) {
          return value.valueQuantity.value;
        }
      } else if (value.valueTime) {
        return value.valueTime;
      } else if (value.valueBoolean) {
        return value.valueBoolean;
      }
    }
  }

  //code
  getComponentValue(component) {
    if (component) {
      let components = [];
      for (let i = 0; i < component.length; i++) {
        let code = component[i].code.text + ":" + " ";
        let nodeValue = this.getNodeValue(component[i]);
        components.push(code + nodeValue);
      }
      components.join(",");
      return components;
    }
  }
  //valueDateTime //valuesampledData //valueAttachemnt(attachement) //ValueInteger  //ValueRange - range.low.value - high.value

  submitToCibmtr() {
    //reset
    this.selectedNewEntries = [];
    this.selectedUpdatedEntries = [];
    this.selectedNewResources = [];
    this.selectedUpdatedResources = [];

    // New Records
    this.selectedNewEntries.push(
      this.labs.entry.filter((m) => m.selected === true && m.state === "bold")
    );

    this.selectedNewResources = Array.prototype.concat.apply(
      [],
      this.selectedNewEntries
    );

    // Updated Records
    this.selectedUpdatedEntries.push(
      this.labs.entry.filter((m) => m.selected === true && m.state === "normal")
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
      let bundles = this.observationlabsService.getBundles(
        totalEntries,
        this.psScope
      );

      let _successCount = 0;

      from(bundles)
        .pipe(
          mergeMap((bundle) =>
            this.observationlabsService.getBundleObservable(bundle)
          )
        )
        .finally(() => {
          this.totalSuccessCount = _successCount;
          this.totalFailCount = totalEntries.length - _successCount;
          this.checkForSelectAll();
        })
        .subscribe(
          (response) => {
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
            console.log(
              "error occurred while fetching saved observations",
              errorBundle
            );
          }
        );
    }
  }

  // buildSelectedResources(selectedEntries) {
  //   let selectedResources = [];
  //   const flattenSelectedEntries = Array.prototype.concat.apply(
  //     [],
  //     selectedEntries
  //   );
  //   flattenSelectedEntries.forEach((selectedEntry) => {
  //     selectedResources.push(selectedEntry.resource);
  //   });
  //   return selectedResources;
  // }

  checkForSelectAll() {
    this.isAllSelected = this.labs.entry.every((entry) => entry.selected);
    this.isAlldisabled = this.labs.entry.every(
      (entry) => entry.selected && entry.state === "lighter"
    );
  }

  selectAll() {
    let toggleStatus = this.isAllSelected;
    this.labs.entry.forEach((entry) => {
      if (entry.state != "lighter") {
        entry.selected = toggleStatus;
      }
    });
  }

  toggleOption = function () {
    this.isAllSelected = this.labs.entry.every(function (entry) {
      return entry.selected;
    });
  };

  toggleAllOption = function () {
    this.isAlldisabled = this.labs.entry.every(function (entry) {
      return entry.disabled;
    });
  };

  get toggleAlert() {
    return this.totalSuccessCount > 0 || this.totalFailCount > 0
      ? "show"
      : "hide";
  }
}
