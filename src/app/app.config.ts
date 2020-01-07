export class AppConfig {
  // Define all the constants of the app

  //EPIC Client ID's

  public static client_id = "871a54f4-aed2-431c-8b6f-38a8bc34225f";
  public static non_prod_client_id = "fe30e164-a265-4f71-9b14-570be8cb3f27";

  //AWSEnv Dev
  public static epic_oauth_redirect_url =
    "https://cibmtr-fhir-ehr-frontend-qa.aws.nmdp.org";

  //CIBMTR Namespaces

  public static cibmtr_crid_namespace = "http://cibmtr.org/identifier/CRID";

  public static cibmtr_centers_namespace =
    "http://cibmtr.org/codesystem/transplant-center";

  //Middleware URLs

  public static crid_service_endpoint =
    "https://qa-internal-api.nmdp.org/cibmtrehrclientbackendqa/v1/CRID";

  public static observation_codes =
    "code=http://wiki.nci.nih.gov/display/cadsr|88,64159,2003853,2603692,2787340,2787346,2787385,2787392,2787396,2787403,2787415,2787423,2787453,2787459,2787467,2787484,2787521,2787539,2787565,2787579,2787616,2787667,2787671,2787840,2787856,2787862,2787870,2787872,2787874,2793688,2793723,2793723,2797618,2797645,2797671,2860477,2861433,3578143,4492414,4492418,4492434,4492471,4492511,4492571,4492575";

  public static cibmtr_fhir_base_url =
    "https://qa-internal-api.nmdp.org/cibmtrehrclientbackendqa/v1/Patient?identifier=";

  public static cibmtr_fhir_update_url =
    "https://qa-internal-api.nmdp.org/cibmtrehrclientbackendqa/v1/";

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
