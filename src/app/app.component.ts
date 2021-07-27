import {
  Component,
  ChangeDetectorRef,
  OnInit,
  HostListener,
} from "@angular/core";
import {
  NEW_SESSION,
  NMDPHttpClientInterceptor,
  NmdpWidget,
  SESSION_CLOSED,
  SESSION_EXTENDED,
  SESSION_TIMEOUT,
} from "@nmdp/nmdp-login";
import { Router } from "@angular/router";

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
    this.loginWidget.onEvent.subscribe(this.processSELEvent.bind(this));
    var regExp = new RegExp("^((?!nmdp.org).)*$");
    NMDPHttpClientInterceptor.addExcludeUrl(regExp, null, false);
    NMDPHttpClientInterceptor.enable();
    this.loginWidget.sessionInfo();
  }

  getLoginWidget() {
    return this.loginWidget;
  }

  logout() {
    this.loginWidget.signout();
    //Route Navigation should be redirect from main when user logsout.
    this.router.navigateByUrl("/main");
  }

  processSELEvent(event: any) {
    switch (event.type) {
      case SESSION_CLOSED || SESSION_TIMEOUT:
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
    }
  }

  @HostListener("window:mousedown", ["$event"])
  mouseDownEvent(event: MouseEvent) {
    if (this.loginWidget.isLoggedIn()) this.loginWidget.markActive();
  }
  @HostListener("window:focus", ["$event"])
  focusEvent(event: FocusEvent) {
    if (this.loginWidget.isLoggedIn()) this.loginWidget.markActive();
  }

  @HostListener("window:keydown", ["$event"])
  keyDownEvent(event: KeyboardEvent) {
    if (this.loginWidget.isLoggedIn()) this.loginWidget.markActive();
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
