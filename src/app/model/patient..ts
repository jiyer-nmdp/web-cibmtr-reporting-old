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
}

class Identifier {
  use: string;
  type: IdentifierType;
  extension: Extension[];
  system: string;
  value: string;
}

class IdentifierType {
  text: string;
}

class Extension {
  valueString: string;
  url: string;
}

class Name {
  given: string[];
  family: string;
}

class MaritalStatus {
  coding: Coding[];
}

class Coding {
  display: string;
}
