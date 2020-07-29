import { Component, OnInit } from "@angular/core";
import { Patient } from "../model/patient.";
import { Router } from "@angular/router";

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
  psScope: string;
  crid: string;

  constructor(private router: Router) {
    let data = this.router.getCurrentNavigation().extras.state.data;
    this.agvhd = data.agvhd;
    this.labs = data.labs;
    this.vitals = data.vitals;
    this.ehrpatient = data.ehrpatient;
    this.crid = data.crid;
    this.psScope = data.psScope;
  }

  ngOnInit() {}
}
