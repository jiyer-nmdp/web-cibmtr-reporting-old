import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ObservationVitalsComponent } from "./observation.vitals.component";

describe("ObservationVitalsComponent", () => {
  let component: ObservationVitalsComponent;
  let fixture: ComponentFixture<ObservationVitalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ObservationVitalsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationVitalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
