import { Component, OnInit } from "@angular/core";
import { Patient } from "../model/patient.";
import { ObservationLabsService } from "./observation.labs.service";
import { UtilityService } from "../shared/service/utility.service";
import { mergeMap, expand, map, reduce, finalize } from "rxjs/operators";
import { EMPTY, forkJoin, from } from "rxjs";
import { AppConfig } from "../shared/constants/app.config";
import { HttpClient } from "@angular/common/http";
import { SpinnerService } from "../spinner/spinner.service";
import { ActivatedRoute } from "@angular/router";
import { Sort } from "@angular/material/sort";
import { GlobalErrorHandler } from "../global-error-handler";
import { LocalStorageService } from "angular-2-local-storage";

@Component({
  selector: "app-observation.labs",
  templateUrl: "./observation.labs.component.html",
  styleUrls: ["./observation.labs.component.scss"],
})
export class ObservationLabsComponent implements OnInit {
  labs: any;
  priority: any;
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
  categoryData: any = [];
  selectedOrg: any;

  constructor(
    private http: HttpClient,
    public observationlabsService: ObservationLabsService,
    private utility: UtilityService,
    private spinner: SpinnerService,
    private route: ActivatedRoute,
    private _localStorageService: LocalStorageService,
    private _gEH: GlobalErrorHandler
  ) {
    let data = utility.data;

    if (data.priorityLabs != "null") {
      this.priority = this.utility.bundleObservations(data.priorityLabs).entry;
    }

    if (data.labs) {
      this.labs = this.utility.bundleObservations(data.labs).entry;
    }

    this.selectedOrg = data.selectedOrg;
    this.psScope = this.selectedOrg.value;
  }

  ngOnInit() {
    this.categoryData = this.getCategoryData();
    this.sortHeader({ active: "time", direction: "desc" });
    this.now = new Date();

    const telecomUrlItems = this.selectedOrg.telecomUrlItems;

    this.spinner.start();

    if (telecomUrlItems && telecomUrlItems.length > 0) {
      let urls = telecomUrlItems.map((item) => item.value);
      forkJoin(urls.map((url) => this.getCibmtrLabs(url)));
    } else {
      this.getCibmtrLabs(this._localStorageService.get("iss"));
    }
    this.spinner.end();
  }

  getCibmtrLabs(url) {
    this.observationlabsService
      .getCibmtrObservationsLabs(url, this.selectedOrg.value)
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
          let entries = this.categoryData;
          if (entries?.length > 0) {
            //Filters Operationoutcome entries
            let observationEntries = entries.filter(function (item) {
              return item.resource.resourceType === "Observation";
            });

            for (let j = 0; j < observationEntries.length; j++) {
              let observationEntry = observationEntries[j];

              // Case I - Default state the record has not been submitted
              if (!observationEntry.state) {
                observationEntry.state = "bold";
                observationEntry.selected = false;
              }

              if (savedEntries?.length > 0) {
                // Case II - The record has been submitted and there were no updates
                // we cannot submit these records unless there is a change in data.
                // sse stands for submitted  saved entry

                let sse = savedEntries.filter((savedEntry) => {
                  const created_id =
                    savedEntry.resource.identifier[0].value.match(
                      new RegExp("/Observation/(.*)")
                    )[1];

                  return (
                    savedEntry.resource.identifier &&
                    observationEntry.resource.id === created_id &&
                    observationEntry.resource.issued ===
                      savedEntry.resource.issued
                  );
                });

                // use - updated saved entry
                let use = savedEntries.filter((savedEntry) => {
                  const updated_id =
                    savedEntry.resource.identifier[0].value.match(
                      new RegExp("/Observation/(.*)")
                    )[1];
                  return (
                    savedEntry.resource.identifier &&
                    observationEntry.resource.id === updated_id &&
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
          this._gEH.handleError(savedEntries);
        },
        (error) => {
          console.log(
            "error occurred while fetching saved observations",
            error
          );
          this._gEH.handleError(error);
        }
      );
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
      this.categoryData.filter((m) => m.selected === true && m.state === "bold")
    );

    this.selectedNewResources = Array.prototype.concat.apply(
      [],
      this.selectedNewEntries
    );

    // Updated Records
    this.selectedUpdatedEntries.push(
      this.categoryData.filter(
        (m) => m.selected === true && m.state === "normal"
      )
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

      this.spinner.start();
      from(bundles)
        .pipe(
          mergeMap((bundle) =>
            this.observationlabsService.getBundleObservable(bundle)
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
            this._gEH.handleError(response);
          },
          (errorBundle) => {
            this.spinner.reset();
            console.log(
              "error occurred while fetching saved observations",
              errorBundle
            );
            this._gEH.handleError(errorBundle);
          }
        );
    }
  }

  checkForSelectAll() {
    this.isAllSelected = this.categoryData.every((entry) => entry.selected);
    this.isAlldisabled = this.categoryData.every(
      (entry) => entry.selected && entry.state === "lighter"
    );
  }

  selectAll() {
    let toggleStatus = this.isAllSelected;
    this.categoryData.forEach((entry) => {
      if (entry.state != "lighter") {
        entry.selected = toggleStatus;
      }
    });
  }

  toggleOption = function () {
    this.isAllSelected = this.categoryData.every(function (entry) {
      return entry.selected;
    });
  };

  toggleAllOption = function () {
    this.isAlldisabled = this.categoryData.every(function (entry) {
      return entry.disabled;
    });
  };

  get toggleAlert() {
    return this.totalSuccessCount > 0 || this.totalFailCount > 0
      ? "show"
      : "hide";
  }

  getCategoryData() {
    if (this.route.snapshot.routeConfig.path === "priority") {
      return this.priority;
    }
    return this.labs;
  }

  sortHeader(event: Sort) {
    const isAsc = event.direction === "asc";

    if (!event.active || event.direction === "") {
      return this.categoryData;
    }

    this.categoryData.sort((a, b) => {
      switch (event.active) {
        case "time":
          return this.compare(
            a.resource.effectiveDateTime,
            b.resource.effectiveDateTime,
            isAsc
          );
        case "name":
          return this.compare(
            a.resource.code?.text,
            b.resource.code?.text,
            isAsc
          );

        default:
          return 0;
      }
    });
  }

  compare(
    a: number | string | Date,
    b: number | string | Date,
    isAsc: boolean
  ) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
