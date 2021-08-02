import { Component, OnInit } from "@angular/core";
import { Patient } from "../model/patient.";
import { ActivatedRoute, Router } from "@angular/router";
import { throwError, Observable, Subject } from "rxjs";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FhirService } from "./fhir.service";
import { AppConfig } from "../app.config";
import { take, retry } from "rxjs/operators";
import { NmdpWidget } from "@nmdp/nmdp-login";
import { DialogComponent } from "../dialog/dialog.component";
import { LocalStorageService } from "angular-2-local-storage";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UtilityService } from "../utility.service";
import { SpinnerService } from "../spinner/spinner.service";
import { Validator } from "../validator_regex";

@Component({
  selector: "app-main",
  templateUrl: "./patient.component.html",
  styleUrls: ["./patient.component.scss"],
})
export class PatientComponent implements OnInit {
  bsModalRef: BsModalRef;
  ehrpatient: Patient;
  labs: any;
  priorityLabs: any;
  cibmtrObservations: any;
  crid: string;
  logicalId: string;
  fhirApp: string = "FHIR";
  cridApp: string = "CRID";
  lookupPatientCrid$: Observable<any>;
  cridCallComplete: Boolean = false;
  psScope: string;
  isLoading: Boolean;
  now: Date;
  cibmtrPatientId: Observable<any>;
  dataManager_name: string;
  selectedCenter_name: string;
  cridSubject: Subject<any> = new Subject();
  crid$: Observable<string> = this.cridSubject.asObservable();
  isValidSsn: boolean;
  ssn: string;

