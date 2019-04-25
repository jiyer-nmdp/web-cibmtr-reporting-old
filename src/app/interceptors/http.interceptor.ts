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
      "yQFxbtz2HqorwGx4MLHp4EtNCTnTVu060HKnEIwOcezNm0Y3Q-SE_GCwyscMWghFrsrDXWD4cvp8xCoa6hkd8LWUcKD4cJjxaT2EsvINQnogghdGLXGeyuX1jZJmvtRo";

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
