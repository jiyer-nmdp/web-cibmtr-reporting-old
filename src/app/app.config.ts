import { environment } from "../environments/environment";

export class AppConfig {
  // Define all the constants of the app

  public static ssn_system = [
    "urn:oid:2.16.840.1.113883.4.1",
    "http://hl7.org/fhir/sid/us-ssn",
  ];

  public static race_ombsystem = [
    "http://hl7.org/fhir/us/core/ValueSet/omb-race-category",
    "urn:oid:2.16.840.1.113883.6.238",
    "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",
  ];

  // public static racedetails_ombsystem = [
  //   "http://hl7.org/fhir/us/core/ValueSet/detailed-race",
  //   "urn:oid:2.16.840.1.113883.6.238",
  //   "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",
  // ];

  public static ethnicity_ombsystem = [
    "http://hl7.org/fhir/us/core/ValueSet/omb-ethnicity-category",
    "urn:oid:2.16.840.1.113883.6.238",
  ];

  public static gender =
    "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex";

  //CIBMTR Namespaces
  public static cibmtr_crid_namespace = "http://cibmtr.org/identifier/CRID";
  public static cibmtr_centers_namespace =
    "http://cibmtr.org/codesystem/transplant-center";

  //EPIC Patient Namespace Logical ID
  public static epic_logicalId_namespace = "urn:ietf:rfc:3986";

  //EHR Client ID's
  public static ehr_client_id = environment.ehr_client_id;

  //EHR Redirect URL
  public static ehr_oauth_redirect_url = environment.ehr_redirect_url;

  //Middleware URLs
  public static crid_service_endpoint = environment.cibmtr_fhir_r3_url + "CRID";

  public static cibmtr_fhir_url = environment.cibmtr_fhir_r3_url;

  public static loinc_system = "http://loinc.org";

  public static loinc_codes = environment.loinc_codes;
}