  constructor(
    private _route: ActivatedRoute,
    private modalService: BsModalService,
    private fhirService: FhirService,
    private widget: NmdpWidget,
    private _localStorageService: LocalStorageService,
    private http: HttpClient,
    private router: Router,
    private spinner: SpinnerService,
    private utility: UtilityService,
    private ssnregex: Validator
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

  async determineModal(): Promise<any[]> {
    if (!this.widget) {
      return;
    }

    let decodedValue = this.widget.decodeJWT(
      await this.widget.getAccessToken()
    );

    let scopes = decodedValue.authz_cibmtr_fhir_ehr_client.filter(
      (item) => item.includes("_role_rc") && item.includes("_fn3")
    );

    this.dataManager_name =
      decodedValue.first_name + " " + decodedValue.last_name;

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
    let cibmtrUrl = AppConfig.cibmtr_fhir_url + "Organization?_security=";

    let cibmtrCenters = [];
    if (scopes !== "") {
      await this.http
        .get(`${cibmtrUrl}${scopes}`)
        .toPromise()
        .then((cibmtrResponse: any) => {
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
    this.spinner.end();
    this._route.data.subscribe(
      (results) => {
        this.ehrpatient = results.pageData[0];
        this.labs = results.pageData[1];
        this.priorityLabs = results.pageData[2];
        this.validateFields(this.ehrpatient);
        this.retreiveFhirPatient(this.ehrpatient, selectedScope);
      },
      (error) => {
        this.spinner.reset();
        return throwError(error);
      }
    );
  };

  retreiveFhirPatient(ehrpatient, selectedScope) {
    this.psScope = "rc_" + selectedScope.value;
    this.selectedCenter_name = selectedScope.name;

    let logicalId = encodeURI(
      "".concat(
        AppConfig.epic_logicalId_namespace,
        "|",
        this.utility.rebuild_DSTU2_STU3_Url(
          this._localStorageService.get("iss")
        ) +
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
      .subscribe(
        (resp: any) => {
          const total = resp.total;
          if (total && total > 0) {
            if (resp.entry) {
              resp.entry.filter((entry) => {
                if (entry.resource) {
                  if (
                    entry.resource.identifier &&
                    entry.resource.identifier.length > 0
                  ) {
                    const filteredCrid = entry.resource.identifier.filter(
                      (i) => i.system === AppConfig.cibmtr_crid_namespace
                    );
                    if (filteredCrid && filteredCrid.length > 0) {
                      this.crid = filteredCrid[0].value;
                    }
                  }
                }
              });
            }
          }
          this.cridCallComplete = true;
          this.cridSubject.next("Patient lookup Successful");
        },
        () => {
          this.handleErrorv2;
        }
      );
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

  register(e: any, ehrpatient: any) {
    e.preventDefault();
    e.stopPropagation();
    this.isLoading = true;

    //Gender
    //let genderenums = ["unknown", "other"];

    let gender;
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
      gender = ehrpatient.gender.toLowerCase();
    }


    // const raceDetailCodes = ehrpatient.extension && ehrpatient.extension
    //   .map((outerEle) => {
    //     return (
    //       outerEle.extension &&
    //       outerEle.extension.filter(
    //         (innerEle) =>
    //           innerEle.valueCoding &&
    //           AppConfig.racedetails_ombsystem.includes(
    //             innerEle.valueCoding.system
    //           )
    //       )
    //     );
    //   })
    //   .filter((a) => a !== undefined && a.length > 0)
    //   .reduce((acc, val) => acc.concat(val), [])
    //   .map((i) => i.valueCoding && i.valueCoding.code);

  
    const raceCodes = ehrpatient.extension && ehrpatient.extension
      .map((outerEle) => {
        return (
          outerEle.extension &&
          outerEle.extension.filter(
            (innerEle) =>
              innerEle.valueCoding &&
              AppConfig.race_ombsystem.includes(innerEle.valueCoding.system)
          )
        );
      })
      .filter((a) => a !== undefined && a.length > 0) // filter
      .reduce((acc, val) => acc.concat(val), []) // flatten the array
      .map((i) => i.valueCoding && i.valueCoding.code); // extract the codes

     const ethnicityCodes = ehrpatient.extension && ehrpatient.extension
      .map((outerEle) => {
        return (
          outerEle.extension &&
          outerEle.extension.filter(
            (innerEle) =>
              innerEle.valueCoding &&
              AppConfig.ethnicity_ombsystem.includes(
                innerEle.valueCoding.system
              )
          )
        );
      })
      .filter((a) => a !== undefined && a.length > 0)
      .reduce((acc, val) => acc.concat(val), [])
      .map((i) => i.valueCoding && i.valueCoding.code)
      .join();
    //CRID Payload

    let payload = {
      ccn: this.psScope.substring(3),
      patient: {
        firstName: ehrpatient.name[0].given[0],
        lastName: ehrpatient.name[0].family,
        birthDate: ehrpatient.birthDate,
        gender: gender === "male" ? "M" : "F",
        ssn: this.isValidSsn ? this.ssn : null,
        race: raceCodes,
        //raceDetails: raceDetailCodes,
        ethnicity: ethnicityCodes,
      },
    };

    for (let [key, value] of Object.entries(payload.patient)) {
      if (!value) delete payload.patient[key];
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
            .pipe(retry(1))
            .subscribe(
              () => {
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
    const {
      id,
      identifier,
      text: { status } = { status: "generated" },
      ...remainingfields
    } = ehrpatient;

    let updatedEhrPatient = {
      ...remainingfields,
      text: {
        status: status,
      },
      meta: {
        security: [
          {
            system: AppConfig.cibmtr_centers_namespace,
            code: this.psScope,
          },
        ],
      },
      identifier: [
        identifier,
        {
          use: "official",
          system: AppConfig.epic_logicalId_namespace,
          value:
            this.utility.rebuild_DSTU2_STU3_Url(
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

  validateFields(ehrpatient) {
    const ssnIdentifier = ehrpatient.identifier.filter((i) =>
      AppConfig.ssn_system.includes(i.system)
    );

    if (ssnIdentifier && ssnIdentifier.length > 0) {
      this.ssn = ssnIdentifier[0].value;

      if (this.ssnregex.validateSSN(ssnIdentifier[0].value)) {
        this.isValidSsn = true;
      }
    }
  }

  proceed() {
    this.utility.data = {
      labs: JSON.stringify(this.labs),
      priorityLabs: JSON.stringify(this.priorityLabs),
      ehrpatient: JSON.stringify(this.ehrpatient),
      crid: this.crid,
      psScope: this.psScope,
    };
    this.router
      .navigate(["/patientdetail"])
      .then((e) => console.info(e + ""))
      .catch((e) => console.error(e));
  }

  /**
   *
   * @param accessToken
   */

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
