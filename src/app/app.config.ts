import {environment} from "../environments/environment";

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

  public static observation_codes =
    "code=https://cdebrowser.nci.nih.gov|2003853,https://cdebrowser.nci.nih.gov|2603692,https://cdebrowser.nci.nih.gov|2787385,https://cdebrowser.nci.nih.gov|2787392,https://cdebrowser.nci.nih.gov|2787396,https://cdebrowser.nci.nih.gov|2787403,https://cdebrowser.nci.nih.gov|2787415,https://cdebrowser.nci.nih.gov|2787423,https://cdebrowser.nci.nih.gov|2787453,https://cdebrowser.nci.nih.gov|2787459,https://cdebrowser.nci.nih.gov|2787467,https://cdebrowser.nci.nih.gov|2787484,https://cdebrowser.nci.nih.gov|2787521,https://cdebrowser.nci.nih.gov|2787539,https://cdebrowser.nci.nih.gov|2787565,https://cdebrowser.nci.nih.gov|2787579,https://cdebrowser.nci.nih.gov|2787616,https://cdebrowser.nci.nih.gov|2787667,https://cdebrowser.nci.nih.gov|2787671,https://cdebrowser.nci.nih.gov|2787840,https://cdebrowser.nci.nih.gov|2787856,https://cdebrowser.nci.nih.gov|2787862,https://cdebrowser.nci.nih.gov|2787870,https://cdebrowser.nci.nih.gov|2787872,https://cdebrowser.nci.nih.gov|2787874,https://cdebrowser.nci.nih.gov|2793688,https://cdebrowser.nci.nih.gov|2797618,https://cdebrowser.nci.nih.gov|2797645,https://cdebrowser.nci.nih.gov|2797671,https://cdebrowser.nci.nih.gov|2860477,https://cdebrowser.nci.nih.gov|2861433,https://cdebrowser.nci.nih.gov|3578143,https://cdebrowser.nci.nih.gov|4492414,https://cdebrowser.nci.nih.gov|492418,https://cdebrowser.nci.nih.gov|4492434,https://cdebrowser.nci.nih.gov|4492471,https://cdebrowser.nci.nih.gov|4492511,https://cdebrowser.nci.nih.gov|4492571,https://cdebrowser.nci.nih.gov|4492575";

  //Middleware URLs
  public static crid_service_endpoint = environment.cibmtr_fhir_r3_url + "CRID";

  public static cibmtr_fhir_url = environment.cibmtr_fhir_r3_url;

  public static codes = [
    "2003853",
    "2603692",
    "2787385",
    "2787392",
    "2787396",
    "2787403",
    "2787415",
    "2787423",
    "2787453",
    "2787459",
    "2787467",
    "2787484",
    "2787521",
    "2787539",
    "2787565",
    "2787579",
    "2787616",
    "2787667",
    "2787671",
    "2787840",
    "2787856",
    "2787862",
    "2787870",
    "2787872",
    "2787874",
    "2793688",
    "2797618",
    "2797645",
    "2797671",
    "2860477",
    "2861433",
    "3578143",
    "4492414",
    "4492418",
    "4492434",
    "4492471",
    "4492511",
    "4492571",
    "4492575",
  ];

  public static loinc_system = "http://loinc.org";

  public static loinc_codes = environment.loinc_codes;
}
