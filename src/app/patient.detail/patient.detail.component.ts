import { Component, OnInit, HostListener } from "@angular/core";
import { Patient } from "../model/patient.";
import { UtilityService } from "../utility.service";
import { ConfirmationDialog } from "../confirm.dialog/confirmation-dialog";
import { MatDialog } from "@angular/material/dialog/dialog";
import { MatDialogRef } from "@angular/material/dialog/dialog-ref";

@Component({
  selector: "app-patient.detail",
  templateUrl: "./patient.detail.component.html",
  styleUrls: ["./patient.detail.component.scss"],
})
export class PatientDetailComponent implements OnInit {
  ehrpatient: Patient;
  //labs: any;
  psScope: string;
  crid: string;
  activeLabel: string;
  priority: any;
  dialogRef: MatDialogRef<ConfirmationDialog>;

  constructor(private utility: UtilityService, public dialog: MatDialog) {
    let data = utility.data;

    //this.labs = this.utility.bundleObservations(data.labs);
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
  openConfirmationDialog() {
    this.dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: false,
    });
    //Alert_messages will be maintained in constant file in future
    this.dialogRef.componentInstance.confirmMessage =
      "Retrieving All Labs may taken several minutes. Do you want to continue?";

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // do confirmation actions
      }
      this.dialogRef = null;
    });
  }
}
