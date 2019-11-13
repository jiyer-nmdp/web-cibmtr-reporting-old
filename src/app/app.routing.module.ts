import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ObservationComponent } from "./observation/observation.component";
import { PatientComponent } from "./patient/patient.component";
import { PatientResolver } from "./patient/patient.resolver";

const routes: Routes = [
  {
    path: "",
    component: PatientComponent
  },
  {
    path: "main",
    component: PatientComponent,
    pathMatch: "full",
    resolve: {
      pageData: PatientResolver
    }
  },
  {
    path: "observation",
    component: ObservationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
export const routingComponents = [PatientComponent, ObservationComponent];
