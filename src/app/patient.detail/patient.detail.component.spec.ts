import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Patient.DetailComponent } from './patient.detail.component';

describe('Patient.DetailComponent', () => {
  let component: Patient.DetailComponent;
  let fixture: ComponentFixture<Patient.DetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Patient.DetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Patient.DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
