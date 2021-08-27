export const environment = {
  production: false,
  preprod: true,
  ehr_client_id: window["env"]["ehr_client_id"],
  okta_setup: {
    clientId: window["env"]["okta_client_id"],
    scopes: [window["env"]["okta_scopes"]],
    environment : window["env"]["okta_env_name"]
  },
  ehr_redirect_url: window["env"]["ehr_redirect_url"],
  cibmtr_fhir_r3_url: window["env"]["cibmtr_fhir_r3_url"],
  loinc_codes:[window["env"]["loinc_codes"]]
};
