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
  bundle: any;
  psScope: string;
  now: Date;
  crid: string;
  savedBundle: any = {};

  constructor(private router: Router) {
    let data = this.router.getCurrentNavigation().extras.state.data;
    this.bundle = data.bundle;
    this.savedBundle = data.savedBundle;
    this.now = data.now;
    this.psScope = data.psScope;
    this.ehrpatient = data.ehrpatient;
    this.crid = data.crid;
  }

  ngOnInit() {}

  /*getLabs(bundle: any, ehrpatient: Patient) {
    // make a http get call to fhir to get the list of saved observations
    let savedBundle = {};
    if (
      bundle &&
      bundle.entry &&
      bundle.entry.length > 0 &&
      bundle.entry[0].resource.subject
    ) {
      const subj = bundle.entry[0].resource.subject.reference;
      const now = new Date();
      const psScope = this.psScope;
      this.observationlabsService
        .getCibmtrObservations(subj, this.psScope)
        .subscribe(
          (response) => (savedBundle = response),
          (error) =>
            console.log(
              "error occurred while fetching saved observations",
              error
            ),
          () => {
            this.router.navigate(["/labs"], {
              state: {
                data: {
                  bundle,
                  savedBundle,
                  now,
                  psScope,
                  ehrpatient,
                },
              },
            });
          }
        );
    }
  }*/
}
