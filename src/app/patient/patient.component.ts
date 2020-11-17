import { Component, OnInit, ErrorHandler } from "@angular/core";
import { Patient } from "../model/patient.";
import { ActivatedRoute, Router } from "@angular/router";
import { throwError, Observable } from "rxjs";
import * as jwt_decode from "jwt-decode";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FhirService } from "./fhir.service";
import { AppConfig } from "../app.config";
import { ObservationAgvhdService } from "../observation.agvhd/observation.agvhd.service";
import { take } from "rxjs/operators";
import { NmdpWidget } from "@nmdp/nmdp-login/Angular/service/nmdp.widget";
import { CustomHttpClient } from "../client/custom.http.client";
import { DialogComponent } from "../dialog/dialog.component";
import { LocalStorageService } from "angular-2-local-storage";
import { HttpErrorResponse } from "@angular/common/http";
import { UtilityService } from "../utility.service";

@Component({
  selector: "app-main",
  templateUrl: "./patient.component.html",
  styleUrls: ["./patient.component.scss"],
})
export class PatientComponent implements OnInit {
  bsModalRef: BsModalRef;
  ehrpatient: Patient;
  agvhd: any;
  labs: any;
  vitals: any;
  core: any;
  cibmtrObservations: any;
  crid: string;
  logicalId: string;
  fhirApp: string = "FHIR";
  cridApp: string = "CRID";
  lookupPatientCrid$: Observable<any>;
  crid$: Observable<any>;
  cridCallComplete: Boolean = false;
  psScope: string;
  isLoading: Boolean;
  now: Date;
  cibmtrPatientId: Observable<any>;
  dataManager_name: string;
  selectedCenter_name : string;

  constructor(
    private _route: ActivatedRoute,
    private modalService: BsModalService,
    private fhirService: FhirService,
    private nmdpWidget: NmdpWidget,
    private _localStorageService: LocalStorageService,
    private http: CustomHttpClient,
    private router: Router,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.determineModal().then((cibmtrCenters) => {
      if (cibmtrCenters && cibmtrCenters.length > 1) {
        this.bsModalRef = this.modalService.show(DialogComponent, {
          initialState: { cibmtrCenters },
          ignoreBackdropClick: true,
          keyboard: false,
        });
        this.bsModalRef.content.onClose.subscribe((result) => {
          if (result === "Continue") {
            this.subscribeRouteData(this.bsModalRef.content.currentItem);
          }
        });
      } else if (cibmtrCenters) {
        this.subscribeRouteData(cibmtrCenters[0]);
      }
    });
  }

  determineModal(): Promise<any[]> {
    if (!this.nmdpWidget.isLoggedIn) {
      return;
    }

    let decodedValue = this.getDecodedAccessToken(
      this.nmdpWidget.getAccessToken()
    );

    let scopes = decodedValue.authz_cibmtr_fhir_ehr_client.filter(
      (item) => item.includes("_role_rc") && item.includes("_fn3")
    );

    //two-way binding in UI
    this.dataManager_name =
      decodedValue.first_name + " " + decodedValue.last_name;
    


    //Scope format - "l1_role_rc_10121_fn3"
    scopes.forEach((scope, index) => {
      scopes[index] = scope.match(/(rc_\d+)_fn3/)[1];
    });
    scopes = scopes.join(",");
    return this.fetchData(scopes);
  }

  

  /**
   *
   * @param scopes
   */
  async fetchData(scopes): Promise<any[]> {
    let cibmtrUrl =
      AppConfig.cibmtr_fhir_update_url + "Organization?_security=";

    let cibmtrCenters = [];
    if (scopes !== "") {
      await this.http
        .get(`${cibmtrUrl}${scopes}`)
        .toPromise()
        .then((cibmtrResponse) => {
          let cibmtrEntry = cibmtrResponse.entry;
          cibmtrEntry.forEach((element) => {
            let value = element.resource.identifier[0].value;
            let name = element.resource.name;
            cibmtrCenters.push({
              value,
              name,
              selected: false,
            });
          });
        })
        .catch((error) => {
          this.handleError(error, this.fhirApp, new Date().getTime());
        });
      return cibmtrCenters;
    }
    alert(
      "your User ID has not been provisioned correctly. \n Please contact the Service Desk at (763) 406-3411 or (800) 526-7809 x3411"
    );
  }

  /**
   *
   * @param ehrpatient
   */
  getGivenName(ehrpatient) {
    let givenName;
    if (ehrpatient.name[0].given.length > 0) {
      givenName = ehrpatient.name[0].given.join(" ");
    }
    return givenName;
  }

