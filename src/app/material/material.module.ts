import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MatBadgeModule, MatIconModule } from "@angular/material";

const MaterialComponents = [MatIconModule, MatBadgeModule];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MaterialModule {}
