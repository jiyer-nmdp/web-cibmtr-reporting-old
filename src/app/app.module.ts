import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule, routingComponents } from "./app.routing.module";
import { AppComponent } from "./app.component";
import { CustomHttpInterceptor } from "./interceptors/http.interceptor";
import { HttpMockRequestInterceptor } from "./mock/mock.http.interceptor";
import { PatientService } from "./patient/patient.service";
import { PatientResolver } from "./patient/patient.resolver";
import { ObservationAgvhdComponent } from "./observation.agvhd/observation.agvhd.component";
import {
  NmdpWidgetModule,
  NmdpWidget,
  SESSION_CLOSED,
  SESSION_TIMEOUT,
} from "@nmdp/nmdp-login";
import { AuthorizationService } from "./services/authorization.service";
import { FhirService } from "./patient/fhir.service";
import { LocalStorageModule } from "angular-2-local-storage";
import { CustomHttpClient } from "./client/custom.http.client";
import { AppInitService } from "./services/app.init";
import { ObservationAgvhdService } from "./observation.agvhd/observation.agvhd.service";
import { DialogComponent } from "./dialog/dialog.component";
import { PatientDetailComponent } from "./patient.detail/patient.detail.component";
import { DefaultComponent } from "./default/default.component";
import { ObservationLabsComponent } from "./observation.labs/observation.labs.component";
import { ObservationLabsService } from "./observation.labs/observation.labs.service";
import { ObservationVitalsComponent } from "./observation.vitals/observation.vitals.component";
import { ObservationVitalsService } from "./observation.vitals/observation.vitals.service";
import { ObservationCoreComponent } from "./observation.corecharacteristics/observation.corecharacteristics.component";
import { ObservationCoreService } from "./observation.corecharacteristics/observation.corecharacteristics.service";
import { ErrorComponent } from "./error/error.component";
import { InfoComponent } from "./info/info.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material/material.module";
import { environment } from "src/environments/environment.mock";
import { SpinnerComponent } from "./spinner/spinner.component";
import { SpinnerService } from "./spinner/spinner.service";
import { filter } from "rxjs/operators";

export const isMock = environment.mock;

export function initializeApp(widget: NmdpWidget) {
  return () => {
    widget.markActive();
    widget.onEvent.pipe(
      filter(
        (event) =>
          event.type === SESSION_TIMEOUT || event.type === SESSION_CLOSED
      )
    );
  };
}

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    ObservationAgvhdComponent,
    DialogComponent,
    PatientDetailComponent,
    DefaultComponent,
    ObservationLabsComponent,
    ObservationVitalsComponent,
    ObservationCoreComponent,
    ErrorComponent,
    InfoComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NmdpWidgetModule.forRoot("assets/MyConfig.json"),
    LocalStorageModule.forRoot({
      prefix: "cibmtr",
      storageType: "localStorage",
    }),
    BrowserAnimationsModule,
    MaterialModule,
  ],
  entryComponents: [ObservationAgvhdComponent, DialogComponent],
  providers: [
    PatientResolver,
    PatientService,
    ObservationAgvhdService,
    ObservationLabsService,
    ObservationVitalsService,
    ObservationCoreService,
    AuthorizationService,
    AppInitService,
    FhirService,
    SpinnerService,
    CustomHttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      deps: [AppInitService, NmdpWidget],
      multi: true,
    },
    ...(isMock
      ? [
          {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpMockRequestInterceptor,
            multi: true,
          },
        ]
      : []),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function appInitFactory(appInitService: AppInitService) {
  return (): Promise<any> => {
    return appInitService.initializeApp();
  };
}
