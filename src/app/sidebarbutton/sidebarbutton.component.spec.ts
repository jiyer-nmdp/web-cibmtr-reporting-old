import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarbuttonComponent } from './sidebarbutton.component';

describe('SidebarbuttonComponent', () => {
  let component: SidebarbuttonComponent;
  let fixture: ComponentFixture<SidebarbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarbuttonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
