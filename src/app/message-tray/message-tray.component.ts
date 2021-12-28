import {ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, Injectable} from '@angular/core';
import {MessageTrayService} from "../message-tray.service";
import {MessageTrayData} from "./message-tray.data";
import {Sort} from "@angular/material/sort";


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
  messages: MessageTrayData[] = [];
  isDebugMode: boolean = false;

  constructor(private mTrayServ: MessageTrayService, private changeDetection: ChangeDetectorRef) {
  }

  toggleDebug() {
    this.isDebugMode = ! this.isDebugMode;
  }

  ngOnInit(){
    this.mTrayServ.getMessage()
      .subscribe(message => {
        let date = new Date();
        this.messages.push({timestamp: date, message: message});
        this.changeDetection.detectChanges();
        this.sortData({ active: 'timestamp', direction: 'desc' });
        console.log("pushed - " + message + " to messages at " + date);
      })
  }

  sortData(event: Sort) : any {
    const isAsc = event.direction === "asc";

    if (!event.active || event.direction === "") {
      return this.messages;
    }

    this.messages.sort((a,b) => {
      const isAsc = event.direction === "asc";
      switch (event.active) {
        case "timestamp":
          return this.compare(
            a.timestamp,
            b.timestamp,
            isAsc
          );
        default:
          return 0;
      }
    });
  }

  compare(
    a: number | string | Date,
    b: number | string | Date,
    isAsc: boolean
  ) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
