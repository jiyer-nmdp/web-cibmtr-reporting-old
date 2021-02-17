import { Injectable, NgZone } from "@angular/core";
import { AuthorizationService } from "./authorization.service";
import { Location } from "@angular/common";
import { LocalStorageService } from "angular-2-local-storage";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class AppInitService {
  constructor(
    private authorizationService: AuthorizationService,
    private location: Location,
    private _localStorageService: LocalStorageService
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

    if (authorizationToken !== null) {
      return this.authorizationService
        .codeToBearerToken(
          this._localStorageService.get("tokenUrl"),
          authorizationToken
        )
        .then((response) => {
          this._localStorageService.set(
            "accessToken",
            response["access_token"]
          );
          this._localStorageService.set("patient", response["patient"]);
          this.location.go("/main");
        })
        .catch();
    }

    let iss = this.authorizationService.getIss(window.location.href),
      launchToken = this.authorizationService.getLaunchToken(
        window.location.href
      );

    if (iss && launchToken) {
      this._localStorageService.set("iss", iss);

      return this.authorizationService.getMetadata(iss).then((response) => {
        let tokenUrl = this.authorizationService.getTokenUrl(response),
          authorizeUrl = this.authorizationService.getAuthorizeUrl(response),
          authorizationCodeUrl = this.authorizationService.constructAuthorizationUrl(
            authorizeUrl,
            launchToken,
            iss
          );
        this._localStorageService.set("tokenUrl", tokenUrl);
        window.location.href = authorizationCodeUrl;
        console.log(
          " IssUrl => ",
          iss + "\n launchToken =>",
          launchToken,
          "\n authorizeUrl =>",
          authorizeUrl,
          "\n authorizationCodeUrl =>",
          authorizationCodeUrl
        );
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
