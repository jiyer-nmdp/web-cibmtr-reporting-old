import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, of, forkJoin } from "rxjs";
import { AppConfig } from "../shared/constants/app.config";
import { IPatientContext, Patient } from "../model/patient.";
import { LocalStorageService } from "angular-2-local-storage";
import { UtilityService } from "../shared/service/utility.service";
import { catchError, tap, map } from "rxjs/operators";
import { GlobalErrorHandler } from "../global-error-handler";

@Injectable()
export class PatientService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private utilityService: UtilityService,
    private globalErrorHandler: GlobalErrorHandler
  ) {}

  getPatient(identifier): Observable<IPatientContext> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(
        this.localStorageService.get("iss")
      ) +
      "/Patient/" +
      identifier;
    return this.http
      .get<IPatientContext>(url, {
        headers: this.buildEhrHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getObservationPriorityLabs(identifier): Observable<IPatientContext> {
    const requestUrls: any[] = [];
    const splitLoincCodesArray = this.utilityService.chunk(
      AppConfig.loinc_codes.toString().split(","),
      150
    );
    splitLoincCodesArray.forEach((loincs) => {
      const loinc_codes = loincs.join(",");
      const url =
        this.utilityService.rebuild_DSTU2_STU3_Url(
          this.localStorageService.get("iss")
        ) +
        "/Observation?patient=" +
        identifier +
        "&_count=1000&code=" +
        loinc_codes;
      requestUrls.push(
        this.utilityService.getPage(url, this.buildEhrHeaders())
      );
    });
    return forkJoin(requestUrls).pipe(
      map((res: []) => {
        const bundles: any[] = [];
        res.forEach((r1: any) => {
          if (r1 instanceof Array) {
            r1.forEach((r) => bundles.push(r));
          }
        });
        return bundles;
      }),
      tap((success) => {
        this.globalErrorHandler.handleError(
          "Retrived priority labs successfully."
        );
        this.globalErrorHandler.handleError(success);
      }),
      catchError((error) => {
        this.globalErrorHandler.handleError(error);
        return of(null);
      })
    );
  }

  getObservationLabs(identifier): Observable<any> {
    let url =
      this.utilityService.rebuild_DSTU2_STU3_Url(
        this.localStorageService.get("iss")
      ) +
      "/Observation?category=laboratory&_count=1000&patient=" +
      identifier;
    return this.utilityService.getPage(url, this.buildEhrHeaders()).pipe(
      tap((success) => {
        this.globalErrorHandler.handleError("Retrived all labs successfully.");
        this.globalErrorHandler.handleError(success);
      }),
      catchError((error) => {
        this.globalErrorHandler.handleError(error);
        return of(null);
      })
    );
  }

  buildEhrHeaders() {
    let ehrHeaders: HttpHeaders = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set(
        "Authorization",
        `Bearer ${this.localStorageService.get("accessToken")}`
      );

    return ehrHeaders;
  }

  // Update the existing ehr patient with the CRID value in FHIR Server.

  appendCridIdentifier(
    ehrpatient: Patient,
    crid: string,
    logicalId: string,
    psScope: string
  ) {
    const {
      id,
      identifier,
      text: { status } = { status: "generated" },
      ...remainingfields
    } = ehrpatient;

    let createEhrPatient = {
      ...remainingfields,
      text: {
        status: status,
      },
      meta: {
        security: [
          {
            system: AppConfig.cibmtr_centers_namespace,
            code: psScope,
          },
        ],
      },
      identifier: [
        identifier,
        {
          use: "official",
          system: AppConfig.epic_logicalId_namespace,
          value:
            this.utilityService.rebuild_DSTU2_STU3_Url(
              this.localStorageService.get("iss")
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
    return createEhrPatient;
  }

  //Update Patient Record
  mergedPatient(ehrpatient: Patient, cibmtrPatient: any) {
    const {
      identifier,
      text: { status } = { status: "generated" },
      meta,
    } = cibmtrPatient;

    let updatedPatient = {
      ...ehrpatient,
      text: {
        status: status,
      },
      meta: {
        ...meta,
      },
      identifier: [
        ...identifier,
        {
          use: "official",
          system: AppConfig.epic_logicalId_namespace,
          value:
            this.utilityService.rebuild_DSTU2_STU3_Url(
              this.localStorageService.get("iss")
            ) +
            "/Patient/" +
            ehrpatient.id,
        },
      ],
    };
    return updatedPatient;
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

  getRaceCodes(ehrpatient) {
    return (
      ehrpatient.extension &&
      ehrpatient.extension
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
        .map((i) => i.valueCoding && i.valueCoding.code)
    ); // extract the codes
  }

  getEthnicityCode(ehrpatient) {
    return (
      ehrpatient.extension &&
      ehrpatient.extension
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
        .join()
    );
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = `Unable to process request for \nURL : ${error.url}.  \nStatus: ${error.status}. \nStatusText: ${error.statusText}`;
    alert(errorMessage);
    this.globalErrorHandler.handleError(errorMessage);
    return throwError(errorMessage);
  }
}
