import { Injectable } from "@angular/core";
import { AuthorizationService } from "./authorization.service";
import { Location } from "@angular/common";
import { LocalStorageService } from "angular-2-local-storage";
import { HttpErrorResponse } from "@angular/common/http";

import { v4 as uuidv4 } from 'uuid';
import {GlobalErrorHandler} from "../global-error-handler";

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
          this._localStorageService.set(
            "accessToken",
            response["access_token"]
          );
          this._localStorageService.set("patient", response["patient"]);
          this.location.go("/main");
          this._globalErrorHandler.handleError("Access token granted");
          this._globalErrorHandler.handleError(response);
        })
        .catch(error => {
            this._globalErrorHandler.handleError("Auth token denied - ");
            this._globalErrorHandler.handleError(error);
            console.log("Auth token denied");
        });
    }

    let iss = this.authorizationService.getIss(window.location.href),
      launchToken = this.authorizationService.getLaunchToken(
        window.location.href
      );

    if (iss && launchToken) {
      this._localStorageService.set("iss", iss);
      return this.authorizationService.getMetadata(iss).then((response) => {
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
        this._globalErrorHandler.handleError("Authorization confirmed for client");
        this._globalErrorHandler.handleError(tokenUrl);
        this._globalErrorHandler.handleError(authorizationCodeUrl);
        this._globalErrorHandler.handleError(authorizeUrl);
        this._globalErrorHandler.handleError(response);
      }).catch(error => {
        this._globalErrorHandler.handleError("Authorization denied");
        this._globalErrorHandler.handleError(error);
      });
    }
  }
  handleError(error: HttpErrorResponse) {
    let errorMessage =
      "Unable to process request for \nURL : ${error.url}.  \nStatus: ${error.status}. \nStatusText: ${error.statusText}";
    alert(errorMessage);
    console.log(errorMessage);
  }
}
