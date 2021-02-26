import { Injectable, Injector } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Observable, of } from "rxjs";

import * as patient from "../data/patient.json";
import * as labs from "../data/labs.json";
import * as vitals from "../data/vitals.json";

const ehr_url = [
  {
    //
    url:
      "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3/Patient/eQYVH16R88hl-NPxd4lL17A3",
    json: patient,
  },
  {
    url:
      "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3/Observation?category=laboratory&patient=eQYVH16R88hl-NPxd4lL17A3",
    json: labs,
  },
  {
    url:
      "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3/Observation?category=vital-signs&patient=eQYVH16R88hl-NPxd4lL17A3",
    json: vitals,
  },
];

@Injectable()
export class HttpMockRequestInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    for (const element of ehr_url) {
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