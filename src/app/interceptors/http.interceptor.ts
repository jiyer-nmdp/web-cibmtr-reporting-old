import { Injectable } from "@angular/core";

import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpResponse
} from "@angular/common/http";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //const token: string = localStorage.getItem("token");
    const token: string =      
//    "DJIvxxKSuZgdOM_Bm3QZp1M65-VFR4kgFPZOZP1DxHJrHuFNbQSZwFuG9OmqNtnmXUn-BY6Rlbo-SlhqNKTOLlOcn9QrV-Hu37PVcH5kA4iJej2AQOVWvme-Es2ia0I7";
      "uKItQU2ckeYotWRlXdcM59Dgcvn9iyigTQhIgjummZBLzBbOH_DtRzveBuwyOlsp4QhXuZ2we37Fk2731LvqLApi0W-M6EI6EZqJtXeFgLUtmpiXiENyMh287vRVgX_G";

    request = request.clone({
      headers: request.headers
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
    });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log("response ", event);
        }
        return event;
      })
    );
  }
}
