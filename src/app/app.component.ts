import { Component, ChangeDetectorRef, OnInit } from "@angular/core";
import {
  NEW_SESSION,
  NMDPHttpClientInterceptor,
  NmdpWidget,
  SESSION_CLOSED,
  SESSION_EXTENDED,
  SESSION_TIMEOUT,
} from "@nmdp/nmdp-login";
import { CustomHttpClient } from "./client/custom.http.client";
import { Router } from "@angular/router";
import {environment} from "../environments/environment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    private loginWidget: NmdpWidget,
    private ref: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginWidget.setWidgetLocation("#nmdp-login-container");
    CustomHttpClient.callbackFunction(this.processSELEvent.bind(this));
    NMDPHttpClientInterceptor.enable();
    this.loginWidget.sessionInfo();
    this.loginWidget.getNewToken((accessToken: any) => {
      this.ref.detectChanges();
    });
  }

  processSELEvent(event: any) {
    switch (event.type) {
      case SESSION_CLOSED:
        // detect the changes -- needed so that the login form will be displayed
        this.ref.detectChanges();
        // show the login.  Can also use this.nmdpWidget.getNewToken(), but that makes an extra call to Okta...
        this.loginWidget.showLogin();
        break;

      case NEW_SESSION:
        this.loginWidget.getAccessToken();
        this.ref.detectChanges();
        break;

      case SESSION_EXTENDED:
        // No need to do anything with this event.
        // This event would need to be handled if there were a count-down timer or other time-limited
        // logic that needed to know when the SSO Session was extended
        break;

      case SESSION_TIMEOUT:
        this.processTimeout(event.data);
        break;
    }
  }

  getLoginWidget() {
    return this.loginWidget;
  }

  logout() {
    this.loginWidget.signout((err: any) => {
      this.ref.detectChanges();
      this.ngOnInit();
      //when User click logout of navigation , and patient conext is cleared.
      this.router.navigateByUrl("/main");
    });
  }

  processTimeout(timeoutType) {
    const oldSubject = this.loginWidget.subject;
    // check to see if session is active and retrieve a new token if appropriate
    // this will display a new login screen if needed
    this.loginWidget.getNewToken((rawtoken) => {
      // This logic is only needed if there is information cached
      // specific to a user.  In that case, here is where one would
      // destroy the cached information when a different user has logged in

      if (oldSubject != null && this.loginWidget.subject != oldSubject) {
        // clean out any old data from previous usage
        // as a different user may be at the browser
        alert(
          `a different user has logged in oldSubject ${oldSubject} new subject: ${this.loginWidget.subject}`
        );
      }
    });
  }

  handleError(error: Response) {
    let text: string =
      "ERROR in call to CIBMTR Server.  Status: " +
      error.status +
      ".  Text: " +
      error.statusText;
    alert(text);
  }
}
