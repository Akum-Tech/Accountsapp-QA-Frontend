import { Injectable, Inject } from '@angular/core';
import {  HttpHeaders , HttpErrorResponse, HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from '../service/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  apiUrl: string;

  constructor(@Inject('API_URL') baseUrl: string,
    private http: HttpClient,
    private cookieService: CookieService,private localStorageService: LocalStorageService) {
    this.apiUrl = baseUrl;
  }
  
  getHeader(){
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'authToken': this.cookieService.get('currentAdmin')
      }),
      responseType: 'text' as 'json'
    };
  };

  getHeadertoken(){
    return {
      headers: new HttpHeaders({
        'authorization': this.localStorageService.getUserToken()
      }),
      responseType: 'text' as 'json'
    };
  };

  login(body): Observable<any> {
    let endpoint = 'api/user/login';
    return this.http.post<any>(this.apiUrl + endpoint,body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  Contectsend(body): Observable<any> {
    let endpoint = 'api/user/enquiry';
    return this.http.post<any>(this.apiUrl + endpoint,body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  forgetpassword(body): Observable<any> {
    let endpoint = 'api/forgetpassword/otp';
    return this.http.post<any>(this.apiUrl + endpoint,body,this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  EnterOtp(body): Observable<any> {
    let endpoint = 'api/forgetpassword/votp';
    return this.http.post<any>(this.apiUrl + endpoint,body,this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  ChangePass(body): Observable<any> {
    let endpoint = 'api/forgetpassword/'+body.user_id;
    return this.http.put<any>(this.apiUrl + endpoint,body,this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }


  // ----------------------------------- EMAIL & PHONE VERIFICATION -------------------------------------------
  subscriptioncheck(body): Observable<any> {
    let endpoint = 'api/user/checksubscription';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeadertoken())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  } 
  
  emailverify(body): Observable<any> {
    let endpoint = 'api/user/emailverify';
    return this.http.post<any>(this.apiUrl + endpoint,body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  phoneverify(body): Observable<any> {
    let endpoint = 'api/user/mobileverify';
    return this.http.post<any>(this.apiUrl + endpoint,body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  resendemailverify(body): Observable<any> {
    let endpoint = 'api/user/resendotpemail ';
    return this.http.post<any>(this.apiUrl + endpoint,body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  resendphoneverify(body): Observable<any> {
    let endpoint = 'api/user/resendotpmobile';
    return this.http.post<any>(this.apiUrl + endpoint,body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  // ----------------------------------- END EMAIL & PHONE VERIFICATION -------------------------------------------
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