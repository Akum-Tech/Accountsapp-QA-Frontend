import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { ChangeuserdetailServiceService } from 'src/app/service/changeuserdetail-service.service';
import {LoginService} from '../../../app/service/login.service'
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';

@Component({
  selector: 'app-change-user-details',
  templateUrl: './changeuserdetails.component.html',
  styleUrls: ['./changeuserdetails.component.css']
})
export class ChangeUserDetails {
  isEmailSectionVisible = false;
  isMobileSectionVisible = false;
  isEmailExtraSectionVisible=false;
  isPhoneExtraSectionVisible=false;
  isEmailOTPVisible = false;
  isPhoneOTPVisible = false;
  isEmailOTPSendVisible=false;
  isPhoneOTPSendVisible=false;
  public emailOtp : any;
  public mobileOtp : any;
  public activeuser:any;

  public changeemail : any = {    "changeEmail": "Y","email": "","userid":""}
  public changenumber : any = {  "changeMobile": "Y","mobile": "","userid":""}

  constructor(private router: Router,
    private localStorageService: LocalStorageService,
    private ChangeuserdetailServiceService:ChangeuserdetailServiceService,
    public loginService:LoginService,
    private messagePanelService: MessagePanelService,
    public globals: Globals,
    ) {}

  ngOnInit() {
    this.activeuser = this.localStorageService.getuserinfo();
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

  showEmailSection() {
    this.isEmailSectionVisible = true;
    this.isMobileSectionVisible = false;
    this.isPhoneExtraSectionVisible=true;
    this.isEmailOTPVisible = false;
    this.isEmailOTPSendVisible=false;
    
  }

  showMobileSection() {
    this.isEmailSectionVisible = false;
    this.isMobileSectionVisible = true;
    this.isEmailExtraSectionVisible=true;
    this.isPhoneOTPVisible = false;
    this.isPhoneOTPSendVisible=false;

  }

  showEmailOTPSection() {
    this.isEmailSectionVisible = true;
    this.isMobileSectionVisible = false;
    this.isEmailOTPVisible = true;
    this.isEmailOTPSendVisible=true;
    this.isPhoneOTPSendVisible=false;
console.log("activeuser",this.activeuser);
if(this.activeuser)
{
  this.changeemail["changeEmail"] = "Y";
  this.changeemail["userid"] = this.activeuser.uid
}
console.log("changeemail",this.changeemail)
this.ChangeuserdetailServiceService.requestOTP(this.changeemail).subscribe((data:any) => {
  console.log("api data",data);
}) 

  }
  showPhoneOTPSection() {
    this.isEmailSectionVisible = false;
    this.isMobileSectionVisible = true;
    this.isPhoneOTPVisible = true;
    this.isPhoneOTPSendVisible=true;
    this.isEmailOTPSendVisible=false;
    if(this.activeuser)
{
  this.changenumber["changeMobile"] = "Y";
  this.changenumber["userid"] = this.activeuser.uid
}
console.log("changenumber",this.changenumber)
this.ChangeuserdetailServiceService.requestOTP(this.changenumber).subscribe((data:any) => {
  console.log("data",data);
}) 

  }
  emailverify(data:any){
    let obj;
    if(data == 'email')
    {
      console.log("emailOtp",this.emailOtp);
      obj ={
        "email" : this.changeemail.email,
          "otp" : this.emailOtp
      }
      this.loginService.emailverify(obj).subscribe((data:any) =>{
        if(data.success == true)
        {
          this.messagePanelService.ShowPopupMessageWithLocalization(data.message, this.globals.messageCloseTime, this.globals.messageType.success);
        }
        else{
          this.messagePanelService.ShowPopupMessageWithLocalization(data.message, this.globals.messageCloseTime, this.globals.messageType.error);
        }
      })
    }
    else{
      console.log("mobileOtp",this.mobileOtp);
      obj ={
        "phone" : this.changenumber.mobile,
          "otp" : this.mobileOtp
      }
      this.loginService.phoneverify(obj).subscribe((data:any) =>{
        console.log("data",data);
        if(data.success == true)
        {
          this.messagePanelService.ShowPopupMessageWithLocalization(data.message, this.globals.messageCloseTime, this.globals.messageType.success);
        }
        else{
          this.messagePanelService.ShowPopupMessageWithLocalization(data.message, this.globals.messageCloseTime, this.globals.messageType.error);
        }
       
      })
    }

   
  }
 
}