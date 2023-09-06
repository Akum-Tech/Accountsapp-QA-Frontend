import { Injectable, Inject } from '@angular/core';
import {  HttpHeaders , HttpErrorResponse, HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from '../service/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AccountGroupService {

 
  apiUrl: string;

  constructor(@Inject('API_URL') baseUrl: string,
  private http: HttpClient,
  private cookieService: CookieService, private localStorageService: LocalStorageService) {
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


  accountgroup(body): Observable<any> {
    let endpoint = 'api/subAccountGroup';
    return this.http.post<any>(this.apiUrl + endpoint,body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  getaccountgroup(cid): Observable<any> {
    let endpoint = 'api/subAccountGroup/all';
    let params: any = {'company_id': cid};
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeaderwithParams(params))
      .pipe(map(res =>  JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  
  putaccountGroup(id,body): Observable<any> {
    let endpoint = 'api/subAccountGroup/'+id;
    return this.http.put<any>(this.apiUrl + endpoint,body, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  deleteaccountgroup(body): Observable<any> {
    let endpoint = 'api/subAccountGroup/'+body.uid;
    return this.http.delete<any>(this.apiUrl + endpoint, this.getHeader())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  getaccount(): Observable<any> {
    let endpoint = 'api/accountGroup/';
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeader())
      .pipe(map(res =>  JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  
private handleError(error: HttpErrorResponse) {
  if (error.error instanceof Error) {
    // A client-side or network error occurred. Handle it accordingly.
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
