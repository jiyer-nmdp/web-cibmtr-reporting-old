import {ErrorHandler, Injectable} from "@angular/core";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {MessageTrayService} from "./message-tray.service";

@Injectable({
  providedIn: 'root'
})

export class GlobalErrorHandler implements ErrorHandler {

  private preFix= "Uncaught (in promise): ";

  constructor( private mTrayServ: MessageTrayService) {
  }

  handleError(error: any) {

    if (error instanceof HttpErrorResponse) {
      //  console.error('Backend returned status code: ' + error.status);
      this.mTrayServ.setMessage( error.status + " " + error.message);

    } else if (error instanceof HttpResponse) {
      //  console.log('Success!! returned status code: ' + error.status);
      this.mTrayServ.setMessage( error.status + " " + JSON.stringify(error.body));

    } else if (typeof error === 'string') {
      this.mTrayServ.setMessage(error);

    } else if (error.message && error.message.toString().indexOf(this.preFix) !== -1) {
      let updatedErr = error.message.substr(this.preFix.length)
      this.checkJsonSetMessage(updatedErr);

    } else {
      let updatedErr = this.checkErrorStack(error);
      this.checkJsonSetMessage(updatedErr);
    }
  }

  checkErrorStack(errorMesg: any) : any
  {
    if (errorMesg.stack)
      return errorMesg.stack;
    else if (errorMesg.message)
      return errorMesg.message;
    else
      return errorMesg;
  }

  checkJsonSetMessage(updatedStr: any) {
    if (this.isJson(updatedStr)) {
      console.log("in the else for json - " + JSON.parse(updatedStr));
      this.mTrayServ.setMessage(JSON.parse(updatedStr));
    } else if (this.isJson(JSON.stringify(updatedStr))) {
      console.log("in the else - " + JSON.parse(JSON.stringify(updatedStr)));
      this.mTrayServ.setMessage(JSON.parse(JSON.stringify(updatedStr)));
    } else {
      console.log("in the else - " + updatedStr);
      this.mTrayServ.setMessage(updatedStr);
    }
  }

  isJson(str: string) {
    try {
      JSON.parse(str);
    } catch (error) {
      return false;
    }
    return true;
  }
}
