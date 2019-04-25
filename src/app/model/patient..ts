export interface IPatientContext {
  patient: Patient;
  bundle: any;
}

// patient
export class Patient {
  public fhirVersionStr: string;
  public name: Name[];
  public telecom: string;
  public identifier: string;
  public birthDate: string;
  public gender: string;
  public maritalStatus: MaritalStatus;
  public crid: string;
}

class Name {
  public given: string[];
  public family: string;
}

class MaritalStatus {
  public coding: Coding[];
}

class Coding {
  public display: string;
}
