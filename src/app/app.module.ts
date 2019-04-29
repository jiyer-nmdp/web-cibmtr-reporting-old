import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpModule, XHRBackend, RequestOptions } from "@angular/http";
import { AppRoutingModule, routingComponents } from "./app.routing.module";
import { AppComponent } from "./app.component";
import { CustomHttpInterceptor } from "./interceptors/http.interceptor";
import { PatientService } from "./patient/patient.service";
import { PatientResolver } from "./patient/patient.resolver";
import { ObservationComponent } from "./observation/observation.component";
import { ModalModule } from "ngx-bootstrap";
import { FormsModule } from "@angular/forms";
import { NmdpWidgetModule } from "@nmdp/nmdp-login/Angular/service/nmdp.widget.module";
import { NmdpWidget } from "@nmdp/nmdp-login/Angular/service/nmdp.widget";
import { NMDPHttpInterceptor } from "@nmdp/nmdp-login/Angular/interceptor/nmdp.interceptor";
import { AppInitService } from "./services/app.init";
import { AuthorizationService } from "./services/authorization.service";
import { FhirService } from "./patient/fhir.service";

export function NmdpHttpFactory(
  backend: XHRBackend,
  defaultOptions: RequestOptions,
  nmdpWidget: NmdpWidget
) {
  return new NMDPHttpInterceptor(backend, defaultOptions, nmdpWidget);
}

@NgModule({
  declarations: [AppComponent, routingComponents, ObservationComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ModalModule.forRoot(),
    FormsModule,
    HttpModule,
    NmdpWidgetModule.forRoot()
  ],
  entryComponents: [ObservationComponent],
  providers: [
    PatientResolver,
    PatientService,
    AuthorizationService,
    AppInitService,
    FhirService,
    {
      provide: NMDPHttpInterceptor,
      useFactory: NmdpHttpFactory,
      deps: [XHRBackend, RequestOptions, NmdpWidget],
      multi: true
    },
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
