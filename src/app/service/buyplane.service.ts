import { Injectable, Inject } from '@angular/core';
import {  HttpHeaders , HttpErrorResponse, HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from '../service/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class BuyplaneService {
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


  getsubscriptionplancheck(): Observable<any> {
    let endpoint = 'api/subscription/check/subscription';
    return this.http.get<any>(this.apiUrl + endpoint,this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  getbuyData(): Observable<any> {
    let endpoint = 'api/subscription/active';
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  order(body): Observable<any> {
    let endpoint = 'api/subscription/order';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }  

  verifyOrder(body): Observable<any> {
    let endpoint = 'api/subscription/verifyOrder';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }    

  getsingleuserinfo(body): Observable<any> {
    let endpoint = 'api/user/'+body.uid;
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  
  // ---------------- VIEW PLAN ------------------------------------
 
  viewbuyplandata(body): Observable<any> {
    let endpoint = 'api/subscription/OrderListByUser';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

   // ---------------- VIEW PLAN ------------------------------------
 
   downloadinvoice(body): Observable<any> {
    let endpoint = 'api/subscription/invoice/download';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  
//-------------------Get SINGLE USER for buy plan --------------------------------

  getsingleuserdata(body): Observable<any> {
    let endpoint = 'api/user/getuser/1234';
    return this.http.get<any>(this.apiUrl + endpoint, {
      headers: new HttpHeaders({
        //'Content-Type': 'multipart/form-data',
        'authorization': body.maatoken ? body.maatoken : ''
      }),
      responseType: 'text' as 'json'
    })
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  getbuyplanData(): Observable<any> {
    let endpoint = 'api/subscription/active';
    return this.http.get<any>(this.apiUrl + endpoint, this.getplanHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  resendopt(body): Observable<any> {
    let endpoint = 'api/user/buyplanotp';
    return this.http.post<any>(this.apiUrl + endpoint,body, this.getplanHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  verifyotp(body): Observable<any> {
    let endpoint = 'api/user/verifybuyplanotp';
    return this.http.post<any>(this.apiUrl + endpoint,body, this.getplanHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  orderplan(body): Observable<any> {
    let endpoint = 'api/subscription/order';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getplanHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  } 
  verifyOrderplan(body): Observable<any> {
    let endpoint = 'api/subscription/verifyOrder';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getplanHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  // _________________________________________________________________________________________________________

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
