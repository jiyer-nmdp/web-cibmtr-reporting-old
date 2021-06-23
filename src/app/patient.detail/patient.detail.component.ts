import { Component, OnInit, HostListener } from "@angular/core";
import { Patient } from "../model/patient.";
import { Router } from "@angular/router";
import { UtilityService } from "../utility.service";


@Component({
  selector: "app-patient.detail",
  templateUrl: "./patient.detail.component.html",
  styleUrls: ["./patient.detail.component.scss"],
})
export class PatientDetailComponent implements OnInit {
  ehrpatient: Patient;
  agvhd: any;
  labs: any;
  vitals: any;
  core: any;
  psScope: string;
  crid: string;
  activeLabel: string;
  priority: any;

  constructor(private router: Router, private utility: UtilityService) {

    let data = utility.data;

    this.agvhd = this.utility.bundleObservations(data.agvhd);
    this.labs = this.utility.bundleObservations(data.labs);
    this.vitals = this.utility.bundleObservations(data.vitals);
    this.priority = this.utility.bundleObservations(data.priorityLabs);
    this.core = this.utility.bundleObservations(data.core);
    this.ehrpatient = JSON.parse(data.ehrpatient);
    this.crid = data.crid;
    this.psScope = data.psScope;
  }

  ngOnInit() {}

  getFullName(ehrpatient) {
    let givenName;
    if (ehrpatient.name[0].text && ehrpatient.name[0].text.length > 0) {
      givenName = ehrpatient.name[0].text;
    }
    else if (ehrpatient.name[0].given && ehrpatient.name[0].given.length > 0) {
      givenName = ehrpatient.name[0].given.join(" ");
    }
    return givenName;
  }

  @HostListener("click", ["$event"])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.id != "") {
      this.activeLabel = target.id;
    }
  }
}
