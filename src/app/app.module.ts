import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { AppRoutingModule, routingComponents } from "./app.routing.module";
import { AppComponent } from "./app.component";
import { CustomHttpInterceptor } from "./interceptors/http.interceptor";
import { PatientService } from "./patient/patient.service";
import { PatientResolver } from "./patient/patient.resolver";
import { ObservationComponent } from "./observation/observation.component";
import { ModalModule } from "ngx-bootstrap";
import { FormsModule } from "@angular/forms";
import { NmdpWidgetModule } from "@nmdp/nmdp-login/Angular/service/nmdp.widget.module";
import { AuthorizationService } from "./services/authorization.service";
import { FhirService } from "./patient/fhir.service";
import { LocalStorageModule } from "angular-2-local-storage";
import { CustomHttpClient } from "./client/custom.http.client";
import { AppInitService } from "./services/app.init";
import { ObservationService } from "./observation/observation.service";
import { AlertModule } from "ngx-bootstrap/alert";
import { DialogComponent } from "./dialog/dialog.component";

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    ObservationComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ModalModule.forRoot(),
    FormsModule,
    HttpModule,
    NmdpWidgetModule.forRoot(),
    AlertModule.forRoot(),
    LocalStorageModule.forRoot({
      prefix: "cibmtr",
      storageType: "localStorage"
    })
  ],
  entryComponents: [ObservationComponent, DialogComponent],
  providers: [
    PatientResolver,
    PatientService,
    ObservationService,
    AuthorizationService,
    AppInitService,
    FhirService,
    CustomHttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      deps: [AppInitService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function appInitFactory(appInitService: AppInitService) {
  return (): Promise<any> => {
    return appInitService.initializeApp();
  };
}
