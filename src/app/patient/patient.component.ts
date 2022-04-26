import { Component, OnInit } from "@angular/core";
import { Patient } from "../model/patient.";
import { ActivatedRoute, Router } from "@angular/router";
import { throwError, Observable, Subject } from "rxjs";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FhirService } from "./fhir.service";
import { AppConfig } from "../shared/constants/app.config";
import { take, retry } from "rxjs/operators";
import { NmdpWidget } from "@nmdp/nmdp-login";
import { DialogComponent } from "../dialog/dialog.component";
import { LocalStorageService } from "angular-2-local-storage";
import { HttpErrorResponse } from "@angular/common/http";
import { UtilityService } from "../shared/service/utility.service";
import { SpinnerService } from "../spinner/spinner.service";
import { Validator } from "../shared/constants/validator_regex";
import { GlobalErrorHandler } from "../global-error-handler";
import { PatientService } from "./patient.service";
import { OrganizationService } from "../shared/service/organization.service";

@Component({
  selector: "app-main",
  templateUrl: "./patient.component.html",
  styleUrls: ["./patient.component.scss"],
})
export class PatientComponent implements OnInit {
  bsModalRef: BsModalRef;
  ehrpatient: Patient;
  cibmtrPatientCount: any;
  priorityLabs: any;
  crid: string;
  logicalId: string;
  lookupPatientCrid$: Observable<any>;
  isCibmtrCallSuccess: Boolean = false;
  ccn: string;
  isLoading: Boolean;
  now: Date;
  cibmtrPatientId: Observable<any>;
  dataManager_name: string;
  selectedCenter_name: string;
  cridSubject: Subject<any> = new Subject();
  crid$: Observable<string> = this.cridSubject.asObservable();
  isValidSsn: boolean;
  ssn: string;
  nonPIIIdentifiers: any[];
  ssnIdentifier: any;
  selectedOrg: any;

  constructor(
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private fhirService: FhirService,
    private widget: NmdpWidget,
    private localStorageService: LocalStorageService,
    private router: Router,
    private spinner: SpinnerService,
    private utility: UtilityService,
    private ssnregex: Validator,
    private globalErrorHandler: GlobalErrorHandler,
    private patientService: PatientService,
    private organizationService: OrganizationService
  ) {}

