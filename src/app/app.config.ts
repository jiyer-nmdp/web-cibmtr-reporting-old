export class AppConfig {
  // Define all the constants of the app

  //EPIC Client ID's

  public static client_id = "b5aaa0c6-6909-4473-a11e-fa7492cdce6d";
  //public static non_prod_client_id = "c8552975-89f8-4a9b-9fb4-071cb1c19646";

  //AWSEnv
  public static epic_oauth_redirect_url =
    "https://cibmtr-fhir-ehr-dev.nmdp.org";

  //CIBMTR Namespaces

  public static cibmtr_crid_namespace = "http://cibmtr.org/identifier/CRID";

  public static cibmtr_centers_namespace =
    "http://cibmtr.org/codesystem/transplant-center";

  //EPIC Patient Namespace Logical ID
  public static epic_logicalId_namespace = "urn:ietf:rfc:3986";

  //Middleware URLs

  public static crid_service_endpoint =
    "https://qa-internal-api.nmdp.org/cibmtrehrclientbackendqa/v1/CRID";

  public static observation_codes =
    "code=https://cdebrowser.nci.nih.gov|88,https://cdebrowser.nci.nih.gov|64159,https://cdebrowser.nci.nih.gov|2003853,https://cdebrowser.nci.nih.gov|2603692,https://cdebrowser.nci.nih.gov|2787346,https://cdebrowser.nci.nih.gov|2787385,https://cdebrowser.nci.nih.gov|2787392,https://cdebrowser.nci.nih.gov|2787396,https://cdebrowser.nci.nih.gov|2787403,https://cdebrowser.nci.nih.gov|2787415,https://cdebrowser.nci.nih.gov|2787423,https://cdebrowser.nci.nih.gov|2787453,https://cdebrowser.nci.nih.gov|2787459,https://cdebrowser.nci.nih.gov|2787467,https://cdebrowser.nci.nih.gov|2787484,https://cdebrowser.nci.nih.gov|2787521,https://cdebrowser.nci.nih.gov|2787539,https://cdebrowser.nci.nih.gov|2787565,https://cdebrowser.nci.nih.gov|2787579,https://cdebrowser.nci.nih.gov|2787616,https://cdebrowser.nci.nih.gov|2787667,https://cdebrowser.nci.nih.gov|2787671,https://cdebrowser.nci.nih.gov|2787840,https://cdebrowser.nci.nih.gov|2787856,https://cdebrowser.nci.nih.gov|2787862,https://cdebrowser.nci.nih.gov|2787870,https://cdebrowser.nci.nih.gov|2787872,https://cdebrowser.nci.nih.gov|2787874,https://cdebrowser.nci.nih.gov|2793688,https://cdebrowser.nci.nih.gov|2793723,https://cdebrowser.nci.nih.gov|2793723,https://cdebrowser.nci.nih.gov|2797618,https://cdebrowser.nci.nih.gov|2797645,https://cdebrowser.nci.nih.gov|2797671,https://cdebrowser.nci.nih.gov|2860477,https://cdebrowser.nci.nih.gov|2861433,https://cdebrowser.nci.nih.gov|3578143,https://cdebrowser.nci.nih.gov|4492414,https://cdebrowser.nci.nih.gov|492418,https://cdebrowser.nci.nih.gov|4492434,https://cdebrowser.nci.nih.gov|4492471,https://cdebrowser.nci.nih.gov|4492511,https://cdebrowser.nci.nih.gov|4492571,https://cdebrowser.nci.nih.gov|4492575";

  public static cibmtr_fhir_base_url =
    "https://qa-internal-api.nmdp.org/cibmtrehrclientbackendqa/v1/Patient?identifier=";

  public static cibmtr_fhir_update_url =
    "https://qa-internal-api.nmdp.org/cibmtrehrclientbackendqa/v1/";

  public static codes = [
    "88",
    "64159",
    "2003853",
    "2603692",
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
