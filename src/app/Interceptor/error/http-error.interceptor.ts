import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {retry, catchError, tap} from 'rxjs/operators';
import {GlobalErrorHandler} from "../../global-error-handler";

export class HttpErrorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // @ts-ignore
    return next.handle(request)
      .pipe(
      //  retry(1),
        catchError((error: HttpErrorResponse) => {
          let message = '';
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
      )
  }
}
