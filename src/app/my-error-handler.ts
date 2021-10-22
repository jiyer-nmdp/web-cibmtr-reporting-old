import {ErrorHandler, Injectable} from "@angular/core";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {MessageTrayService} from "./message-tray.service";

@Injectable({
  providedIn: 'root'
})

export class MyErrorHandler implements ErrorHandler {

  constructor( private mTrayServ: MessageTrayService) {
  }

  handleError(error: any) {
    // Check if it's an error from an HTTP response
    if (error instanceof HttpErrorResponse) {
      //Backend returns unsuccessful response codes such as 404, 500 etc.
      console.error('Backend returned status code: ' + error.status);
      console.error('Response body:' +  error.message);

      this.mTrayServ.setMessage( error.status + " " + error.message);
    }
    else if (error instanceof HttpResponse)
    {
      console.log('Success!! returned status code: ' + error.status);
      console.log('Response body:' + JSON.stringify(error.body));

      this.mTrayServ.setMessage( error.status + " " + JSON.stringify(error.body));
    }
    else if (error instanceof String)
    {
      console.log('Response was a string - ' +  error);
      this.mTrayServ.setMessage( "Response was a string - " + error);
    }
    else {
      this.mTrayServ.setMessage(error.status + " " + error.message);
    }
  }
}
