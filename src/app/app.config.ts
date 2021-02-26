export class AppConfig {
  // Define all the constants of the app

  public static ssn_system = [
    "urn:oid:2.16.840.1.113883.4.1",
    "http://hl7.org/fhir/sid/us-ssn",
  ];

  public static raceOmbsystem = [
    "http://hl7.org/fhir/us/core/ValueSet/omb-race-category",
    "urn:oid:2.16.840.1.113883.6.238",
    "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",
  ];

  public static ethnicityOmbsystem = [
    "http://hl7.org/fhir/us/core/ValueSet/omb-ethnicity-category",
    "urn:oid:2.16.840.1.113883.6.238",
  ];

  //CIBMTR Namespaces
  public static cibmtr_crid_namespace = "http://cibmtr.org/identifier/CRID";
  public static cibmtr_centers_namespace =
    "http://cibmtr.org/codesystem/transplant-center";

  //EPIC Patient Namespace Logical ID
  public static epic_logicalId_namespace = "urn:ietf:rfc:3986";

  //EPIC Client ID's
  public static client_id = "fe30e164-a265-4f71-9b14-570be8cb3f27";

  //AWSEnv
  public static epic_oauth_redirect_url =
    "https://cibmtr-fhir-ehr-frontend-qa.aws.nmdp.org";

  //Middleware URLs

  public static crid_service_endpoint =
    "https://qa-internal-api.nmdp.org/cibmtrehrclientbackendqa/v1/CRID";

  public static observation_codes =
    "code=https://cdebrowser.nci.nih.gov|2003853,https://cdebrowser.nci.nih.gov|2603692,https://cdebrowser.nci.nih.gov|2787385,https://cdebrowser.nci.nih.gov|2787392,https://cdebrowser.nci.nih.gov|2787396,https://cdebrowser.nci.nih.gov|2787403,https://cdebrowser.nci.nih.gov|2787415,https://cdebrowser.nci.nih.gov|2787423,https://cdebrowser.nci.nih.gov|2787453,https://cdebrowser.nci.nih.gov|2787459,https://cdebrowser.nci.nih.gov|2787467,https://cdebrowser.nci.nih.gov|2787484,https://cdebrowser.nci.nih.gov|2787521,https://cdebrowser.nci.nih.gov|2787539,https://cdebrowser.nci.nih.gov|2787565,https://cdebrowser.nci.nih.gov|2787579,https://cdebrowser.nci.nih.gov|2787616,https://cdebrowser.nci.nih.gov|2787667,https://cdebrowser.nci.nih.gov|2787671,https://cdebrowser.nci.nih.gov|2787840,https://cdebrowser.nci.nih.gov|2787856,https://cdebrowser.nci.nih.gov|2787862,https://cdebrowser.nci.nih.gov|2787870,https://cdebrowser.nci.nih.gov|2787872,https://cdebrowser.nci.nih.gov|2787874,https://cdebrowser.nci.nih.gov|2793688,https://cdebrowser.nci.nih.gov|2797618,https://cdebrowser.nci.nih.gov|2797645,https://cdebrowser.nci.nih.gov|2797671,https://cdebrowser.nci.nih.gov|2860477,https://cdebrowser.nci.nih.gov|2861433,https://cdebrowser.nci.nih.gov|3578143,https://cdebrowser.nci.nih.gov|4492414,https://cdebrowser.nci.nih.gov|492418,https://cdebrowser.nci.nih.gov|4492434,https://cdebrowser.nci.nih.gov|4492471,https://cdebrowser.nci.nih.gov|4492511,https://cdebrowser.nci.nih.gov|4492571,https://cdebrowser.nci.nih.gov|4492575";

  public static cibmtr_fhir_base_url =
    "https://qa-internal-api.nmdp.org/cibmtrehrclientbackendqa/v1/Patient?identifier=";

  public static cibmtr_fhir_update_url =
    "https://qa-internal-api.nmdp.org/cibmtrehrclientbackendqa/v1/";

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

  public static loinc_codes = ["30412-1","30413-9","7789-1","1751-7","61151-7","61152-5","2862-1","702-1","11281-3","18280-8","26507-4","30229-9","26508-2","35332-6","703-9","26444-0","704-7","30180-4","706-2","1952-1","76484-5","35194-0","1975-2","14631-6","77137-8","10371-3","30376-8","11150-0","26446-5","709-6","71669-6","10372-1","5909-7","7790-9","11280-5","33255-1","7791-7","7792-5","11274-8","26449-9","711-2","26450-7","713-8","30384-2","21000-5","30385-9","788-0","49121-7","6742-1","26453-1","789-8","10379-6","32778-3","10373-9","5908-9","30394-1","30395-8","19023-1","30397-4","35058-7","716-1","10374-7","20570-8","4544-3","30313-1","14775-1","718-7","20509-6","55782-7","30351-1","76768-1","30350-3","76769-9","75928-2","59260-0","93846-4","7793-3","33249-4","728-6","34910-0","34911-8","34912-6","34913-4","34924-1","34925-8","35214-6","2498-4","14798-3","35215-3","2500-7","14800-7","10375-4","2532-0","14804-9","14805-6","35082-7","30420-4","26462-2","26463-0","11156-7","26464-8","6690-2","49498-9","804-5","30406-3","51383-8","26471-3","35050-4","34922-5","26474-7","731-0","35039-7","34921-7","26478-8","736-9","737-7","30422-0","30423-8","738-5","34914-2","34915-9","28539-5","785-6","28540-3","786-4","30428-7","787-2","30433-7","28541-1","741-9","35029-8","34923-3","26484-6","742-7","30440-2","30441-0","26485-3","5905-5","744-3","30444-4","30445-1","30446-9","26498-6","26499-4","751-8","753-4","33215-5","30449-3","765-8","30450-1","18319-4","26511-6","770-8","23761-0","33364-1","33363-3","7794-1","58443-3","58409-4","10376-2","774-0","7795-8","18311-1","10377-0","34916-7","34917-5","30458-4","24103-4","13047-6","79426-3","9317-9","7796-6","32207-3","28542-9","32623-1","11125-2","18312-9","26515-7","777-3","49497-1","778-1","33216-3","32146-3","32208-1","779-9","10378-8","35003-3","34999-3","50260-9","30464-2","30465-9","34926-6","30466-7","26523-1","26524-9","33044-9","7797-4","800-3","30451-9","26505-8","34918-3","13048-4","34919-1","801-1","34993-6","7798-2","34992-8","802-9","10380-4","10381-2","803-7","26477-0","43743-4","13046-8","42250-1","790-6","71865-0","71864-3","71863-5","4576-5","32682-7","38524-5","42246-9","4633-4","71832-0","71833-8","71831-2","71830-4","71829-6","32354-3","4545-0","48703-3","31100-1","62241-5","42908-4","11151-8","11271-4","41655-2","41654-5","62242-3","47282-9","11272-2","62243-1","47278-7","59468-9","62246-4","47279-5","59467-1","707-0","74462-3","74407-8","714-6","74405-2","30365-1","737-7","74461-5","74402-9","740-1","743-5","66143-9","74399-7","749-2","764-1","30450-1","767-4","32200-8","769-0","6746-2"];
}
