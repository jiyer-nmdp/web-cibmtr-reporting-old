import { Component, Input, OnInit } from "@angular/core";
import { AppConfig } from "../app.config";
import { ObservationAgvhdService } from "./observation.agvhd.service";
import { LocalStorageService } from "angular-2-local-storage";
import { Router, ActivatedRoute } from "@angular/router";
import { Patient } from "../model/patient.";
import { UtilityService } from "../utility.service";

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
  success: boolean;
  fail: boolean;

  constructor(
    public observationagvhdService: ObservationAgvhdService,
    private _localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private utility: UtilityService
  ) {
    let data = utility.data;
    this.agvhd = utility.bundleObservations(data.agvhd);
    this.psScope = data.psScope;
  }

  ngOnInit() {
    const subj = this.agvhd.entry[0].resource.subject.reference;
    const psScope = this.psScope;
    this.now = new Date();

    if (
      this.agvhd &&
      this.agvhd.entry &&
      this.agvhd.entry.length > 0 &&
      this.agvhd.entry[0].resource.subject
    ) {
      this.observationagvhdService
        .getCibmtrObservations(subj, psScope)
        .subscribe(
          (response) => {
            this.savedBundle = response;
            let entries = this.agvhd.entry;
            let savedEntries = this.savedBundle.entry;
            if (entries && entries.length > 0) {
              // filtering the entries to only Observations
              let observationEntries = entries.filter(function (item) {
                return item.resource.resourceType === "Observation";
              });
              // loop through the above mentioned codes
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
                          savedEntry.resource.extension &&
                          observationEntry.fullUrl ===
                            savedEntry.resource.extension[0].valueUri &&
                          observationEntry.resource.issued ===
                            savedEntry.resource.issued
                        );
                      });

                      // use - updated saved entry
                      let use = savedEntries.filter((savedEntry) => {
                        return (
                          savedEntry.resource.extension &&
                          observationEntry.fullUrl ===
                            savedEntry.resource.extension[0].valueUri &&
                          observationEntry.resource.issued !=
                            savedEntry.resource.issued
                        );
                      });

                      if (sse.length > 0) {
                        observationEntry.selected = true;
                        observationEntry.state = "lighter";
                        observationEntry.resource.id = sse[0].resource.id;
                        observationEntry.resource.extension = [];
                        observationEntry.resource.extension[0] =
                          sse[0].resource.extension[0];
                      }
                      // Case III - The record has been submitted and there were updates made after
                      else if (use.length > 0) {
                        observationEntry.state = "normal";
                        observationEntry.resource.id = use[0].resource.id;
                        observationEntry.resource.extension = [];
                        observationEntry.resource.extension[0] =
                          use[0].resource.extension[0];
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
    this.success = false;
    this.fail = false;
    this.selectedNewEntries = [];
    this.selectedUpdatedEntries = [];
    this.selectedNewResources = [];
    this.selectedUpdatedResources = [];
    // New Records
    this.codes.filter((value) => {
      this.selectedNewEntries.push(
        value.matchingEntries.filter(
          (m) => m.selected === true && m.state === "bold"
        )
      );
    });
    this.selectedNewResources = this.buildSelectedResources(
      this.selectedNewEntries
    );
    if (this.selectedNewResources && this.selectedNewResources.length > 0) {
      this.observationagvhdService
        .postNewRecords(this.selectedNewResources, this.psScope)
        .subscribe(
          () => {
            // This subscribe will be called for every successful post of new record
            Array.prototype.concat
              .apply([], this.selectedNewEntries)
              .forEach((entry) => {
                entry.state = "lighter";
              });
            this.success = true;
          },
          (error) => {
            console.error(error);
            this.fail = true;
          },
          () => {
            this.checkForSelectAll();
          }
        );
    }

    // Updated Records
    this.codes.filter((value) => {
      this.selectedUpdatedEntries.push(
        value.matchingEntries.filter(
          (m) => m.selected === true && m.state === "normal"
        )
      );
    });

    this.selectedUpdatedResources = Array.prototype.concat.apply(
      [],
      this.selectedUpdatedEntries
    );
    if (
      this.selectedUpdatedResources &&
      this.selectedUpdatedResources.length > 0
    ) {
      this.observationagvhdService
        .postUpdatedRecords(this.selectedUpdatedResources, this.psScope)
        .retry(1)
        .subscribe(
          (response) => {
            Array.prototype.concat
              .apply([], this.selectedUpdatedEntries)
              .filter((e) => e.resource.id === response.id)[0].state =
              "lighter";
            this.success = true;
            // This subscribe will be called for every successful updated of the record
          },
          (error) => {
            console.error(error);
            this.fail = true;
          },
          () => {
            this.checkForSelectAll();
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

  buildSelectedResources(selectedEntries) {
    let selectedResources = [];
    const flattenSelectedEntries = Array.prototype.concat.apply(
      [],
      selectedEntries
    );
    flattenSelectedEntries.forEach((selectedEntry) => {
      let Ehrid = selectedEntry.resource.id;
      selectedEntry.resource.extension = this.buildExtensionArray(
        this._localStorageService.get("iss") + "/Observation" + "/" + Ehrid
      );
      selectedResources.push(selectedEntry.resource);
    });
    return selectedResources;
  }

  //Appending  Observation Extension with Full Uri as EHR endpoint in Cibmtr FHIR Server
  buildExtensionArray(valueUri) {
    const extension = [
      {
        url:
          "http://hl7.org/fhir/4.0/StructureDefinition/extension-Meta.source",
        valueUri: valueUri,
      },
    ];
    return extension;
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

  /*selectAllEntries() {
    let toggleStatus = !this.codes[].isAllSelected;
    this.codes[].matchingEntries.forEach(matchingEntry => {
      if (matchingEntry.state != "lighter") {
        matchingEntry.selected = toggleStatus;
      }
    });
  }*/

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
