import { Injectable, Inject } from '@angular/core';
import {  HttpHeaders , HttpErrorResponse, HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from '../service/local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class AppReportsAllService {

  apiUrl: string;

  constructor(@Inject('API_URL') baseUrl: string,
  private http: HttpClient,
  private cookieService: CookieService,  private localStorageService: LocalStorageService) {
  this.apiUrl = baseUrl;
  // console.log(this.localStorageService.getUserToken());
  }

  // -------------------------- BANK BOOK REPORT API -------------------------------------

    allreportshow(body): Observable<any> {
      let endpoint = 'api/voucher/';
      return this.http.post<any>(this.apiUrl + endpoint, body, {
        headers: new HttpHeaders({
          //'Content-Type': 'multipart/form-data',
          'authorization': body.token ? body.token : ''
        
        }),
        responseType: 'text' as 'json'
      })
        .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }

  // -------------------------- STOCK REPORT API -------------------------------------

    stockgroupitemreport(body): Observable<any> {
      let endpoint = 'api/itemStock/getItemStockGroupReport';
      return this.http.post<any>(this.apiUrl + endpoint, body, {
        headers: new HttpHeaders({
          //'Content-Type': 'multipart/form-data',
          'authorization': body.token ? body.token : ''
        
        }),
        responseType: 'text' as 'json'
      })
        .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }

  // -------------------------- STOCK ITEM REPORT API -------------------------------------

    stockitemreport(body): Observable<any> {
        let endpoint = 'api/itemStock/getItemStockReport';
        return this.http.post<any>(this.apiUrl + endpoint, body, {
          headers: new HttpHeaders({
            //'Content-Type': 'multipart/form-data',
            'authorization': body.token ? body.token : ''
          
          }),
          responseType: 'text' as 'json'
        })
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }

  // ---------------- Trail BALACE REPORTS ---------------------------------------------------

    trailbalancereport(body): Observable<any> {
      let endpoint = 'api/report/trailbalance';
      return this.http.post<any>(this.apiUrl + endpoint, body, {
        headers: new HttpHeaders({
          //'Content-Type': 'multipart/form-data',
          'authorization': body.token ? body.token : ''
        
        }),
        responseType: 'text' as 'json'
      })
        .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }
  
  // ---------------- Trail BALACE REPORTS ---------------------------------------------------

    profitlossreport(body): Observable<any> {
      let endpoint = 'api/report/getprofitlosssheet';
      return this.http.post<any>(this.apiUrl + endpoint,  body, {
        headers: new HttpHeaders({
          //'Content-Type': 'multipart/form-data',
          'authorization': body.token ? body.token : ''
        
        }),
        responseType: 'text' as 'json'
      })
        .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }

  // ---------------- BALANCE SHEET REPORTS ---------------------------------------------------

    getbalancesheet(body): Observable<any> {
      let endpoint = 'api/report/getblancesheet';
      return this.http.post<any>(this.apiUrl + endpoint, body, {
        headers: new HttpHeaders({
          //'Content-Type': 'multipart/form-data',
          'authorization': body.token ? body.token : ''
        
        }),
        responseType: 'text' as 'json'
      })
        .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }
  // --------------------------------------END ALL API ----------------------------------------------

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
