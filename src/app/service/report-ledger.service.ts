import { Injectable, Inject } from '@angular/core';
import {  HttpHeaders , HttpErrorResponse, HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from '../service/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ReportLedgerService {

  apiUrl: string;

  constructor(@Inject('API_URL') baseUrl: string,
  private http: HttpClient,
  private cookieService: CookieService ,
  private localStorageService: LocalStorageService) {
  this.apiUrl = baseUrl;
  // console.log(this.localStorageService.getUserToken());
  }


  getHeaderwithParams(params){
    // return {
       if(params){
         return {
         headers: new HttpHeaders({
           //'Content-Type': 'multipart/form-data',
           'authorization': this.localStorageService.getUserToken()
         }),
         responseType: 'text' as 'json',
         params:params
       };
       }else{
         return {
         headers: new HttpHeaders({
           //'Content-Type': 'multipart/form-data',
           'authorization': this.localStorageService.getUserToken()
         }),
         responseType: 'text' as 'json'
       };
     }
    // };
   };


  getHeader(){
    return {
      headers: new HttpHeaders({
        //'Content-Type': 'multipart/form-data',
        'authorization': this.localStorageService.getUserToken()
      }),
      responseType: 'text' as 'json'
    };
  };

// ---------------- ACCOUNT BOOK REPORTS ---------------------------------------------------
  
  ledgerpostreport(body): Observable<any> {
    let endpoint = 'api/voucher/';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  Grouppostreport(body): Observable<any> {
    let endpoint = 'api/voucher/';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  salesregisterReport(body): Observable<any> {
    let endpoint = 'api/voucher/';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  jornalregisterReport(body): Observable<any> {
    let endpoint = 'api/voucher/';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  daybookregisterReport(body): Observable<any> {
    let endpoint = 'api/voucher/';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  purchaseregisterReport(body): Observable<any> {
    let endpoint = 'api/voucher/';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  getbankledger(body): Observable<any> {
    let endpoint = 'api/ledger/getbankledger';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  getcashledger(body): Observable<any> {
    let endpoint = 'api/ledger/getcashledger';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

// ---------------- STOCK REPORTS ---------------------------------------------------

  stockitemreport(body): Observable<any> {
    let endpoint = 'api/itemStock/getItemStockReport';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  stockgroupitemreport(body): Observable<any> {
    let endpoint = 'api/itemStock/getItemStockGroupReport';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

// ---------------- FINAL REPORTS ---------------------------------------------------

  profitlossreport(body): Observable<any> {
    let endpoint = 'api/report/getprofitlosssheet';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  getbalancesheet(body): Observable<any> {
    let endpoint = 'api/report/getblancesheet';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  // ---------------- GSTR REPORTS ---------------------------------------------------

  gstronereports(body): Observable<any> {
    let endpoint = 'api/gstreport/r1';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  gstronereportssummary(body): Observable<any> {
    let endpoint = 'api/gstreport/r1/summary';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  gstronereportssummarytwo(body): Observable<any> {
    let endpoint = 'api/gstreport/r2/summary';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  gstronereportsummarythreeB(body): Observable<any> {
    let endpoint = 'api/gstreport/r3b';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  // ---------------- Trail BALACE REPORTS ---------------------------------------------------

  trailbalancereport(body): Observable<any> {
    let endpoint = 'api/report/trailbalance';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
// -----------------------------------------------------------------------------------------

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
     // this.notificationService.setError(error.error.message, false);
    } else {
      if (error.status === 400) {
        if (error.error.validationErrors) {
          error.error.validationErrors.forEach((val, index) => {
            //this.notificationService.setError(val.message);
          });
        } else {
        //  this.notificationService.setError(error.error.message, false);
        }
      } else if (error.status === 500) {
        //this.notificationService.setError('Something bad happed. Please try again.');
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.log(error);
        if (error.error) {
          //this.notificationService.setError('Something bad happed. Please try again.', false);
        } else {
          //this.notificationService.setError(error.error.error_description, false);
        }
      }
    }
    return throwError('Something bad happed. Please try again.');
  }

}
