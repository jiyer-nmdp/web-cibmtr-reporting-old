export const environment = {
  production: false,
  mock: false,
  ehr_client_id: window["env"]["ehr_client_id"],
  okta_setup: {
    clientId: window["env"]["okta_client_id"],
    scopes: [window["env"]["okta_scopes"]],
    environment: window["env"]["okta_env_name"],
  },
  ehr_redirect_url: window["env"]["ehr_redirect_url"],
  cibmtr_fhir_r3_url: window["env"]["cibmtr_fhir_r3_url"],
  loinc_codes: [window["env"]["loinc_codes"]],
  logica_client_id:window["env"]["logica_client_Id"]
};

// export const environment = {
//   production: false,
//   mock: false,
//   ehr_client_id: "b5aaa0c6-6909-4473-a11e-fa7492cdce6d",
//   okta_setup: {
//     clientId: "0oakoy7jm0GvmkmYp0h7",
//     scopes: ["api_cibmtr_fhir_ehr_client"],
//     environment: "Dev",
//   },
//   ehr_redirect_url: "https://cibmtr-fhir-ehr-dev.nmdp.org",
//   cibmtr_fhir_r3_url:
//     "https://dev-internal-api.nmdp.org/cibmtr-fhir-backend/v1/r3/",
//   loinc_codes:
//     "26508-2,35332-6,764-1,30180-4,706-2,707-0,26446-5,709-6,26449-9,711-2,712-0,26450-7,713-8,714-6,4576-5,71865-0,71864-3,71863-5,32682-7,38524-5,42246-9,4633-4,718-7,59260-0,30313-1,14775-1,20509-6,55782-7,30351-1,76768-1,30350-3,76769-9,75928-2,93846-4,20570-8,71833-8,71831-2,71829-6,4544-3,4545-0,48703-3,31100-1,42908-4,41654-5,26474-7,731-0,732-8,26478-8,736-9,737-7,30433-7,739-3,28541-1,740-1,71668-8,40651-2,26484-6,742-7,743-5,26485-3,5905-5,744-3,30444-4,746-8,30445-1,747-6,30446-9,748-4,26498-6,749-2,71667-0,26499-4,751-8,753-4,26511-6,770-8,23761-0,30458-4,24103-4,13047-6,79426-3,28542-9,32623-1,26515-7,777-3,49497-1,778-1,30465-9,6746-2,34926-6,33855-8,30466-7,13599-6,26523-1,781-5,26524-9,783-1,71666-2,26453-1,789-8,790-6,14196-0,60474-4,40665-2,26464-8,6690-2,49498-9,804-5,1754-1,6942-7,77158-4,1751-7,61151-7,61152-5,2862-1,1952-1,76484-5,35194-0,1975-2,14631-6,77137-8,2532-0,14804-9,14805-6,35214-6,2498-4,14798-3,35215-3,2500-7,14800-7,35209-6,24373-3,2276-4,20567-4,11150-0,57028-3,26505-8,32200-8,769-0,4679-7,17849-1,31112-6,708-8,30376-8,26444-0,704-7,705-4,6863-5",
// };