  subscribeRouteData = (selectedScope) => {
    this._route.data.subscribe(
      (results) => {
        this.ehrpatient = results.pageData[0];
        this.agvhd = results.pageData[1];
        this.vitals = results.pageData[2];
        this.labs = results.pageData[3];
        this.core = results.pageData[4];
        this.retreiveFhirPatient(this.ehrpatient, selectedScope);
      },
      (error) => {
        return throwError(error);
      }
    );
  };

  //Rewrite to allow identifier - LogicalId search and also _security = selected center
  //https://dev-api.nmdp.org/cibmtrehrclientbackend/v2/Patient?_security=rc_10121&identifier=urn:oid:1.2.840.114350.1.13.0.1.7.5.737384.14%7C202884
  /**
   *
   * @param ehrpatient
   */
  retreiveFhirPatient(ehrpatient, selectedScope) {
    this.cridCallComplete = false;
    this.psScope = "rc_"+ selectedScope.value;
    this.selectedCenter_name = selectedScope.name;

    let logicalId = encodeURI(
      "".concat(
        AppConfig.epic_logicalId_namespace,
        "|",
        this.utilityService.rebuild_DSTU2_STU3_Url(
          this._localStorageService.get("iss")
          )+
          "/Patient/" +
          ehrpatient.id
      )
    );
    let encodedScope = encodeURI(
      "".concat(AppConfig.cibmtr_centers_namespace, "|", this.psScope)
    );
    this.fhirService
      .lookupPatientCrid(logicalId.concat(`&_security=${encodedScope}`))
      .pipe(take(1))
      .toPromise()
      .then((resp) => {
        let total = resp.total;
        if (total && total > 0) {
          if (resp.entry) {
            resp.entry.filter((entry) => {
              if (entry.resource) {
                if (
                  entry.resource.identifier &&
                  entry.resource.identifier.length > 0
                ) {
                  let filteredCrid = entry.resource.identifier.filter(
                    (i) => i.system === AppConfig.cibmtr_crid_namespace
                  );
                  if (filteredCrid && filteredCrid.length > 0) {
                    this.crid = filteredCrid[0].value;
                  }
                }
                if (entry.resource.fullUri) {
                  let fullUri = entry.resource.fullUri;
                }
              }
            });
          }
        }
      })
      .finally(() => (this.cridCallComplete = true))
      .catch(this.handleErrorv2);
  }

  /**
   *
   * @param error
   */
  private handleErrorv2(error: any): Promise<any> {
    if (error == null) {
      error = "undefined";
    }
    if (error != null) {
      console.error("An error occurred" + error);
      return Promise.reject(error.message || error.status);
    } else {
      console.error("An unknown error occurred");
      return Promise.reject("Unknown error");
    }
  }

  /**
   *
   * @param telecom
   */
  formatContact(telecom) {
    let contact = "";
    for (let i = 0; i < telecom.length; i++) {
      contact = contact + telecom[i].value + " (" + telecom[i].use + ")";
      if (i < telecom.length - 1) {
        contact = contact + ", ";
      }
    }
    return contact;
  }

  /**
   *
   * @param status
   */
  displayMaritalStatus(status) {
    if (status && status.coding) {
      return status.coding[0].display;
    }
    return "";
  }

