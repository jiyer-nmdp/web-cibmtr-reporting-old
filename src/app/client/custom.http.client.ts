import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import "rxjs/Rx";
import { NmdpWidget } from "@nmdp/nmdp-login/Angular/service/nmdp.widget";
import { AppConfig } from "../app.config";

@Injectable()
export class CustomHttpClient {
  isActive: boolean;
  static timeoutCallback: any;

  constructor(
    private _httpClient: HttpClient,
    private nmdpWidget: NmdpWidget
  ) {}

  /**
   * Performs a request with `get` http method.
   * @param url
   * @param options
   * @returns {Observable<>}
   */
  get(url: string): Observable<any> {
    this.beforeRequest();
    if (this.isActive) {
      let options = {};
      try {
        options = this.requestOptions();
      } catch (e) {
        return this.onCatch(e.error, new Observable());
      }
      return this._httpClient.get(url, options);
    }
    return this.onCatch("Session no longer active", new Observable());
  }

  /**
   * Performs a request with `put` http method.
   * @param url
   * @param body
   * @param options
   * @returns {Observable<>}
   */
  put(url: string, body: any): Observable<any> {
    this.beforeRequest();
    if (this.isActive) {
      let options = {};
      try {
        options = this.requestOptions();
      } catch (e) {
        return this.onCatch(e.error, new Observable());
      }
      return this._httpClient.put(url, body, options);
    }
    return this.onCatch("Session no longer active", new Observable());
  }

  /**
   * Performs a request with `post` http method.
   * @param url
   * @param options
   * @returns {Observable<>}
   */
  post(url: string, body: any): Observable<any> {
    this.beforeRequest();
    if (this.isActive) {
      let options = {};
      try {
        options = this.requestOptions();
      } catch (e) {
        return this.onCatch(e.error, new Observable());
      }

      return this._httpClient.post(url, body, options);
    }
    return this.onCatch("Session no longer active", new Observable());
  }

  /**
   * Performs a request with `delete` http method.
   * @param url
   * @param options
   * @returns {Observable<>}
   */
  delete(url: string): Observable<any> {
    this.beforeRequest();
    if (this.isActive) {
      let options = {};
      try {
        options = this.requestOptions();
      } catch (e) {
        return this.onCatch(e.error, new Observable());
      }
      return this._httpClient.delete(url, options);
    }
    return this.onCatch("Session no longer active", new Observable());
  }

  /**
   * patch method calls
   * @param url
   * @param body
   * @param RequestOptionsArgs
   * @returns { Observable<> }
   */
  patch(url: string): Observable<any> {
    this.beforeRequest();
    if (this.isActive) {
      let options = {};
      try {
        options = this.requestOptions();
      } catch (e) {
        return this.onCatch(e.error, new Observable());
      }

      return this._httpClient.patch(url, options);
    }
    return this.onCatch("Session no longer active", new Observable());
  }
  /**
   * patch method calls
   * @param url
   * @param RequestOptionsArgs
   * @returns { Observable<> }
   */
  head(url: string): Observable<any> {
    this.beforeRequest();
    if (this.isActive) {
      let options = {};
      try {
        options = this.requestOptions();
      } catch (e) {
        return this.onCatch(e.error, new Observable());
      }

      return this._httpClient.head(url, options);
    }
    return this.onCatch("Session no longer active", new Observable());
  }
  /**
   * patch method calls
   * @param url
   * @param RequestOptionsArgs
   * @returns { Observable<> }
   */
  options(url: string): Observable<any> {
    this.beforeRequest();
    if (this.isActive) {
      let options = {};
      try {
        options = this.requestOptions();
      } catch (e) {
        return this.onCatch(e.error, new Observable());
      }

      return this._httpClient.options(url, options);
    }
    return this.onCatch("Session no longer active", new Observable());
  }

  private hasAuth(url: string | Request): boolean {
    let rStat = false;
    if (url != null && url instanceof Request) {
      let headers = url.headers;
      if (headers != null && headers.has("Authorization")) {
        rStat = true;
      }
    }
    return rStat;
  }
  /**
   * Request options.
   * @param options
   * @returns {RequestOptionsArgs}
   */
  private requestOptions(): any {
    //If there is a valid access token proceeed with the request and
    //add the bearer token to the header

    let accessToken = this.nmdpWidget.getAccessToken();
    if (accessToken) {
      return {
        headers: new HttpHeaders()
          .set("Content-Type", "application/fhir+json")
          .set("Accept", "application/fhir+json")
          .set("Authorization", "Bearer " + accessToken),
      };
    } else {
      throw this.onCatch(
        "There is no valid accessToken available. Cancelling the request.",
        new Observable()
      );
    }
  }
  private beforeRequest(): void {
    this.isActive = this.nmdpWidget.markActive(
      CustomHttpClient.timeoutCallback
    );
  }

  /**
   * After any request.
   */
  private afterRequest(): void {}

  /**
   * Error handler.
   * @param error
   * @param caught
   * @returns {ErrorObservable}
   */
  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    console.log(error);
    return Observable.throw(error);
  }

  /**
   * onSuccess
   * @param res
   */
  private onSuccess(res: Response): void {
    //console.log(res);
  }

  static callbackFunction(func: any): void {
    this.timeoutCallback = func;
  }
}
