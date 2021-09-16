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
import * as priority from "../data/priority.json";

const ehr_url = [
  {
    url: "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3/Patient/e.Evi4toMFqPiXu0iCJJ3MA3",
    json: patient,
  },
  {
    url: "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3/Observation?category=laboratory&_count=1000&patient=e.Evi4toMFqPiXu0iCJJ3MA3",
    json: labs,
  },
  {
    url: "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3/Observation?patient=e.Evi4toMFqPiXu0iCJJ3MA3&_count=1000&code=26508-2,35332-6,764-1,30180-4,706-2,707-0,26446-5,709-6,26449-9,711-2,712-0,26450-7,713-8,714-6,4576-5,71865-0,71864-3,71863-5,32682-7,38524-5,42246-9,4633-4,718-7,59260-0,30313-1,14775-1,20509-6,55782-7,30351-1,76768-1,30350-3,76769-9,75928-2,93846-4,20570-8,71833-8,71831-2,71829-6,4544-3,4545-0,48703-3,31100-1,42908-4,41654-5,26474-7,731-0,732-8,26478-8,736-9,737-7,30433-7,739-3,28541-1,740-1,71668-8,40651-2,26484-6,742-7,743-5,26485-3,5905-5,744-3,30444-4,746-8,30445-1,747-6,30446-9,748-4,26498-6,749-2,71667-0,26499-4,751-8,753-4,26511-6,770-8,23761-0,30458-4,24103-4,13047-6,79426-3,28542-9,32623-1,26515-7,777-3,49497-1,778-1,30465-9,6746-2,34926-6,33855-8,30466-7,13599-6,26523-1,781-5,26524-9,783-1,71666-2,26453-1,789-8,790-6,14196-0,60474-4,40665-2,26464-8,6690-2,49498-9,804-5,1754-1,6942-7,77158-4,1751-7,61151-7,61152-5,2862-1,1952-1,76484-5,35194-0,1975-2,14631-6,77137-8,2532-0,14804-9,14805-6,35214-6,2498-4,14798-3,35215-3,2500-7,14800-7,35209-6,24373-3,2276-4,20567-4,11150-0,57028-3,26505-8,32200-8,769-0,4679-7,17849-1,31112-6,708-8,30376-8,26444-0,704-7,705-4,6863-5",
    json: priority,
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
