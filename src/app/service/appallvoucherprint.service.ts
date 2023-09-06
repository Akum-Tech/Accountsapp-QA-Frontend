import { Injectable, Inject } from '@angular/core';
import {  HttpHeaders , HttpErrorResponse, HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from '../service/local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class AppallvoucherprintService {

  apiUrl: string;

  constructor(@Inject('API_URL') baseUrl: string,
  private http: HttpClient,
  private cookieService: CookieService,  private localStorageService: LocalStorageService) {
  this.apiUrl = baseUrl;
  // console.log(this.localStorageService.getUserToken());
  }

  //header('Access-Control-Allow-Origin: *');
  
  getHeader(){
    return {
      headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin':'*',
        //'Content-Type': 'multipart/form-data',
        'authorization': this.localStorageService.getUserToken() ? this.localStorageService.getUserToken() : ''
      }),
      responseType: 'text' as 'json'
    };
  };

  getplanHeader(){
    return {
      headers: new HttpHeaders({
        //'Content-Type': 'multipart/form-data',
        'authorization': this.localStorageService.getPlanToken() ? this.localStorageService.getPlanToken() : ''
        
      }),
      responseType: 'text' as 'json'
    };
  };

 
  // --------------------------- GET SINGLE USER DETAIL ----------------------------------------------

    getsingleuserdataapp(body): Observable<any> {
        let endpoint = 'api/user/getuser/1234';
        return this.http.get<any>(this.apiUrl + endpoint, {
          headers: new HttpHeaders({
            //'Content-Type': 'multipart/form-data',
            'authorization': body.token ? body.token : ''
          }),
          responseType: 'text' as 'json'
        })
          .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }
    
  // --------------------------- SLE VOUCHE APPP ----------------------------------------------

    getSalesVoucher(body): Observable<any> {
      let endpoint = 'api/saleVoucher/'+body.voucher_id;
      return this.http.get<any>(this.apiUrl + endpoint, {
        headers: new HttpHeaders({
          //'Content-Type': 'multipart/form-data',
          'authorization': body.token ? body.token : ''
        }),
        responseType: 'text' as 'json'
      })
        .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }

    NextVoucherGet(body): Observable<any> {
      let endpoint = 'api/nextPrevious/next';
      return this.http.post<any>(this.apiUrl + endpoint, body, {
        headers: new HttpHeaders({
          //'Content-Type': 'multipart/form-data',
          'authorization': body.token ? body.token : ''
        }),
        responseType: 'text' as 'json'
      })
        .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }
  
    PreviousVoucherGet(body): Observable<any> {
      let endpoint = 'api/nextPrevious/previous';
      return this.http.post<any>(this.apiUrl + endpoint, body, {
        headers: new HttpHeaders({
          //'Content-Type': 'multipart/form-data',
          'authorization': body.token ? body.token : ''
        
        }),
        responseType: 'text' as 'json'
      })
        .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }
  
  // -------------------------- PURCHASE VOUCHER -------------------------------------

    getpurchasevoucher(body): Observable<any> {
      let endpoint = 'api/purchaseVoucher/'+body.voucher_id;
      return this.http.get<any>(this.apiUrl + endpoint, {
        headers: new HttpHeaders({
          //'Content-Type': 'multipart/form-data',
          'authorization': body.token ? body.token : ''
        }),
        responseType: 'text' as 'json'
      })
        .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }
  
  
  // -------------------------- DEBITNOTE VOUCHER -------------------------------------

    getDebitnoteVoucher(body): Observable<any> {
      let endpoint = 'api/debitVoucher/'+body.voucher_id;
      return this.http.get<any>(this.apiUrl + endpoint, {
        headers: new HttpHeaders({
          //'Content-Type': 'multipart/form-data',
          'authorization': body.token ? body.token : ''
        }),
        responseType: 'text' as 'json'
      })
        .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }
  
  // -------------------------- CREDITNOTE VOUCHER -------------------------------------

    getCrediteNoteVoucher(body): Observable<any> {
      let endpoint = 'api/creditVoucher/'+body.voucher_id;
      return this.http.get<any>(this.apiUrl + endpoint, {
        headers: new HttpHeaders({
          //'Content-Type': 'multipart/form-data',
          'authorization': body.token ? body.token : ''
        }),
        responseType: 'text' as 'json'
      })
        .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }

  // -------------------------- PAYMENT VOUCHER -------------------------------------

    GetpaymentVoucher(body): Observable<any> {
      let endpoint = 'api/paymentVoucher/'+body.voucher_id;
      return this.http.get<any>(this.apiUrl + endpoint, {
        headers: new HttpHeaders({
          //'Content-Type': 'multipart/form-data',
          'authorization': body.token ? body.token : ''
        }),
        responseType: 'text' as 'json'
      })
        .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }

  // -------------------------- RECEIPT VOUCHER -------------------------------------

    getReceiptVoucher(body): Observable<any> {
      let endpoint = 'api/recieptVoucher/'+body.voucher_id;
      return this.http.get<any>(this.apiUrl + endpoint, {
        headers: new HttpHeaders({
          //'Content-Type': 'multipart/form-data',
          'authorization': body.token ? body.token : ''
        }),
        responseType: 'text' as 'json'
      })
        .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }

  // -------------------------- STOCK IN HAND VOUCHER -------------------------------------

    getstockinhand(body): Observable<any> {
      let endpoint = 'api/stockvoucher/'+body.voucher_id;
      return this.http.get<any>(this.apiUrl + endpoint, {
        headers: new HttpHeaders({
          //'Content-Type': 'multipart/form-data',
          'authorization': body.token ? body.token : ''
        }),
        responseType: 'text' as 'json'
      })
        .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }

  // -------------------------- JOURNAL VOUCHER -------------------------------------

    getJournalVoucher(body): Observable<any> {
      let endpoint = 'api/journalVoucher/'+body.voucher_id;
      return this.http.get<any>(this.apiUrl + endpoint, {
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
