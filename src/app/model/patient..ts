export interface IPatientContext {
  patient: Patient;
  bundle: any;
}

// patient
export class Patient {
  fhirVersionStr: string;
  name: Name[];
  id: string;
  telecom: string;
  identifier: Identifier[];
  birthDate: string;
  gender: string;
  maritalStatus: MaritalStatus;
  crid: string;
  extension: Extension[];
  text: Text;
}

export class Identifier {
  use: string;
  type: IdentifierType;
  extension: Extension[];
  system: string;
  value: string;
}

export class IdentifierType {
  text: string;
}

export class Extension {
  extension: Extension[];
  valueString: string;
  url: string;
  valueCodeableconcert: string;
  valueCoding: Coding;
}

class Name {
  use: string;
  given: string[];
  family: string;
}

class MaritalStatus {
  coding: Coding[];
}

class Coding {
  code: string;
  system: string;
  display: string;
}

class Text {
  status: string;
}
