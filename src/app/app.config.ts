export class AppConfig {
  // Define all the constants of the app
  public static client_id = "7783cce2-67bc-4ef7-9762-c93819e5f80c";
  public static non_prod_client_id = "b5aaa0c6-6909-4473-a11e-fa7492cdce6d";

  //AWSEnv Dev
  public static epic_oauth_redirect_url =
    "https://cibmtr-fhir-ehr-frontend-dev.aws.nmdp.org";

  //Unable to get the ISS Url from LocalStorage because of GET_PATIENT_IDENTIFIER Iss contains "DSTU2" String and connot be modified , to be hardcoded as STU3 in the url
  public static patient_endpoint =
    "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3/Patient/";

  public static observation_endpoint =
    "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/STU3/Observation";

  public static patient_identifiers =
    "interconnect-aocurprd-oauth/api/epic/2015/Common/Patient/GetPatientIdentifiers/Patient/Identifiers";

  public static observation_codes =
    "code=http://wiki.nci.nih.gov/display/cadsr|88,64159,2003853,2603692,2787340,2787346,2787385,2787392,2787396,2787403,2787415,2787423,2787453,2787459,2787467,2787484,2787521,2787539,2787565,2787579,2787616,2787667,2787671,2787840,2787856,2787862,2787870,2787872,2787874,2793688,2793723,2793723,2797618,2797645,2797671,2860477,2861433,3578143,4492414,4492418,4492434,4492471,4492511,4492571,4492575";
  
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
