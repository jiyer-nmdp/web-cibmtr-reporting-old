module.exports = {
  description: "Unite",
  version: "0.0",
  ids_authority: "",

  environments: {
    local: {
      api_endpoint: "http://localhost:8080",
      nmdpWidget: {
        environment: "Dev",
        oktaConfig: {
          clientId: "0oakoy7jm0GvmkmYp0h7",
          orgUrl: "https://nmdp.oktapreview.com/",
          authParams: {
            issuer: "https://nmdp.oktapreview.com/oauth2/ausaexcazhLhxKnJs0h7",
            scopes: ["api_cibmtr_fhir_ehr_client"],
          },
        },
      },
    },

    dev: {
      api_endpoint: "https://dev-api.nmdp.org/", // WSO2
      nmdpWidget: {
        environment: "Dev",
        oktaConfig: {
          clientId: "0oakoy7jm0GvmkmYp0h7",
          orgUrl: "https://nmdp.oktapreview.com/",
          authParams: {
            issuer: "https://nmdp.oktapreview.com/oauth2/ausaexcazhLhxKnJs0h7",
            scopes: ["api_cibmtr_fhir_ehr_client"],
          },
        },
      },
    },

    qa: {
      api_endpoint: "https://qa-internal-api.nmdp.org/", // WSO2
      nmdpWidget: {
        environment: "Dev",
        oktaConfig: {
          clientId: "0oalt8vaqtezs5xwu0h7",
          orgUrl: "https://nmdp.oktapreview.com/",
          authParams: {
            issuer: "https://nmdp.oktapreview.com/oauth2/ausaexcazhLhxKnJs0h7",
          },
        },
      },
    },

    externalTest: {
      api_endpoint: "https://dev-api.nmdp.org/", // WSO2
      nmdpWidget: {
        environment: "Dev",
        oktaConfig: {
          clientId: "0oakoy7jm0GvmkmYp0h7",
          orgUrl: "https://nmdp.oktapreview.com/",
          authParams: {
            issuer: "https://nmdp.oktapreview.com/oauth2/ausaexcazhLhxKnJs0h7",
            scopes: ["api_cibmtr_fhir_ehr_client"],
          },
        },
      },
    },

    prod: {
      api_endpoint: "https://api.nmdp.org/", //WSO2
      build: {
        sourceMaps: false,
      },
      nmdpWidget: {
        environment: "Prod",
        oktaConfig: {
          clientId: "0oad58hxgvlrSe1SV1t7",
          orgUrl: "https://nmdp.okta.com/",
          authParams: {
            issuer: "https://nmdp.okta.com/oauth2/aus3ck6q30qmOdpMb1t7",
            scopes: ["api_cibmtr_fhir_ehr_client"],
          },
        },
      },
    },

    ci: {
      appDynamic: {
        key: "APPDYNAMIC_KEY",
      },
      api_endpoint: "API_ENDPOINT",
      build: {
        sourceMaps: "BUILD_SOURCEMAPS",
      },
      nmdpWidget: {
        environment: "NMDPWIDGET_ENVIRONMENT",
        oktaConfig: {
          clientId: "NMDPWIDGET_OKTACONFIG_CLIENTID",
          orgUrl: "NMDPWIDGET_OKTACONFIG_ORGURL",
          authParams: {
            issuer: "NMDPWIDGET_OKTACONFIG_AUTHPARAMS_ISSUER",
          },
        },
      },
    },
  },
  common: {
    appDynamic: {
      key: "SPECIFY A KEY",
    },
    build: {
      sourceMaps: true,
      removeTestId: false,
    },
    idle: {
      timeBeforeWarn: 900,
      timeToRespond: 900,
      interruptThrottleTime: 5,
    },
    nmdpWidget: {
      oktaConfig: {
        features: {
          rememberMe: false,
          selfServiceUnlock: false, // default is false
          smsRecovery: false, // default is false
          callRecovery: false, // default is false
          multiOptionalFactorEnroll: true, // default is false
          router: false, // default is false
        },
        authParams: {
          responseType: "token",
          responseMode: "okta_post_message",
        },
      },
      nmdpConfig: {
        refreshBeforeExpires: 300,
        sessionLifetimeTimeout: 43200,
        idleSessionTimeout: 1800,
      },
    },
    toast: {
      successToastTimeout: 10000,
      infoToastTimeout: 10000,
      errorToastTimeout: 10000,
    },
    polling: {
      searchesPollingDelay: 5000,
    },
    sw: {
      enabled: false,
    },
  },
};
