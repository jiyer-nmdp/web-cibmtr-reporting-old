import { Component, OnInit } from "@angular/core";
import { Patient } from "../model/patient.";import { Router } from "@angular/router";
import { ObservationLabsService } from "./observation.labs.service";

@Component({
  selector: "app-observation.labs",
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
  success: boolean;
  fail: boolean;
  ehrpatient: Patient;
  isAllSelected: boolean;
  isAlldisabled: boolean;

  constructor(
    public observationlabsService: ObservationLabsService,
    private router: Router
  ) {
    let data = this.router.getCurrentNavigation().extras.state.data;
    this.labs = data.labs;
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
        .subscribe(
          (response) => {
            this.savedBundle = response;
            let entries = this.labs.entry;
            let savedEntries = this.savedBundle.entry;
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
        if (
          value.valueQuantity.value &&
          value.valueQuantity.unit
        ) {
          return (
            value.valueQuantity.value +
            " " +
            value.valueQuantity.unit
          );
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
  getComponentValue(component){
    if (component) {
      let components = []
      for (let i = 0; i < component.length; i++) {
        let code = component[i].code.text + ':'
        let nodeValue = this.getNodeValue(component[i])
        components.push(code + nodeValue);
      }
      components.join(',')
      return components
    }
}
    //valueDateTime //valuesampledData //valueAttachemnt(attachement) //ValueInteger  //ValueRange - range.low.value - high.value
  

  submitToCibmtr() {
    //reset
    this.success = false;
    this.fail = false;
    this.selectedNewEntries = [];
    this.selectedUpdatedEntries = [];
    this.selectedNewResources = [];
    this.selectedUpdatedResources = [];
    // New Records
    this.selectedNewEntries.push(
      this.labs.entry.filter((m) => m.selected === true && m.state === "bold")
    );

    this.selectedNewResources = this.buildSelectedResources(
      this.selectedNewEntries
    );

    if (this.selectedNewResources && this.selectedNewResources.length > 0) {
      this.observationlabsService
        .postNewRecords(this.selectedNewResources, this.psScope)
        .subscribe(
          (response) => {
            let id = response.identifier[0].value.substring(
              response.identifier[0].value.lastIndexOf("/") + 1
            );
            Array.prototype.concat
              .apply([], this.selectedNewEntries)
              .filter((e) => e.resource.id === id)[0].state = "lighter";
            this.success = true;
            // This subscribe will be called for every successful post of new record
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
    this.selectedUpdatedEntries.push(
      this.labs.entry.filter((m) => m.selected === true && m.state === "normal")
    );

    this.selectedUpdatedResources = Array.prototype.concat.apply(
      [],
      this.selectedUpdatedEntries
    );
    if (
      this.selectedUpdatedResources &&
      this.selectedUpdatedResources.length > 0
    ) {
      this.observationlabsService
        .postUpdatedRecords(this.selectedUpdatedResources, this.psScope)
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

  buildSelectedResources(selectedEntries) {
    let selectedResources = [];
    const flattenSelectedEntries = Array.prototype.concat.apply(
      [],
      selectedEntries
    );
    flattenSelectedEntries.forEach((selectedEntry) => {
      selectedResources.push(selectedEntry.resource);
    });
    return selectedResources;
  }

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
}
