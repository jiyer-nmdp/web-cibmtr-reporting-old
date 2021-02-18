import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UtilityService {
  //IE data clone issue with router state object
  data: any;
  chunkSize: number = 30;

  constructor() {}

  //rewrite if iss url contains "DSTU2" string
  rebuild_DSTU2_STU3_Url(url: string) {
    if (url.includes("DSTU2")) {
      return url.replace("DSTU2", "STU3");
    }
    return url;
  }

  //
  chunk(array, size) {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
      chunked_arr.push(array.slice(index, size + index));
      index += size;
    }
    return chunked_arr;
  }
}
