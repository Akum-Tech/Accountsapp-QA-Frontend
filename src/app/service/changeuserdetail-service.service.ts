import { Injectable,Inject } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChangeuserdetailServiceService {
  apiUrl:String;

  constructor(private http:HttpClient,@Inject('API_URL') baseUrl: string) {
    this.apiUrl = baseUrl;
   }
  requestOTP(userdetail){
    return this.http.post<any>('https://maa.colanapps.in/api/user/changeUserDetails',userdetail)
  }
}
