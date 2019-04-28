import { Injectable } from "@angular/core";
import { AuthorizationService } from "./authorization.service";
import { Location } from "@angular/common";

@Injectable()
export class AppInitService {
  constructor(
    private authorizationService: AuthorizationService,
    private location: Location
  ) {}

  initializeApp(): void {
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
      this.authorizationService
        .codeToBearerToken(localStorage.get("tokenUrl"), authorizationToken)
        .subscribe(response => {
          localStorage.set("accessToken", response["access_token"]);
          localStorage.set("patient", response["patient"]);
          this.location.go("/main");
        });
    }

    var iss = this.authorizationService.getIss(window.location.href),
      launchToken = this.authorizationService.getLaunchToken(
        window.location.href
      );

    if (iss && launchToken) {
      localStorage.set("iss", iss);
      this.authorizationService.getMetadata(iss).subscribe(function(response) {
        console.log("after fetching the metadata");

        var tokenUrl = this.authorizationService.getTokenUrl(response),
          authorizeUrl = this.authorizationService.getAuthorizeUrl(response),
          authorizationCodeUrl = this.authorizationService.constructAuthorizationUrl(
            authorizeUrl,
            launchToken
          );

        console.log("tokenUrl", tokenUrl);
        console.log("authorizeUrl", authorizeUrl);
        console.log("authorizationCodeUrl", authorizationCodeUrl);

        localStorage.set("tokenUrl", tokenUrl);
        window.location = authorizationCodeUrl;
      });
    }
  }
}
