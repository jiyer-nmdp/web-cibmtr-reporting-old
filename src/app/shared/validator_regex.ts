export class Validator {
  VALIDATION_PATTERN = {
    Exclude_URL_Pattern: new RegExp("^((?!nmdp.org).)*$"),
    SSN_RegEx_Pattern: new RegExp(
      "(?!000|666|9)[0-9]{3}([ -]?)(?!00)[0-9]{2}\\1(?!0000)[0-9]{4}$"
    ),
  };

  validateSSN(ssn) {
    return this.VALIDATION_PATTERN.SSN_RegEx_Pattern.test(ssn) ? true : false;
  }
}