  ngOnInit() {
    this.determineModal()
      .then((cibmtrCenters) => {
        if (cibmtrCenters?.length > 1) {
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
        this.globalErrorHandler.handleError(cibmtrCenters);
      })
      .catch((error) => {
        this.globalErrorHandler.handleError(error);
      });
  }

  async determineModal(): Promise<any[]> {
    if (!this.widget) {
      return;
    }

    let decodedValue = this.widget.decodeJWT(
      await this.widget.getAccessToken()
    );
    this.globalErrorHandler.handleError(decodedValue);
    let scopes = decodedValue.authz_cibmtr_fhir_ehr_client.filter(
      (item) => item.includes("_role_rc") && item.includes("_fn3")
    );

    this.dataManager_name =
      decodedValue.first_name + " " + decodedValue.last_name;

    scopes.forEach((scope, index) => {
      scopes[index] = scope.match(/(rc_\d+)_fn3/)[1];
    });
    scopes = scopes.join(",");
    return this.organizationService.fetchCenters(scopes);
  }

  getGivenName(ehrpatient) {
    let givenName;
    if (ehrpatient.name[0].given.length > 0) {
      givenName = ehrpatient.name[0].given.join(" ");
    }
    return givenName;
  }

  subscribeRouteData = (selectedOrg) => {
    this.spinner.end();
    this.route.data.subscribe(
      (results) => {
        this.ehrpatient = results.pageData[0];
        this.priorityLabs = results.pageData[1];
        this.selectedOrg = selectedOrg;
        this.validate(this.ehrpatient, this.selectedOrg);
        this.retreiveFhirPatient(this.ehrpatient, selectedOrg);
        this.globalErrorHandler.handleError(this.ehrpatient);
      },
      (error) => {
        this.spinner.reset();
        this.globalErrorHandler.handleError(error);
        return throwError(error);
      }
    );
  };

  //Intial search Patient in FHIR server for CRID Lookup
  retreiveFhirPatient(ehrpatient, selectedOrg) {
    this.ccn = selectedOrg.value;
    this.selectedCenter_name = selectedOrg.name;

    const logicalId = encodeURI(
      "".concat(
        AppConfig.epic_logicalId_namespace,
        "|",
        this.utility.rebuild_DSTU2_STU3_Url(
          this.localStorageService.get("iss")
        ) +
          "/Patient/" +
          ehrpatient.id
      )
    );
    let encodedScope = encodeURI(
      "".concat(AppConfig.cibmtr_centers_namespace, "|", this.ccn)
    );

    this.fhirService
      .lookupPatientIdentifier(logicalId.concat(`&_security=${encodedScope}`))
      .pipe(take(1))
      .subscribe(
        (resp: any) => {
          this.cibmtrPatientCount = resp.total;
          if (this.cibmtrPatientCount > 0) {
            this.isCibmtrCallSuccess = true;
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
          this.cridSubject.next("Patient lookup Successful");
        },
        (error) => {
          this.handleError(error, new Date().getTime());
        }
      );
  }

  //Associate CRID
  register(e: any, ehrpatient: any) {
    e.preventDefault();
    e.stopPropagation();
    this.isLoading = true;

    //Mapping CRID Payload
    let gender;
    if (
      !ehrpatient.gender ||
      ehrpatient.gender === "unknown" ||
      ehrpatient.gender === "other"
    ) {
      const alertMsg =
        "Unable to register this patient " +
        ehrpatient.gender +
        " is not currently supported as a gender value. Please contact your center's CIBMTR CRC to review this case.";
      alert(alertMsg);
      this.globalErrorHandler.handleError(alertMsg);
      this.isLoading = false;
      return;
    } else {
      gender = ehrpatient.gender.toLowerCase();
    }

    const raceCodes = this.patientService.getRaceCodes(ehrpatient);
    const ethnicityCode = this.patientService.getEthnicityCode(ehrpatient);

    //CRID Payload
    let payload = {
      ccn: this.ccn.substring(3),
      patient: {
        firstName: ehrpatient.name[0].given[0],
        lastName: ehrpatient.name[0].family,
        birthDate: ehrpatient.birthDate,
        gender: gender === "male" ? "M" : "F",
        ssn: this.isValidSsn ? this.ssn : null,
        race: raceCodes,
        //raceDetails: raceDetailCodes,
        ethnicity: ethnicityCode,
      },
    };

    for (let [key, value] of Object.entries(payload.patient)) {
      if (!value) delete payload.patient[key];
    }

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

          const createEhrPatient = this.patientService.appendCridIdentifier(
            ehrpatient,
            this.crid,
            this.logicalId,
            this.ccn
          );

          //Lookup CRID in FHIR Server
          const cridSearchurl = encodeURI(
            "".concat(AppConfig.cibmtr_crid_namespace, "|", this.crid)
          );

          this.fhirService
            .lookupPatientIdentifier(
              cridSearchurl.concat(`&_security=${this.ccn}`)
            )
            .subscribe((cibmtrPatient): void => {
              this.cibmtrPatientCount = cibmtrPatient.total;
              if (this.cibmtrPatientCount > 0) {
                this.fhirService
                  .updatePatient(
                    this.patientService.mergedPatient(
                      ehrpatient,
                      cibmtrPatient.entry[0].resource
                    ),
                    cibmtrPatient.entry[0]?.resource?.id
                  )
                  .pipe(retry(1))
                  .subscribe(
                    () => {
                      this.isCibmtrCallSuccess = true;
                      console.log("Updated the patient");
                    },
                    (error) => {
                      this.handleError(error, new Date().getTime());
                    }
                  );
              } else {
                //Patient record not found create the entry
                this.fhirService
                  .submitPatient(createEhrPatient)
                  .pipe(retry(1))
                  .subscribe(
                    () => {
                      this.isCibmtrCallSuccess = true;
                      this.globalErrorHandler.handleError("Submitted patient");
                    },
                    (error) => {
                      this.handleError(error, new Date().getTime());
                    }
                  );
                if (result) {
                  this.globalErrorHandler.handleError(result);
                }
              }
            });
        },
        (error) => {
          this.handleError(error, new Date().getTime());
        }
      );
  }

  validate(ehrpatient, selectedOrg) {
    this.nonPIIIdentifiers = ehrpatient.identifier.filter(
      (i) => !AppConfig.ssn_system.includes(i.system)
    );

    this.ssnIdentifier = ehrpatient.identifier.filter((i) =>
      AppConfig.ssn_system.includes(i.system)
    );

    if (this.ssnIdentifier?.length > 0) {
      this.ssn = this.ssnIdentifier[0].value;
      if (this.ssnregex.validateSSN(this.ssn)) {
        this.isValidSsn = true;
      }
    }
    this.organizationService.validateSelectedOrg(selectedOrg);
  }

  proceed() {
    this.utility.data = {
      //Stringified JSON object for IE11 issue
      ehrpatient: JSON.stringify(this.ehrpatient),
      priorityLabs: JSON.stringify(this.priorityLabs),
      crid: this.crid,
      selectedOrg: this.selectedOrg,
    };
    this.router
      .navigate(["/patientdetail"])
      .then((e) => {
        this.globalErrorHandler.handleError("Navigated to Patient Detail page");
      })
      .catch((e) => {
        this.globalErrorHandler.handleError(e);
      });
  }

  handleError(error: HttpErrorResponse, timestamp: any) {
    this.isLoading = false;
    let errorMessage = `An unexpected failure has occurred. Please try again. If the error persists, please report this to CIBMTR. Status: ${
      error.status
    } \n Message : ${
      error.error.errorMessage || error.message
    }. \nTimestamp : ${timestamp} `;

    alert(errorMessage);
    this.globalErrorHandler.handleError(errorMessage);
    return throwError;
  }
}
