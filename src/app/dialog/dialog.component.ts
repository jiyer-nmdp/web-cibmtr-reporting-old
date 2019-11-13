import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.scss"]
})
export class DialogComponent implements OnInit {
  onClose: Subject<String>;
  currentItem: any;
  cibmtrCenters: Array<any>;

  constructor(private _bsModalRef: BsModalRef) {}

  ngOnInit() {
    this.onClose = new Subject();
    this.cibmtrCenters = this.cibmtrCenters;
    this.currentItem = this.cibmtrCenters[0];
  }

  selectRow(item) {
    this.cibmtrCenters.forEach(c => {
      if (c.value === item.value) {
        this.currentItem = item;
      }
    });
    this.onClose.next("rowSelected");
  }

  public onContinue(): void {
    this.onClose.next("Continue");
    this._bsModalRef.hide();
  }
}
