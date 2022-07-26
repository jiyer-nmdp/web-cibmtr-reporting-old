import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = "";
        if (error.error instanceof ErrorEvent) {
          // client-side error
          message = `Error: ${error.error.message}`;
        } else {
          // server-side error
          message = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        // this.errorMessages.push(message);
        throw error;
        //          throw message;
      })
    );
  }
}
