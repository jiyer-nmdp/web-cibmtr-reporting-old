import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MatSortModule } from "@angular/material/sort";
import { MatDialogModule } from "@angular/material/dialog";

const MaterialComponents = [MatSortModule, MatDialogModule];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MaterialModule {}
