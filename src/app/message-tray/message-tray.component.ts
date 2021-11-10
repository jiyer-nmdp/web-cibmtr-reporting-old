import {ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, Injectable} from '@angular/core';
import {MessageTrayService} from "../message-tray.service";

@Component({
  selector: 'app-message-tray',
  templateUrl: './message-tray.component.html',
  styleUrls: ['./message-tray.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

@Injectable({
  providedIn: "root"
})

export class MessageTrayComponent implements OnInit {
  messages: any[] = [];
  isDebugMode: boolean = false;

  constructor(private mTrayServ: MessageTrayService, private changeDetection: ChangeDetectorRef) {
  }

  toggleDebug() {
    this.isDebugMode = ! this.isDebugMode;
  }

  ngOnInit(){
    this.mTrayServ.getMessage()
      .subscribe(message => {
        this.messages.push(message);
        this.changeDetection.detectChanges();
        console.log("pushed - " + message + " to errorMessages");
      })
  }
}
