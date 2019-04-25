import { Injectable } from "@angular/core";
import { AppConfig } from "../app.config";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class AuthorizationService {
  constructor(private http: HttpClient) {}

  getEhrCode(url) {
    //url = "https://agnissubmission.b12x.org/?code=2jEBRg3erVcnee9Qa_hVaDK3kHJeVJhb6leKEWiJLjO9mtsRKcW8bUWARmtkEczLR_xwWY2mSueuk-gmdwR9LrgawR0-xiILBRfb7Zy95swsYaBv-noYNVKiwiDHqi4a&state=search"

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
      AppConfig.non_prod_client_id;

    return this.http.post(tokenurl, body, {});
  }

  constructAuthorizationUrl(baseUrl, launchToken) {
    return (
      baseUrl +
      "?scope=launch&response_type=code" +
      "&redirect_uri=" +
      encodeURIComponent(AppConfig.epic_oauth_redirect_url) +
      "&client_id=" +
      AppConfig.non_prod_client_id +
      "&launch=" +
      launchToken +
      "&state=search"
    );
  }

  getAuthorizationUrl(data) {
    var rests = data["rest"];

    for (var i = 0; i < rests.length; i++) {
      var restObj = rests[i],
        security = restObj["security"],
        extensions = security["extension"];

      for (var j = 0; j < extensions.length; j++) {
        var array = extensions[j]["extension"];

        for (var k = 0; k < array.length; k++) {
          var extension = array[k];

          if (extension["url"] === "authorize") {
            return extension["valueUri"];
          }
        }
      }
    }

    return null;
  }

  getTokenUrl(data) {
    var rests = data["rest"];

    for (var i = 0; i < rests.length; i++) {
      var restObj = rests[i],
        security = restObj["security"],
        extensions = security["extension"];

      for (var j = 0; j < extensions.length; j++) {
        var array = extensions[j]["extension"];

        for (var k = 0; k < array.length; k++) {
          var extension = array[k];

          if (extension["url"] === "token") {
            return extension["valueUri"];
          }
        }
      }
    }

    return null;
  }

  getIss(loc) {
    var urlSegments = loc.$$absUrl.split("?"),
      params = urlSegments[1].split("&");

    for (var i = 0; i < params.length; i++) {
      var pv = params[i].split("=");

      if (pv[0] === "iss") {
        return decodeURIComponent(pv[1]);
      }
    }

    return null;
  }

  getLaunchToken(loc) {
    var urlSegments = loc.$$absUrl.split("?"),
      params = urlSegments[1].split("&");

    for (var i = 0; i < params.length; i++) {
      var pv = params[i].split("=");

      if (pv[0] === "launch") {
        return pv[1].split("#")[0];
      }
    }

    return null;
  }
}
