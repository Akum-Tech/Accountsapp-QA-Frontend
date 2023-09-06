import { Injectable, Inject } from '@angular/core';
import {  HttpHeaders , HttpErrorResponse, HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from '../service/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LedgerService {

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

  ledger(body): Observable<any> {
    let endpoint = 'api/ledger';
    return this.http.post<any>(this.apiUrl + endpoint,body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }


  getledger(body): Observable<any> {
    let endpoint = 'api/ledger/all';
    let params: any = {'company_id': body.company_id};
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeaderwithParams(params))
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

    getledgercashbank(body): Observable<any> {
    let endpoint = 'api/ledger/alllegerwithoutbak';
    let params: any = {'company_id': body.company_id};
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeaderwithParams(params))
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  alllegerreportshow(body): Observable<any> {
    let endpoint = 'api/ledger/alllegerreport';
    let params: any = {'company_id': body.company_id};
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeaderwithParams(params))
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  getisbank(body): Observable<any> {
    let endpoint = 'api/ledger/getBankdefault/'+body.company_id;
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  
  getledgerfilter(body): Observable<any> {
    let endpoint = 'api/ledger/getSalePurchaseLedger/'+body.company_id;
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  getsalespurchaseVouchers(body): Observable<any> {
    let endpoint = 'api/ledger/getSalePurchaseVoucherLedger/'+body.company_id;
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  
  getjournalledgerdata(body): Observable<any> {
    let endpoint = 'api/ledger/getJournlVoucherLedger/'+body.company_id;
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  

  getstockinhandledger(body): Observable<any> {
    let endpoint = 'api/ledger/getStockVoucherLedger/'+body.company_id;
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  
  getbankledger(body): Observable<any> {
    let endpoint = 'api/ledger/getbankledger';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  
  getbankcashledger(body): Observable<any> {
    let endpoint = 'api/ledger/getbankcaseledger';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  getdiscountledgershow(body): Observable<any> {
    let endpoint = 'api/ledger/getdiscountledger';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  putledger(id,body): Observable<any> {
    let endpoint =  'api/ledger/'+id;
    return this.http.put<any>(this.apiUrl + endpoint,body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  
  getsingleledger(body): Observable<any> {
    let endpoint = 'api/ledger/'+body.Ledger_id;
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  
  deleteledger(body): Observable<any> {
    let endpoint = 'api/ledger/'+body.uid;
    return this.http.delete<any>(this.apiUrl + endpoint, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }


  getstate(): Observable<any> {
    let endpoint = 'api/states';
    return this.http.get<any>(this.apiUrl + endpoint+'/')
      .pipe(map(res => res), catchError(err => this.handleError(err)));
  }

  getcity(data): Observable<any> {
    let endpoint = 'api/cities/'+data;
    return this.http.get<any>(this.apiUrl + endpoint)
      .pipe(map(res => res), catchError(err => this.handleError(err)));
  }



gettaxes(): Observable<any> {
  let endpoint = 'api/taxes/';
  return this.http.get<any>(this.apiUrl + endpoint, this.getHeader())
    .pipe(map(res =>  JSON.parse(res)), catchError(err => this.handleError(err)));
}

getaccount(company_id): Observable<any> {
  let endpoint = 'api/accountGroup/all/'+company_id;
  return this.http.get<any>(this.apiUrl + endpoint, this.getHeader())
    .pipe(map(res =>  JSON.parse(res)), catchError(err => this.handleError(err)));
}

getaccountreport(company_id): Observable<any> {
  let endpoint = 'api/accountGroup/all/list/'+company_id;
  return this.http.get<any>(this.apiUrl + endpoint, this.getHeader())
    .pipe(map(res =>  JSON.parse(res)), catchError(err => this.handleError(err)));
}

getsubaccount(data): Observable<any> {
  let endpoint = 'api/subaccountGroup/'+data;
  return this.http.get<any>(this.apiUrl + endpoint, this.getHeader())
    .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
}

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