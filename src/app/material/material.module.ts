import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MatSortModule } from "@angular/material/sort";

const MaterialComponents = [MatSortModule];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MaterialModule {}
