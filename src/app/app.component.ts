import { Component, ChangeDetectorRef, OnInit } from "@angular/core";
import { NmdpWidget } from "@nmdp/nmdp-login/Angular/service/nmdp.widget";
import { PatientService } from "./patient/patient.service";
import { CustomHttpClient } from "./client/custom.http.client";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  constructor(
    private loginWidget: NmdpWidget,
    private ref: ChangeDetectorRef,
    private patientService: PatientService
  ) {
    this.loginWidget.init("assets/MyConfig.json", "#nmdp-login-container");
  }

  ngOnInit() {
    CustomHttpClient.callbackFunction(this.processTimeout.bind(this));
    this.loginWidget.getNewToken((accessToken: any) => {
      this.ref.detectChanges();
    });
  }

  getLoginWidget() {
    return this.loginWidget;
  }

  logout() {
    this.loginWidget.signout((err: any) => {
      this.ref.detectChanges();
      this.ngOnInit();
    });
  }

  processTimeout(timeoutType) {
    if (timeoutType === "SESSION_IDLE_TIMEOUT") {
      alert("An idle application session timeout has occurred");
    } else if (timeoutType === "SESSION_LIFETIME_TIMEOUT") {
      alert("Application session is lifetime Timeout, need to re-authn");
    }
    const oldSubject = this.loginWidget.subject;
    // check to see if session is active
    this.loginWidget.getNewToken(rawtoken => {
      // this will display a new login screen if needed
      if (oldSubject == null || this.loginWidget.subject != oldSubject) {
        // clean out any old data from previous usage
        // as a different user may be at the browser
        alert("Different user has logged in");
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
