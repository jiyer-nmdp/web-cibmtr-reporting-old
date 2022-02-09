import { Component, OnInit } from '@angular/core';
import {SidenavService} from "../sidenav.service";

@Component({
  selector: 'app-sidebarbutton',
  templateUrl: './sidebarbutton.component.html',
  styleUrls: ['./sidebarbutton.component.scss']
})
export class SidebarbuttonComponent implements OnInit {

  isVisible: boolean = false;
  constructor(private sidenavService: SidenavService) { }

  ngOnInit(): void {
  }

  toggleButton() {
    this.isVisible = ! this.isVisible;
    this.sidenavService.toggle();
  }
}
