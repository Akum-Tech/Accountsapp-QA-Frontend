import { Injectable, Inject } from '@angular/core';
import {  HttpHeaders , HttpErrorResponse, HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from '../service/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AdminServicesService {


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

  // ---------------- USER DETAIL -----------------------------------------

  getuser(): Observable<any> {
    let endpoint = 'api/user/';
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeadertoken())
      .pipe(map(res =>  JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  getsingleuser(body): Observable<any> {
    let endpoint = 'api/user/'+body.uid;
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeadertoken())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  putuserplan(id,body): Observable<any> {
    let endpoint = 'api/user/subscription/'+id;
    return this.http.put<any>(this.apiUrl + endpoint,body,this.getHeadertoken())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
   
  viewbuyplandata(body): Observable<any> {
    let endpoint = 'api/subscription/OrderListByUser';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeadertoken())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  downloadinvoice(body): Observable<any> {
    let endpoint = 'api/subscription/invoice/download';
    return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeadertoken())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  
  Invoicelist(): Observable<any> {
    let endpoint = 'api/subscription/subscribed/list';
    return this.http.post<any>(this.apiUrl + endpoint, this.getHeadertoken())
      .pipe(map(res => res), catchError(err => this.handleError(err)));
  }

  // Grouppostreport(body): Observable<any> {
  //   let endpoint = 'api/voucher/';
  //   return this.http.post<any>(this.apiUrl + endpoint, body, this.getHeader())
  //     .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  // }
  
  // ---------------- UNIT LIST -----------------------------------------
  getunits(): Observable<any> {
    let endpoint = 'api/units/';
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeadertoken())
      .pipe(map(res =>  JSON.parse(res)), catchError(err => this.handleError(err)));
  }

 // ---------------- ACCOUNT LIST -----------------------------------------
  getaccount(): Observable<any> {
    let endpoint = 'api/accountGroup/';
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeadertoken())
      .pipe(map(res =>  JSON.parse(res)), catchError(err => this.handleError(err)));
  }
 
  // ---------------- TAX LIST -----------------------------------------
  addtax(body): Observable<any> {
    let endpoint =  'api/taxes/';
    return this.http.post<any>(this.apiUrl + endpoint,body, this.getHeadertoken())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  gettaxes(): Observable<any> {
    let endpoint = 'api/taxes/';
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeadertoken())
      .pipe(map(res =>  JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  putaddtax(body): Observable<any> {
    let endpoint = 'api/taxes/'+body.id;
    return this.http.put<any>(this.apiUrl + endpoint,body, this.getHeadertoken())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  deletetax(body): Observable<any> {
    let endpoint =  'api/taxes/'+body;
    return this.http.delete<any>(this.apiUrl + endpoint, this.getHeadertoken())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  // ---------------- SUBSCRIPTION PLAN LIST -----------------------------------------

    addsubscriptionplan(body): Observable<any> {
      let endpoint =  'api/subscription';
      return this.http.post<any>(this.apiUrl + endpoint,body, this.getHeadertoken())
        .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }
    
    getbuyData(): Observable<any> {
      let endpoint = 'api/subscription';
      return this.http.get<any>(this.apiUrl + endpoint, this.getHeader())
        .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }

    editplan(body): Observable<any> {
      let endpoint = 'api/subscription/'+body.id;
      return this.http.put<any>(this.apiUrl + endpoint,body, this.getHeadertoken())
        .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }

    deleteplan(body): Observable<any> {
      let endpoint =  'api/subscription/'+body;
      return this.http.delete<any>(this.apiUrl + endpoint, this.getHeadertoken())
        .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
    }

  // ----------------------------------- END EMAIL & PHONE VERIFICATION -------------------------------------------
  // ----------------------------------- STATE CODE CHANGE API -------------------------------------------

  getstate(): Observable<any> {
    let endpoint = 'api/states';
    return this.http.get<any>(this.apiUrl + endpoint+'/')
      .pipe(map(res => res), catchError(err => this.handleError(err)));
  }

  addstate(body): Observable<any> {
    let endpoint =  'api/states';
    return this.http.post<any>(this.apiUrl + endpoint,body)
      .pipe(map(res => res), catchError(err => this.handleError(err)));
  }

  // ----------------------------------- FREE TRAIL API -------------------------------------------

  getfreetrail(): Observable<any> {
    let endpoint = 'api/subscriptiontrail/';
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeadertoken())
      .pipe(map(res =>  JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  
  editfreetrail(body): Observable<any> {
    let endpoint = 'api/subscriptiontrail/'+body.id;
    return this.http.put<any>(this.apiUrl + endpoint,body, this.getHeadertoken())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }

  // ----------------------------------- ORGANIZATION INFO API -------------------------------------------

  getinfodetail(): Observable<any> {
    let endpoint = 'api/organizationinfo/';
    return this.http.get<any>(this.apiUrl + endpoint, this.getHeadertoken())
      .pipe(map(res =>  JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  addinfodetail(body): Observable<any> {
    let endpoint = 'api/organizationinfo';
    return this.http.post<any>(this.apiUrl + endpoint,body, this.getHeadertoken())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  putinfodetail(body): Observable<any> {
    let endpoint = 'api/organizationinfo/'+body.id;
    return this.http.put<any>(this.apiUrl + endpoint,body.form_data, this.getHeadertoken())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  
  // deleteplaninfo(body): Observable<any> {
  //   let endpoint =  'api/organizationinfo/'+body;
  //   return this.http.delete<any>(this.apiUrl + endpoint, this.getHeadertoken())
  //     .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  // }
  // ----------------------------------- STATE CODE CHANGE API -------------------------------------------

  getautoledgerlist(body): Observable<any> {
    let endpoint = 'api/ledger/getautoledgerlist';
    return this.http.post<any>(this.apiUrl + endpoint,body, this.getHeadertoken())
      .pipe(map(res => JSON.parse(res)), catchError(err => this.handleError(err)));
  }
  // ----------------------------------- END STATE CODE CHANGE API  -------------------------------------------
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
