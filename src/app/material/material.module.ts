import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

const MaterialComponents = [];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MaterialModule {}
