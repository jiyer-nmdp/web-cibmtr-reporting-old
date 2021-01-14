export interface IIdentifiers {
  identifier: Identifier[];
}

export class Identifier {
  ID: string;
  IDType: string;
  use: string;
  type: IdentifierType;
  system: string;
  extension: Extension[];
  value: string;
}

class IdentifierType {
  text: string;
}
class Extension {
  extension: Extension[];
  valueString: string;
  url: string;
  valueCodeableconcert: string;
}