  /**
   *
   * @param e
   * @param ehrpatient
   */
  register(e: any, ehrpatient: Patient) {
    this.cridCallComplete = false;
    e.preventDefault();
    e.stopPropagation();
    this.isLoading = true;

    let genderLowerCase;

    let ehrSsn = ehrpatient.identifier
      .filter(
        (i) =>
          i.system === "urn:oid:2.16.840.1.113883.4.1" ||
          i.system === "http://hl7.org/fhir/sid/us-ssn"
      )
      .map((i) => i.value)
      .join("");

    //Gender
    //let genderenums = ["unknown", "other"];

    if (
      !ehrpatient.gender ||
      ehrpatient.gender === "unknown" ||
      ehrpatient.gender === "other"
    ) {
      alert(
        "Unable to register this patient " +
          ehrpatient.gender +
          " is not currently supported as a gender value. Please contact your center's CIBMTR CRC to review this case."
      );
      this.isLoading = false;
      return;
    } else {
      genderLowerCase = ehrpatient.gender.toLowerCase();
    }

    //Name consider if official

    //Race Ethicity Mappings

    let racecode;
    let ethinicitycode;

    if (ehrpatient.extension && ehrpatient.extension.length >= 1) {
      for (let i = 0; i < ehrpatient.extension.length; i++) {
        if (
          ehrpatient.extension[i].extension &&
          ehrpatient.extension[i].extension.length >= 1
        ) {
          for (let j = 0; j < ehrpatient.extension[i].extension.length; j++) {
            if (ehrpatient.extension[i].extension[j].valueCoding) {
              if (
                AppConfig.raceOmbsystem.includes(
                  ehrpatient.extension[i].extension[j].valueCoding.system
                )
              ) {
                racecode =
                  ehrpatient.extension[i].extension[j].valueCoding.code;
                let racecodes = racecode.concat(",");
                console.log(racecodes);
              }

              if (
                AppConfig.ethnicityOmbsystem.includes(
                  ehrpatient.extension[i].extension[j].valueCoding.system
                )
              ) {
                ethinicitycode =
                  ehrpatient.extension[i].extension[j].valueCoding.code;
              }
            }
          }
        }
      }
    }

    //CRID Payload

    let payload = {
      ccn: this.psScope.substring(3),
      patient: {
        firstName: ehrpatient.name[0].given[0],
        lastName: ehrpatient.name[0].family,
        birthDate: ehrpatient.birthDate,
        gender: genderLowerCase === "male" ? "M" : "F",
        ssn: ehrSsn,
        race: [racecode],
        ethnicity: ethinicitycode,
      },
    };

    //Delete payload entries if contains undefiend/null values
    for (let [key, value] of Object.entries(payload.patient)) {
      if (value === null || value === undefined || value === "")
        delete payload.patient[key];
    }

    console.log("Sanitized", payload);

    this.fhirService
      .getCrid(payload)
      .pipe(take(1))
      .subscribe(
        (result) => {
          const now = new Date();
          this.isLoading = false;
          // look for Perfect Match
          if (result && result.perfectMatch) {
            this.crid = result.perfectMatch[0].crid;
          } else {
            this.crid = result.crid;
          }

          //get EHR logical id
          this.logicalId = ehrpatient.id;

          let updatedEhrPatient = this.appendCridIdentifier(
            ehrpatient,
            this.crid,
            this.logicalId
          );

          //Now that we got the CRID save the Info into FHIR
          this.fhirService
            .submitPatient(updatedEhrPatient)
            .retry(1)
            .subscribe(
              () => {
                const now = new Date();
                console.log("Submitted patient");
              },
              (error) => {
                this.handleError(error, this.fhirApp, new Date().getTime());
              }
            );
        },
        (error) => {
          this.handleError(error, this.cridApp, new Date().getTime());
        },
        () => (this.cridCallComplete = true)
      );
  }

  // Update the existing ehr patient with the CRID value in FHIR Server.
  /**
   *
   * @param ehrpatient
   * @param crid
   */
  appendCridIdentifier(ehrpatient: Patient, crid: string, logicalId: string) {
    let updatedEhrPatient = {
      ...ehrpatient,
      meta: {
        security: [
          {
            system: AppConfig.cibmtr_centers_namespace,
            code: this.psScope,
          },
        ],
      },
      identifier: [
        ...ehrpatient.identifier,
        {
          use: "official",
          system: AppConfig.epic_logicalId_namespace,
          value:
            this.utilityService.rebuild_DSTU2_STU3_Url(
              this._localStorageService.get("iss")
            ) +
            "/Patient/" +
            logicalId,
        },
        {
          use: "official",
          system: AppConfig.cibmtr_crid_namespace,
          value: crid,
        },
      ],
    };
    return updatedEhrPatient;
  }

  /**
   *
   * @param
   */
  proceed() {
    // Navigate to the Patient Details Component
    this.router
      .navigate(["/patientdetail"], {
        state: {
          data: {
            agvhd: JSON.stringify(this.agvhd),
            labs: JSON.stringify(this.labs),
            vitals: JSON.stringify(this.vitals),
            core: JSON.stringify(this.core),
            ehrpatient: JSON.stringify(this.ehrpatient),
            crid: this.crid,
            psScope: this.psScope,
          },
        },
      })
      .then((e) => {
        if (e) {
          console.log("patientdetail navigation is successful!");
          console.log(this.agvhd);
          console.log(this.labs);
          console.log(this.vitals);
          console.log(this.ehrpatient);
        } else {
          alert("patientdetail navigation is unsuccessful!");
        }
      });
  }

  /**
   *
   * @param accessToken
   */
  getDecodedAccessToken(accessToken: string): any {
    return jwt_decode(accessToken);
  }

  /**
   *
   * @param error
   * @param system
   */
  handleError(error: HttpErrorResponse, system: string, timestamp: any) {
    this.isLoading = false;
    let errorMessage = `An unexpected failure for ${system} Server has occurred. Please try again. If the error persists, please report this to CIBMTR. Status: ${
      error.status
    } \n Message : ${
      error.error.errorMessage || error.message
    }. \nTimestamp : ${timestamp} `;

    alert(errorMessage);
    console.log(errorMessage);

    return throwError(error);
  }
}