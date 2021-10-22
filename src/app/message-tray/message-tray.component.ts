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
  errorMessages: string[] = [];
  isDebugMode: boolean = false;

  constructor(private mTrayServ: MessageTrayService, private changeDetection: ChangeDetectorRef) {
  }

  toggleDebug() {
    this.isDebugMode = ! this.isDebugMode;
  }

  ngOnInit(){
    this.subscribeToEvent();
  }

  subscribeToEvent()
  {
    this.mTrayServ.getMessage().subscribe(message => {
      this.errorMessages.push(message);
      this.changeDetection.detectChanges();
      console.log("Showing errorMessagesArray - " + this.errorMessages);
    })
  }
}
