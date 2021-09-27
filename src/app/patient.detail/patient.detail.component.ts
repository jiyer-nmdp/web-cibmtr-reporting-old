import { Component, OnInit, HostListener } from "@angular/core";
import { Patient } from "../model/patient.";
import { UtilityService } from "../utility.service";
import { ConfirmationDialog } from "../confirm.dialog/confirmation-dialog";
import { MatDialog } from "@angular/material/dialog";
import { MatDialogRef } from "@angular/material/dialog";
import { PatientService } from "../patient/patient.service";
import { LocalStorageService } from "angular-2-local-storage";
import { ActivatedRoute, Router } from "@angular/router";
import { SpinnerService } from "../spinner/spinner.service";

@Component({
  selector: "app-patient.detail",
  templateUrl: "./patient.detail.component.html",
  styleUrls: ["./patient.detail.component.scss"],
})
export class PatientDetailComponent implements OnInit {
  ehrpatient: Patient;
  psScope: string;
  crid: string;
  activeLabel: string;
  priority: any;
  dialogRef: MatDialogRef<ConfirmationDialog>;
  labsdata: any;

  constructor(
    private utility: UtilityService,
    private spinner: SpinnerService,
    private dialog: MatDialog,
    private patientService: PatientService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    let data = utility.data;
    this.ehrpatient = JSON.parse(data.ehrpatient);
    this.priority = this.utility.bundleObservations(data.priorityLabs);
    this.crid = data.crid;
    this.psScope = data.psScope;
  }

  ngOnInit() {}

  getFullName(ehrpatient) {
    let givenName;
    if (ehrpatient.name[0].text && ehrpatient.name[0].text.length > 0) {
      givenName = ehrpatient.name[0].text;
    } else if (
      ehrpatient.name[0].given &&
      ehrpatient.name[0].given.length > 0
    ) {
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

  //Confirmation on AllLabs API on demand
  //If fecthced already avoid the Confirmation dialog

  openConfirmationDialog() {
    if (!this.utility.data.labs) {
      this.dialogRef = this.dialog.open(ConfirmationDialog, {
        disableClose: false,
      });
      //Alert_messages will be maintained in constant file in future
      this.dialogRef.componentInstance.confirmMessage =
        "Retrieving All Labs may taken several minutes. Do you want to continue?";

      this.dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.spinner.start();
          this.patientService
            .getObservationLabs(this.localStorageService.get("patient"))
            .subscribe(
              (labsData) => {
                if (labsData) {
                  this.utility.data.labs = JSON.stringify(labsData);
                  this.routeTo(labsData);
                }
                this.spinner.end();
              },
              (error) => {
                this.spinner.reset();
                this.router.navigate(["./error"], { relativeTo: this.route });
              }
            );
        }
        this.dialogRef = null;
      });
    } else {
      const data = JSON.parse(this.utility.data.labs);
      this.routeTo(data);
    }
  }

  routeTo(labsData) {
    this.labsdata = this.utility.bundleObservations(JSON.stringify(labsData));
    if (this.labsdata.total === 0) {
      this.router.navigate(["./info"], {
        relativeTo: this.route,
      });
    } else {
      this.router.navigate(["./labs"], {
        relativeTo: this.route,
      });
    }
  }
}
