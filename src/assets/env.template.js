(function(window) {
  window["env"] = window["env"] || {};

  // Environment variable placeholders
  window["env"]["ehr_client_id"] = "${EHR_CLIENT_ID}";
  window["env"]["ehr_redirect_url"] = "${EHR_REDIRECT_URL}";
  window["env"]["cibmtr_fhir_r3_url"] = "${CIBMTR_FHIR_R3_URL}";

  window["env"]["okta_client_id"] = "${OKTA_CLIENT_ID}";
  window["env"]["okta_scopes"] = "${OKTA_SCOPES}";
  window["env"]["okta_env_name"] = "${OKTA_ENV_NAME}";
  window["env"]["loinc_codes"] = "${LOINC_CODES}";
  window["env"]["logica_client_Id"] = "${LOGICA_CLIENT_ID}";
})(this);
