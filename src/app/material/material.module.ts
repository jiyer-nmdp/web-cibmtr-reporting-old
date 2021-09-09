import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MatSortModule } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog/dialog";
import { MatDialogRef } from "@angular/material/dialog/dialog-ref";

const MaterialComponents = [MatSortModule, MatDialog, MatDialogRef];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MaterialModule {}
