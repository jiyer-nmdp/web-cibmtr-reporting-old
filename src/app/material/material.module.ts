import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MatSortModule } from "@angular/material/sort";
import { MatDialogModule } from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSliderModule} from "@angular/material/slider";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {NgxJsonViewerModule} from "ngx-json-viewer";

const MaterialComponents = [MatSortModule, MatDialogModule, MatTableModule, MatButtonModule, MatIconModule,
  MatButtonModule, MatSidenavModule, MatCheckboxModule, MatSliderModule, MatSlideToggleModule, NgxJsonViewerModule];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MaterialModule {}
