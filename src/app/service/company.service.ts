import { Injectable, Inject } from '@angular/core';
import {  HttpHeaders , HttpErrorResponse, HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from '../service/local-storage.service';
@Injectable({
  providedIn: 'root'
})

export class CompanyService {

  apiUrl: string;

  constructor(@Inject('API_URL') baseUrl: string,
  private http: HttpClient,
  private cookieService: CookieService,  private localStorageService: LocalStorageService) {
  this.apiUrl = baseUrl;
  }
  
  getHeader(){
    return {
      headers: new HttpHeaders({
        //'Content-Type': 'multipart/form-data',
        'authorization': this.localStorageService.getUserToken()
      }),
      responseType: 'text' as 'json'
    };
  };

  company(body): Observable<any> {
    let endpoint = 'api/company';
    return this.http.post<any>(this.apiUrl + endpoint,body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  getcompany(body): Observable<any> {
    let endpoint = 'api/company/';
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  putcompany(body): Observable<any> {
    let endpoint = 'api/company/'+body.id;
    return this.http.put<any>(this.apiUrl + endpoint,body.form_data, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  putchangeperiod(uid,body): Observable<any> {
    let endpoint =  'api/company/'+uid+'/changePeriod';
    return this.http.put<any>(this.apiUrl + endpoint,body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  ChangemanualStock(uid,body): Observable<any> {
    let endpoint =  'api/company/'+uid+'/changemanualstock';
    return this.http.put<any>(this.apiUrl + endpoint,body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  deletecompany(body): Observable<any> {
    let endpoint = 'api/company/'+body.uid;
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
    return this.http.get<any>(this.apiUrl + endpoint+'/')
      .pipe(map(res => res), catchError(err => this.handleError(err)));
  }

  getAllCity():Observable<any>{
    let endpoint = 'api/cities/';
    return this.http.get<any>(this.apiUrl + endpoint)
      .pipe(map(res => res), catchError(err => this.handleError(err)));
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

