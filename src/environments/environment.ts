// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { renderFlagCheckIfStmt } from "@angular/compiler/src/render3/view/template";

export const environment = {
  production: true,
  mock: false,
  ehr_client_id: window["env"]["ehr_client_id"] || "ehr_client_id",
  okta_setup: {
    clientId: window["env"]["okta_client_id"],
    scopes: [window["env"]["okta_scopes"]],
    environment: window["env"]["okta_env_name"],
  },
  ehr_redirect_url: window["env"]["ehr_redirect_url"],
  cibmtr_fhir_r3_url: window["env"]["cibmtr_fhir_r3_url"],
  loinc_codes: [window["env"]["loinc_codes"]],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
