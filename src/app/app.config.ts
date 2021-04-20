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

  //EPIC Client ID's
  public static client_id = "b5aaa0c6-6909-4473-a11e-fa7492cdce6d";

  //AWSEnv
  public static epic_oauth_redirect_url =
    "https://cibmtr-fhir-ehr-dev.nmdp.org";

  //Middleware URLs

  public static crid_service_endpoint =
    "https://dev-internal-api.nmdp.org/cibmtr-fhir-backend/v1/r3/CRID";

  public static cibmtr_fhir_url =
    "https://dev-internal-api.nmdp.org/cibmtr-fhir-backend/v1/r3/";

  public static observation_codes =
    "code=https://cdebrowser.nci.nih.gov|2003853,https://cdebrowser.nci.nih.gov|2603692,https://cdebrowser.nci.nih.gov|2787385,https://cdebrowser.nci.nih.gov|2787392,https://cdebrowser.nci.nih.gov|2787396,https://cdebrowser.nci.nih.gov|2787403,https://cdebrowser.nci.nih.gov|2787415,https://cdebrowser.nci.nih.gov|2787423,https://cdebrowser.nci.nih.gov|2787453,https://cdebrowser.nci.nih.gov|2787459,https://cdebrowser.nci.nih.gov|2787467,https://cdebrowser.nci.nih.gov|2787484,https://cdebrowser.nci.nih.gov|2787521,https://cdebrowser.nci.nih.gov|2787539,https://cdebrowser.nci.nih.gov|2787565,https://cdebrowser.nci.nih.gov|2787579,https://cdebrowser.nci.nih.gov|2787616,https://cdebrowser.nci.nih.gov|2787667,https://cdebrowser.nci.nih.gov|2787671,https://cdebrowser.nci.nih.gov|2787840,https://cdebrowser.nci.nih.gov|2787856,https://cdebrowser.nci.nih.gov|2787862,https://cdebrowser.nci.nih.gov|2787870,https://cdebrowser.nci.nih.gov|2787872,https://cdebrowser.nci.nih.gov|2787874,https://cdebrowser.nci.nih.gov|2793688,https://cdebrowser.nci.nih.gov|2797618,https://cdebrowser.nci.nih.gov|2797645,https://cdebrowser.nci.nih.gov|2797671,https://cdebrowser.nci.nih.gov|2860477,https://cdebrowser.nci.nih.gov|2861433,https://cdebrowser.nci.nih.gov|3578143,https://cdebrowser.nci.nih.gov|4492414,https://cdebrowser.nci.nih.gov|492418,https://cdebrowser.nci.nih.gov|4492434,https://cdebrowser.nci.nih.gov|4492471,https://cdebrowser.nci.nih.gov|4492511,https://cdebrowser.nci.nih.gov|4492571,https://cdebrowser.nci.nih.gov|4492575";

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

  //public static loinc_system = "http://loinc.org";

  //public static pipe_escape = "%7c";

  public static loinc_codes = [
    "26508-2",
    "35332-6",
    "764-1",
    "30180-4",
    "706-2",
    "707-0",
    "26446-5",
    "709-6",
    "26449-9",
    "711-2",
    "712-0",
    "26450-7",
    "713-8",
    "714-6",
    "4576-5",
    "71865-0",
    "71864-3",
    "71863-5",
    "32682-7",
    "38524-5",
    "42246-9",
    "4633-4",
    "718-7",
    "59260-0",
    "30313-1",
    "14775-1",
    "20509-6",
    "55782-7",
    "30351-1",
    "76768-1",
    "30350-3",
    "76769-9",
    "75928-2",
    "93846-4",
    "20570-8",
    "71833-8",
    "71831-2",
    "71829-6",
    "4544-3",
    "4545-0",
    "48703-3",
    "31100-1",
    "42908-4",
    "41654-5",
    "26474-7",
    "731-0",
    "732-8",
    "26478-8",
    "736-9",
    "737-7",
    "30433-7",
    "739-3",
    "28541-1",
    "740-1",
    "71668-8",
    "40651-2",
    "26484-6",
    "742-7",
    "743-5",
    "26485-3",
    "5905-5",
    "744-3",
    "30444-4",
    "746-8",
    "30445-1",
    "747-6",
    "30446-9",
    "748-4",
    "26498-6",
    "749-2",
    "71667-0",
    "26499-4",
    "751-8",
    "753-4",
    "26511-6",
    "770-8",
    "23761-0",
    "30458-4",
    "24103-4",
    "13047-6",
    "79426-3",
    "28542-9",
    "32623-1",
    "26515-7",
    "777-3",
    "49497-1",
    "778-1",
    "30465-9",
    "6746-2",
    "34926-6",
    "33855-8",
    "30466-7",
    "13599-6",
    "26523-1",
    "781-5",
    "26524-9",
    "783-1",
    "71666-2",
    "26453-1",
    "789-8",
    "790-6",
    "14196-0",
    "60474-4",
    "40665-2",
    "26464-8",
    "6690-2",
    "49498-9",
    "804-5",
    "1754-1",
    "6942-7",
    "77158-4",
    "1751-7",
    "61151-7",
    "61152-5",
    "2862-1",
    "1952-1",
    "76484-5",
    "35194-0",
    "1975-2",
    "14631-6",
    "77137-8",
    "2532-0",
    "14804-9",
    "14805-6",
    "35214-6",
    "2498-4",
    "14798-3",
    "35215-3",
    "2500-7",
    "14800-7",
    "35209-6",
    "24373-3",
    "2276-4",
    "20567-4",
    "11150-0",
    "57028-3",
    "26505-8",
    "32200-8",
    "769-0"
  ];
}
