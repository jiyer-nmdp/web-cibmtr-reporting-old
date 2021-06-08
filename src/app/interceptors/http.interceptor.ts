import { Injectable } from "@angular/core";

import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
} from "@angular/common/http";

import { Observable, from } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { SessionService } from "../services/session.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private sessionService: SessionService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes("nmdp")) {
      const token$ = from(this.sessionService.getAccessToken());
      return token$.pipe(
        map((token) => {
          const headers = request.headers.set(
            "Authorization",
            `Bearer ${token}`
          );

          return request.clone({
            headers,
          });
        }),
        switchMap((authRequest) => next.handle(authRequest))
      );
    }
    return next.handle(request);
  }
}
