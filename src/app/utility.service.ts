import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UtilityService {
  constructor() {}

  //Reusable methods defined in this Components

  //rewrite if iss url contains "DSTU2" string
  rebuild_DSTU2_STU3_Url(url: string) {
    if (url.includes("DSTU2")) {
      return url.replace("DSTU2", "STU3");
    }
    return url;
  }
}
