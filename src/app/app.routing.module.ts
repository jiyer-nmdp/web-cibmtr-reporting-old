import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ObservationAgvhdComponent } from "./observation.agvhd/observation.agvhd.component";
import { ObservationLabsComponent } from "./observation.labs/observation.labs.component";

import { PatientComponent } from "./patient/patient.component";
import { PatientResolver } from "./patient/patient.resolver";
import { PatientDetailComponent } from "./patient.detail/patient.detail.component";
import { DefaultComponent } from "./default/default.component";
import { ObservationVitalsComponent } from "./observation.vitals/observation.vitals.component";
import { ObservationCoreComponent } from "./observation.corecharacteristics/observation.corecharacteristics.component";
import { InfoComponent } from "./info/info.component";
import { ErrorComponent } from "./error/error.component";

const routes: Routes = [
  {
    path: "",
    component: PatientComponent,
  },
  {
    path: "main",
    component: PatientComponent,
    pathMatch: "full",
    resolve: {
      pageData: PatientResolver,
    },
  },
  {
    path: "patientdetail",
    component: PatientDetailComponent,
    children: [
      {
        path: "",
        component: DefaultComponent,
        pathMatch: "full",
      },
      {
        path: "agvhd",
        component: ObservationAgvhdComponent,
      },
      {
        path: "labs",
        component: ObservationLabsComponent,
      },
      {
        path: "priority",
        component: ObservationLabsComponent,
      },
      {
        path: "vitals",
        component: ObservationVitalsComponent,
      },
      {
        path: "core",
        component: ObservationCoreComponent,
      },
      {
        path: "info",
        component: InfoComponent,
      },
      {
        path: "error",
        component: ErrorComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const routingComponents = [PatientComponent, PatientDetailComponent];
