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

  constructor(private router: Router, private utility: UtilityService) {

    let data = utility.data;

    this.agvhd = JSON.parse(data.agvhd);
    this.labs = JSON.parse(data.labs);
    this.vitals = JSON.parse(data.vitals);
    this.core = JSON.parse(data.core);
    this.ehrpatient = JSON.parse(data.ehrpatient);
    this.crid = data.crid;
    this.psScope = data.psScope;
  }

  ngOnInit() {}

  getFullName(ehrpatient) {
    let givenName;
    if (ehrpatient.name[0].text.length > 0) {
      givenName = ehrpatient.name[0].text;
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
