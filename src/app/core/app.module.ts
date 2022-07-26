import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER, ErrorHandler } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule, routingComponents } from "../app.routing.module";
import { AppComponent } from "./app.component";
import { HttpMockRequestInterceptor } from "../Interceptor/mock/mock.http.interceptor";
import { PatientService } from "../patient/patient.service";
import { PatientResolver } from "../patient/patient.resolver";
import { NmdpWidgetModule } from "@nmdp/nmdp-login";
import { AuthorizationService } from "../services/authorization.service";
import { FhirService } from "../patient/fhir.service";
import { LocalStorageModule } from "angular-2-local-storage";
import { AppInitService } from "../services/app.init";
import { DialogComponent } from "../dialog/dialog.component";
import { PatientDetailComponent } from "../patient.detail/patient.detail.component";
import { DefaultComponent } from "../default/default.component";
import { ObservationLabsComponent } from "../observation.labs/observation.labs.component";
import { ObservationLabsService } from "../observation.labs/observation.labs.service";
import { ErrorComponent } from "../error/error.component";
import { InfoComponent } from "../info/info.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "../material/material.module";
import { environment } from "src/environments/environment.mock";
import { SpinnerComponent } from "../spinner/spinner.component";
import { SpinnerService } from "../spinner/spinner.service";
import { ModalModule } from "ngx-bootstrap/modal";
import { FormsModule } from "@angular/forms";
import { Validator } from "../shared/constants/validator_regex";
import { MessageTrayComponent } from "../message-tray/message-tray.component";
import { GlobalErrorHandler } from "../global-error-handler";
import { HttpErrorInterceptor } from "../Interceptor/error/http-error.interceptor";
import { SidebarbuttonComponent } from "../sidebarbutton/sidebarbutton.component";
import { SidenavService } from "../sidenav.service";
export const isMock = environment.mock;

@NgModule({
    declarations: [
        AppComponent,
        routingComponents,
        DialogComponent,
        PatientDetailComponent,
        DefaultComponent,
        ObservationLabsComponent,
        ErrorComponent,
        InfoComponent,
        SpinnerComponent,
        MessageTrayComponent,
        SidebarbuttonComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ModalModule.forRoot(),
        FormsModule,
        NmdpWidgetModule.forRoot(environment.okta_setup),
        LocalStorageModule.forRoot({
            prefix: "cibmtr",
            storageType: "localStorage",
        }),
        BrowserAnimationsModule,
        MaterialModule,
    ],
    providers: [
        PatientResolver,
        PatientService,
        ObservationLabsService,
        AuthorizationService,
        AppInitService,
        FhirService,
        SpinnerService,
        Validator,
        SidenavService,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitFactory,
            deps: [AppInitService],
            multi: true,
        },
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
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
    bootstrap: [AppComponent]
})
export class AppModule {}

export function appInitFactory(appInitService: AppInitService) {
  return (): Promise<any> => {
    return appInitService.initializeApp();
  };
}
