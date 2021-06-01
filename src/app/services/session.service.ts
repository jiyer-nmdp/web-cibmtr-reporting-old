import { Injectable } from "@angular/core";
import { NmdpWidget } from "@nmdp/nmdp-login";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  private sessionStatus: Promise<boolean>;

  constructor(public readonly widget: NmdpWidget) {}

  async getAccessToken() {
    if (await this.isSessionAlive()) {
      return this.widget.getAccessToken();
    }
    return null;
  }

  isSessionAlive() {
    return this.sessionStatus;
  }

  fetchSessionAliveStatus(): Promise<boolean> {
    this.sessionStatus = new Promise<boolean>((resolve) => {
      this.widget.sessionInfo((session: any) =>
        session ? resolve(true) : resolve(false)
      );
    });
    return this.sessionStatus;
  }

  sessionDestroyed() {
    this.sessionStatus = Promise.resolve(false);
  }
}
