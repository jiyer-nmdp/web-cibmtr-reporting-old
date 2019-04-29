import { Component, Input, OnInit } from "@angular/core";
import { AppConfig } from "../app.config";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-observation",
  templateUrl: "./observation.component.html"
})
export class ObservationComponent implements OnInit {
  constructor(public bsModalRef: BsModalRef) {}
  entry: any;
  toggle: any = [];
  codes: any = [];
  keys: any;

  ngOnInit() {
    let entries = this.entry;
    if (entries && entries.length > 0) {
      // filtering the entries to only Observations
      let observationEntries = entries.filter(function(item) {
        return item.resource.resourceType === "Observation";
      });
      // loop through the above mentioned codes
      for (let i = 0; i < AppConfig.codes.length; i++) {
        let matchingEntries = [];
        for (let j = 0; j < observationEntries.length; j++) {
          let matchingEntry = observationEntries[j].resource.code.coding.filter(
            function(coding) {
              return AppConfig.codes[i] === coding.code;
            }
          );
          if (matchingEntry && matchingEntry.length > 0) {
            matchingEntries.push(observationEntries[j]);
          }
        }
        if (matchingEntries && matchingEntries.length > 0) {
          this.codes[AppConfig.codes[i]] = {
            matchingEntries: matchingEntries,
            text: matchingEntries[0].resource.code.text
          };
        }
        this.toggle.push(false);
      }
      this.keys = Object.keys(this.codes);
    }
  }

  submitToCibmtr() {}

  toggleObservations(index) {
    this.toggle[index] = this.toggle[index] === false ? true : false;
  }

  selectAll(key) {
    let toggleStatus = !this.codes[key].isAllSelected;
    this.codes[key].matchingEntries.forEach(matchingEntry => {
      matchingEntry.selected = toggleStatus;
    });
  }

  toggleOption = function(key) {
    this.codes[key].isAllSelected = this.codes[key].matchingEntries.every(
      function(matchingEntry) {
        return matchingEntry.selected;
      }
    );
  };
}
