import { Component, ChangeDetectorRef, OnInit } from "@angular/core";
import { NmdpWidget } from "@nmdp/nmdp-login/Angular/service/nmdp.widget";
import { NMDPHttpInterceptor } from "@nmdp/nmdp-login/Angular/interceptor/nmdp.interceptor";
import { PatientService } from "./patient/patient.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  
  constructor(private loginWidget: NmdpWidget,
      private ref: ChangeDetectorRef,
      private patientService: PatientService) {
    this.loginWidget.init("assets/MyConfig.json", "#nmdp-login-container");
  }

  ngOnInit() {
    NMDPHttpInterceptor.callbackFunction(this.processTimeout.bind(this));
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
      alert("Hey, its an idle timeout");
    } else if (timeoutType === "SESSION_LIFETIME_TIMEOUT") {
      alert("Hey, its a session lifetime Timeout, need to re-authn");
    }
    const oldSubject = this.loginWidget.subject;
    // check to see if session is active
    this.loginWidget.getNewToken(rawtoken => {
      // this will display a new login screen if needed
      if (oldSubject == null || this.loginWidget.subject != oldSubject) {
        // clean out any old data from previous usage
        // as a different user may be at the browser
        alert("a different user has logged in");
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
