import { Component, OnInit } from "@angular/core";
import { Patient } from "../model/patient.";
import { LocalStorageService } from "angular-2-local-storage";
import { Router, ActivatedRoute } from "@angular/router";
import { ObservationLabsService } from "./observation.labs.service";

@Component({
  selector: "app-observation.labs",
  templateUrl: "./observation.labs.component.html",
  styleUrls: ["./observation.labs.component.scss"],
})
export class ObservationLabsComponent implements OnInit {
  bundle: any;
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

  constructor(
    public observationalabsService: ObservationLabsService,
    private _localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    let data = this.router.getCurrentNavigation().extras.state.data;
    this.bundle = data.bundle;
    this.savedBundle = data.savedBundle;
    this.now = data.now;
    this.psScope = data.psScope;
    this.ehrpatient = data.ehrpatient;
  }

  ngOnInit() {}
}
