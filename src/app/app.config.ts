export class AppConfig {
  // Define all the constants of the app
  public static client_id = "21de6f0d-5c32-4aef-94ce-7df27983ac59";
  public static non_prod_client_id = "c8552975-89f8-4a9b-9fb4-071cb1c19646";
  public static epic_oauth_redirect_url =
    "https://cibmtr-fhir-ehr-dev.nmdp.org";

  public static patient_identifiers =
    "interconnect-aocurprd-oauth/api/epic/2015/Common/Patient/GetPatientIdentifiers/Patient/Identifiers/";

  public static observation_codes =
    "&code=http://wiki.nci.nih.gov/display/cadsr|88,64159,2003853,2603692,2787340,2787346,2787385,2787392,2787396,2787403,2787415,2787423,2787453,2787459,2787467,2787484,2787521,2787539,2787565,2787579,2787616,2787667,2787671,2787840,2787856,2787862,2787870,2787872,2787874,2793688,2793723,2793723,2797618,2797645,2797671,2860477,2861433,3578143,4492414,4492418,4492434,4492471,4492511,4492571,4492575";

  public static crid_service_endpoint =
    "https://dev-api.nmdp.org/cibmtrehrclientbackend/v2/CRID";

  public static cibmtr_fhir_base_url =
    "https://dev-api.nmdp.org/cibmtrehrclientbackend/v2/Patient?identifier=";

  public static cibmtr_fhir_update_url =
    "https://dev-api.nmdp.org/cibmtrehrclientbackend/v2";

  public static codes = [
    "88",
    "64159",
    "2003853",
    "2603692",
    "2787340",
    "2787346",
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
    "2793723",
    "2793723",
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
    "4492575"
  ];
}
