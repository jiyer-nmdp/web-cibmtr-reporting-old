import { Component, OnInit, HostListener } from "@angular/core";
import { Patient } from "../model/patient.";
import { UtilityService } from "../utility.service";

@Component({
  selector: "app-patient.detail",
  templateUrl: "./patient.detail.component.html",
  styleUrls: ["./patient.detail.component.scss"],
})
export class PatientDetailComponent implements OnInit {
  ehrpatient: Patient;
  labs: any;
  psScope: string;
  crid: string;
  activeLabel: string;
  priority: any;

  constructor(private utility: UtilityService) {
    let data = utility.data;

    this.labs = this.utility.bundleObservations(data.labs);
    this.priority = this.utility.bundleObservations(data.priorityLabs);

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
