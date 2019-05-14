import { Injectable } from "@angular/core";
import { AuthorizationService } from "./authorization.service";
import { Location } from "@angular/common";
import { LocalStorageService } from "angular-2-local-storage";
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

    console.log("authorizationToken", authorizationToken);

    if (authorizationToken !== null) {
      return this.authorizationService
        .codeToBearerToken(
          this._localStorageService.get("tokenUrl"),
          authorizationToken
        )
        .then(response => {
          this._localStorageService.set(
            "accessToken",
            response["access_token"]
          );
          this._localStorageService.set("patient", response["patient"]);
          this.location.go("/main");
        });
    }

    let iss = this.authorizationService.getIss(window.location.href),
      launchToken = this.authorizationService.getLaunchToken(
        window.location.href
      );

    if (iss && launchToken) {
      this._localStorageService.set("iss", iss);

      return this.authorizationService.getMetadata(iss).then(response => {
        console.log("after fetching the metadata");

        let tokenUrl = this.authorizationService.getTokenUrl(response),
          authorizeUrl = this.authorizationService.getAuthorizeUrl(response),
          authorizationCodeUrl = this.authorizationService.constructAuthorizationUrl(
            authorizeUrl,
            launchToken
          );

        console.log("tokenUrl", tokenUrl);
        console.log("authorizeUrl", authorizeUrl);
        console.log("authorizationCodeUrl", authorizationCodeUrl);

        this._localStorageService.set("tokenUrl", tokenUrl);
        window.location.href = authorizationCodeUrl;
      });
    }
  }
}
