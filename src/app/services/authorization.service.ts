import { Injectable } from "@angular/core";
import { AppConfig } from "../app.config";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class AuthorizationService {
  constructor(private http: HttpClient) {}

  getEhrCode(url) {
    let segments = url.split("?")[1].split("&");
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].substr(0, 5) === "code=") {
        return segments[i].replace("code=", "").split("#")[0];
      }
    }
    return null;
  }

  codeToBearerToken(tokenurl, code) {
    //HTTP Post request  get Bearer token
    let body =
      "grant_type=authorization_code" +
      "&code=" +
      code +
      "&redirect_uri=" +
      AppConfig.epic_oauth_redirect_url +
      "&client_id=" +
      AppConfig.client_id;

    return this.http
      .post(tokenurl, body, {
        headers: new HttpHeaders({
          "Content-Type": "application/x-www-form-urlencoded",
        }),
      })
      .toPromise();
  }

  constructAuthorizationUrl(baseUrl, launchToken) {
    return (
      baseUrl +
      "?scope=launch&response_type=code" +
      "&redirect_uri=" +
      encodeURIComponent(AppConfig.epic_oauth_redirect_url) +
      "&client_id=" +
      AppConfig.client_id +
      "&launch=" +
      launchToken +
      "&state=search"
    );
  }

  getMetadata(url) {
    let metadata = url + "/metadata";
    return this.http
      .get(metadata, {
        headers: new HttpHeaders({
          Accept: "application/fhir+json",
        }),
      })
      .toPromise();
  }

  getAuthorizeUrl(data) {
    let rests = data["rest"];

    for (let i = 0; i < rests.length; i++) {
      let restObj = rests[i],
        security = restObj["security"],
        extensions = security["extension"];

      for (let j = 0; j < extensions.length; j++) {
        let array = extensions[j]["extension"];

        for (let k = 0; k < array.length; k++) {
          let extension = array[k];

          if (extension["url"] === "authorize") {
            return extension["valueUri"];
          }
        }
      }
    }
    return null;
  }

  getTokenUrl(data) {
    let rests = data["rest"];

    for (let i = 0; i < rests.length; i++) {
      let restObj = rests[i],
        security = restObj["security"],
        extensions = security["extension"];

      for (let j = 0; j < extensions.length; j++) {
        let array = extensions[j]["extension"];

        for (let k = 0; k < array.length; k++) {
          let extension = array[k];
          if (extension["url"] === "token") {
            return extension["valueUri"];
          }
        }
      }
    }

    return null;
  }

  getIss(absUrl) {
    let urlSegments = absUrl.split("?"),
      params = urlSegments[1].split("&");

    for (let i = 0; i < params.length; i++) {
      let pv = params[i].split("=");
      if (pv[0] === "iss") {
        return decodeURIComponent(pv[1]);
      }
    }

    return null;
  }

  getLaunchToken(absUrl) {
    let urlSegments = absUrl.split("?"),
      params = urlSegments[1].split("&");

    for (let i = 0; i < params.length; i++) {
      let pv = params[i].split("=");
      if (pv[0] === "launch") {
        return pv[1].split("#")[0];
      }
    }

    return null;
  }
}
