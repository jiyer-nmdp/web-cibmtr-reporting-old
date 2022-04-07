import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "./app.config";
import { throwError } from "rxjs";
import { GlobalErrorHandler } from "./global-error-handler";
import { LocalStorageService } from "angular-2-local-storage";

@Injectable({
  providedIn: "root",
})
export class OrganizationService {
  constructor(
    private http: HttpClient,
    private globalErrorHandler: GlobalErrorHandler,
    private localStorageService: LocalStorageService
  ) {}

  async fetchCenters(scopes): Promise<any[]> {
    const orgUrl = AppConfig.cibmtr_fhir_url + "Organization?_security=";

    const cibmtrCenters = [];
    if (scopes !== "") {
      await this.http
        .get(`${orgUrl}${scopes}`)
        .toPromise()
        .then((response: any) => {
          let orgEntries = response.entry;
          orgEntries.forEach((orgEntry) => {
            const value = "rc_" + orgEntry.resource.identifier[0].value;
            const name = orgEntry.resource.name;
            const telecom = orgEntry.resource.telecom;

            let telecomUrlItems = [];
            if (telecom) {
              telecomUrlItems = telecom.filter((item) => item.system === "url");
            }

            cibmtrCenters.push({
              value,
              name,
              selected: false,
              telecomUrlItems,
            });
          });
          this.globalErrorHandler.handleError(
            "Successfully retrieved cibmtrcenter"
          );
        })
        .catch((error) => {
          this.handleError(error, new Date().getTime());
        });
      return cibmtrCenters;
    }
    alert(
      "your User ID has not been provisioned correctly. \n Please contact the Service Desk at (763) 406-3411 or (800) 526-7809 x3411"
    );
  }

  validateSelectedOrg(selectedOrg) {
    if (selectedOrg.telecomUrlItems?.length > 0) {
      const recentOrgItem = selectedOrg.telecomUrlItems.filter(
        (item) => item.rank === 1
      );

      if (recentOrgItem[0]?.value !== this.localStorageService.get("iss")) {
        const invalid_issuer =
          "Please validate the updtaed Issuer URL with CIBMTR";
        alert(invalid_issuer);
        return throwError(invalid_issuer);
      }
    }
  }

  handleError(error: HttpErrorResponse, timestamp: any) {
    let errorMessage = `An unexpected failure has occurred. Please try again. If the error persists, please report this to CIBMTR. Status: ${
      error.status
    } \n Message : ${
      error.error.errorMessage || error.message
    }. \nTimestamp : ${timestamp} `;

    alert(errorMessage);
    console.log(errorMessage);
    this.globalErrorHandler.handleError(errorMessage);
    return throwError(error);
  }
}
