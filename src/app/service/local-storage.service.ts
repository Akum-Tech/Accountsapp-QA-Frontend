import {  Injectable, Inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {UserinfoModule} from './../model/userinfo/userinfo.module'

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
apiUrl: string;
  constructor(@Inject('API_URL') baseUrl: string) {
    this.apiUrl=baseUrl;
   }


  getBaseUrl(){
    return this.apiUrl;
  }

  saveUserDetail(obj){
    localStorage.setItem("userinfo",JSON.stringify(obj));
  }

  // ______________ TOEKN PLAN DETAIL SAVE _______________________________________
  saveplanDetailtoken(obj){
    localStorage.setItem("userinfo",JSON.stringify(obj));
  }

  saveuserplanDetail(obj){
    localStorage.setItem("userdata",JSON.stringify(obj));
  }

  getPlanToken() {
    let data:UserinfoModule=JSON.parse(localStorage.getItem("userinfo"));
    let val;
    if(data){
      val =data;
    }
    return val;
  }
  getuserdata() {
    let data:UserinfoModule=JSON.parse(localStorage.getItem("userdata"));
    let val;
    if(data){
      val=data;
    }
    return val;
  }
  getuserplanID() {
    let data:UserinfoModule=JSON.parse(localStorage.getItem("userdata"));
    let val:String;
    if(data){
      val =data.uid;
    }
    return val;
  }
  // ________________________________________ END ______________________________________

  isUserLogin() {
    let data:UserinfoModule=JSON.parse(localStorage.getItem("userinfo"));
    let val;
    if(data){
      val =data.islogin;
    }
    return val;
  }

  getuserinfo() {
    let data:UserinfoModule=JSON.parse(localStorage.getItem("userinfo"));
    let val;
    if(data){
      val=data;
    }
    return val;
  }
  

  getUserToken() {
    let data:UserinfoModule=JSON.parse(localStorage.getItem("userinfo"));
    let val;
    if(data){
      val =data.token;
    }
    return val;
  }

  saveCompanyinfo(obj){
    localStorage.setItem("CompanyInfo",JSON.stringify(obj));
  }
  // saveJournalinfo(uid){
  //   localStorage.setItem("Journaluid",uid)
  // }
  saveJournalLedgerData(data){
    localStorage.setItem("journalinfo",JSON.stringify(data))
  }
  getJournalVoucherdata(){
    let data=JSON.parse(localStorage.getItem("journalinfo"));
    return data;
  }
  removeJournaldata(){
    localStorage.removeItem("journalinfo")
  }
  getCompanyId() {
    let data:UserinfoModule=JSON.parse(localStorage.getItem("CompanyInfo"));
    let val:String;
    if(data){
      val =data.uid;
    }
    return val;
  }

  getCompanyFinancialYear() {
    let data:UserinfoModule=JSON.parse(localStorage.getItem("CompanyInfo"));
    let val:String;
    if(data){
      val = data.financial_year;
    }
    return val;
  }
  

  getuserToken() {
    let data:UserinfoModule=JSON.parse(localStorage.getItem("userinfo"));   
  let val:String;
    if(data){
      val =data.token;
    }
    return val;
  }

  getuserId() {
    let data:UserinfoModule=JSON.parse(localStorage.getItem("userinfo"));
    let val:String;
    if(data){
      val =data.uid;
    }
    return val;
  }

  getuserUId() {
    let data:UserinfoModule=JSON.parse(localStorage.getItem("userinfo"));
    let val:String;
    if(data){
      val =data.uid;
    }
    return val;
  }

  getCompanyInfo() {
    let data:UserinfoModule=JSON.parse(localStorage.getItem("CompanyInfo"));
    let val;
    if(data){
      val=data;
    }
    return val;
  }

  getCompanyTermsInfo() {
    let data:UserinfoModule=JSON.parse(localStorage.getItem("CompanyInfo"));
    let val;
    if(data){
      val=data.terms;
    }
    return val;
  }


}
