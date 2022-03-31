import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ObservationLabsComponent } from "./observation.labs/observation.labs.component";
import { PatientComponent } from "./patient/patient.component";
import { PatientResolver } from "./patient/patient.resolver";
import { PatientDetailComponent } from "./patient.detail/patient.detail.component";
import { DefaultComponent } from "./default/default.component";
import { InfoComponent } from "./info/info.component";
import { ErrorComponent } from "./error/error.component";

const routes: Routes = [
  {
    path: "",
    component: PatientComponent,
  },
  {
    path: "patient",
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
        path: "priority",
        component: ObservationLabsComponent,
      },
      {
        path: "labs",
        component: ObservationLabsComponent,
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
