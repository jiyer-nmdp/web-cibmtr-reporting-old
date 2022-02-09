import { Injectable } from "@angular/core";
import { AuthorizationService } from "./authorization.service";
import { Location } from "@angular/common";
import { LocalStorageService } from "angular-2-local-storage";
import { HttpErrorResponse } from "@angular/common/http";

import {GlobalErrorHandler} from "../global-error-handler";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AppInitService {
  constructor(
    private authorizationService: AuthorizationService,
    private location: Location,
    private _localStorageService: LocalStorageService,
    private _globalErrorHandler: GlobalErrorHandler
  ) {}
  initializeApp(): Promise<any> {
    if (!window.location.href.includes("?")) {
      console.log(
        "Location doesnt seems to have query paremeters..",
        window.location.href
      );
      return;
    }

    let authorizationToken = this.authorizationService.getEhrCode(
      window.location.href
    );

    let authorizationState = this.authorizationService.getEhrState(
      window.location.href
    );

    if (authorizationToken !== null) {
      return this.authorizationService
        .codeToBearerToken(
          this._localStorageService.get("tokenUrl"),
          authorizationToken,
          authorizationState,
          this._localStorageService.get("validCodeState")
        )
        .then((response) => {
          if (response["patient"]) {
            this._localStorageService.set(
              "accessToken",
              response["access_token"]
            );
            this._localStorageService.set("patient", response["patient"]);
            this.location.go("/main");
          } else {
            this._globalErrorHandler.handleError("Access token granted");
            this._globalErrorHandler.handleError(response);
            this.handleError({
              url: this._localStorageService.get("iss"),
              reason: "PatientId not found",
            });
          }
        })
    }

    let iss = this.authorizationService.getIss(window.location.href),
      launchToken = this.authorizationService.getLaunchToken(
        window.location.href
      );

    if (iss && launchToken) {
      this._localStorageService.set("iss", iss);
      return this.authorizationService.getMetadata(iss)
        .then((response) => {
          let validCodeState = uuidv4();
          this._localStorageService.set("validCodeState", validCodeState);
          let tokenUrl = this.authorizationService.getTokenUrl(response),
            authorizeUrl = this.authorizationService.getAuthorizeUrl(response),
            authorizationCodeUrl =
              this.authorizationService.constructAuthorizationUrl(
                authorizeUrl,
                launchToken,
                iss,
                validCodeState
              );
          this._localStorageService.set("tokenUrl", tokenUrl);
          window.location.href = authorizationCodeUrl;
          this._globalErrorHandler.handleError("Metadata retrieved");
          this._globalErrorHandler.handleError(response);
        })
        .catch(error => {
          this._globalErrorHandler.handleError(error);
      });
    }
  }
  handleError(error) {
    let errorMessage =
      "Unable to process request for \nURL : ${error.url}. \rReason: ${error.reason}";
    alert(errorMessage);
    console.log(errorMessage);
    this._globalErrorHandler.handleError(errorMessage);
  }
}
