import { Injectable, Injector } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import patient from "./patient.json";

const patient_url = [
  {
    //
    url:
      "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3/Patient/endFZe2sorgK5yH219Tqbsw3",
    json: "patient",
  },
];

@Injectable()
export class HttpMockRequestInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    for (const element of patient_url) {
      if (request.url === element.url) {
        console.log("Loaded from json : " + request.url);
        return of(
          new HttpResponse({ status: 200, body: (element.json as any).default })
        );
      }
    }
    console.log("Loaded from http call :" + request.url);
    return next.handle(request);
  }
}
