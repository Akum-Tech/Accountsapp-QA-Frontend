
import { Component, OnInit, TemplateRef,ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService} from './../../service/login.service';
import { UserinfoModule} from './../../model/userinfo/userinfo.module';
import { MessagePanelService} from './../../service/message-panel.service';
import { Globals} from './../../global';
import { LocalStorageService} from './../../service/local-storage.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
check:boolean=true
  // wizard:WizardComponent;
Userdata:UserinfoModule;
modalRef: BsModalRef;
conformpassword:any;
user_id : any;
otp:any;
emailverify : any;
phoneverify : any;
emailpass : any;
phonepass : any;

subcriptiondata: any = [];
subcription_end_date : any;
server_date : any;
setuservalue :any;

isShow_one : boolean;
isShow_two : boolean;
isShow_three : boolean;
isShow_four : boolean;

subscriptionId: string;
Subscriptiondate : any ;
Subscriptionenddate : any ;

constructor( public globals:Globals,private router: Router, private formBuilder: FormBuilder, public loginService:LoginService,private messagePanelService: MessagePanelService,private localStorageService: LocalStorageService,private modalServiceverify: NgbModal, private modalService: BsModalService, private route: ActivatedRoute) {
}

@ViewChild('verifymodal', { static: true }) verifymodal: TemplateRef<any>;

open(verifymodal) {
  this.modalServiceverify.open(verifymodal , { size: 'lg' });
}

loginform = this.formBuilder.group({
  inputemail: ['', [Validators.required, Validators.email]],
  inputpass: ['', [Validators.required, Validators.minLength(6)]],
});

forgetpassform = this.formBuilder.group({
  inputemail: ['', [Validators.required, Validators.email]],
});

enterotpform = this.formBuilder.group({
    otp: ['', [Validators.required]],
});
changepassform = this.formBuilder.group({
  inputpass: ['', [Validators.required, Validators.minLength(6)]],
  conformpass: ['', [Validators.required, Validators.minLength(6)]]
});

emailverifyform = this.formBuilder.group({
  otp: ['', [Validators.required]],
});

phoneverifyform = this.formBuilder.group({
  otp: ['', [Validators.required]],
});

  ngOnInit() {
    localStorage.clear();

    this.isShow_one=true;
    this.isShow_two=false;
    this.isShow_three=false;
    this.isShow_four=false;

    this.route.queryParams.subscribe(params => {
      this.subscriptionId = params['subscriptionId'] ? params['subscriptionId'] : null;
    });
  }

  isValid(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

 isNumber(value: string | number): boolean
{
   return ((value != null) && !isNaN(Number(value.toString())));
}

numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

isValidpasswod(password){
var pass = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
return pass.test(String(password));
}


login(){
  let type:number=1;
  let phone="";
  let email="";
    let emailcheck=this.loginform.controls['inputemail'].value;
    let password=this.loginform.controls['inputpass'].value;

    if(!emailcheck){
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Vaild Email ID OR Phonr Number",this.globals.messageCloseTime,this.globals.messageType.error);
      return;
    }
    if(this.isNumber(emailcheck)){
      type=2;
      email="";
      phone = emailcheck;
    }else{
      type=1;
      phone="";
      email = emailcheck;
    }

     if(type==1 && (!email || !this.isValid(email)) ){
     this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Vaild Email ID",this.globals.messageCloseTime,this.globals.messageType.error);
     }else if(type==2 && (!phone || phone.length!=10) ){
     this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Vaild Email ID",this.globals.messageCloseTime,this.globals.messageType.error);
     }
    //  || !this.isValidpasswod(password)
      else if(!password){
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Password",this.globals.messageCloseTime,this.globals.messageType.error);
     }else{
       let obj=null;
       if(type==1){
        this.check=false
              obj={"email":email,"password":password,"logintype":type,"device_id":"","apple_token":"","android_token":""};
       }else{
        this.check=true
           obj={"phone":phone,"password":password,"logintype":type,"device_id":"","apple_token":"","android_token":""};
       }
       console.log('obj---->',obj)
      this.loginService.login(obj).subscribe(data=>{ 
        console.log('data---->',data)      
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later',this.globals.messageCloseTime,this.globals.messageType.error);
      }else if(data['success']==true){
        this.Userdata=data.user;
        this.Userdata.islogin=true;
        this.localStorageService.saveUserDetail(this.Userdata);
        this.emailpass = this.Userdata.email;
        this.phonepass = this.Userdata.phone;
        this.emailverify = data.user.is_email_verify;
        this.phoneverify = data.user.is_mobile_verify;

        if(data.user.application_type == 'admin'){
          this.router.navigate(['admin/admindashboard']);
        }else{
          if(data.user.is_mobile_verify == 0 && data.user.is_email_verify==0){
            this.modalServiceverify.open(this.verifymodal, { size: 'lg', backdrop : 'static', keyboard : false });
          }else{
            this.modalServiceverify.dismissAll();
            this.router.navigate(['/company']);
            if(this.subscriptionId) {
              this.router.navigate(['admin/order'], { queryParams: { subscriptionId: this.subscriptionId }});
            } else {
              this.router.navigate(['/company']);
            }
          }
        }


      }else if(data['statusCode']==400){
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);
      }else{
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.error);
      }
    });
  }
}


emailverifydone(){
  let otp = this.emailverifyform.controls['otp'].value;

  if (!otp) {
    this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid OTP", this.globals.messageCloseTime, this.globals.messageType.error);
  } else {

    let obj = {"email":this.emailpass,"otp":otp};

    this.loginService.emailverify(obj).subscribe(data=>{
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later',this.globals.messageCloseTime,this.globals.messageType.error);
      }else if(data['success']==true){
      this.Userdata=data.user;
      this.emailpass = this.Userdata.email;
      this.phonepass = this.Userdata.phone;
      this.emailverify = data.user.is_email_verify;
      this.phoneverify = data.user.is_mobile_verify;

      if(data.user.is_email_verify == 0 && data.user.is_mobile_verify == 0 ){
        this.modalServiceverify.open(this.verifymodal, { size: 'lg', backdrop : 'static', keyboard : false });
      }else{
        this.modalServiceverify.dismissAll();
        // this.router.navigate(['/login']);
        this.subscriptioncheck();
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);
      }

      }else if(data['statusCode']==400){
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);
    }else{
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.error);
    }
  });
  }
}

subscriptioncheck(){
     // ------------------------- SUBSCRIPTION DATE CHECK ------------------------------------
     this.loginService.subscriptioncheck({id:this.localStorageService.getuserId()}).subscribe(data => {
       if (data === null || data === undefined) {
         this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
       } else if (data['success'] == true) {
         this.subcriptiondata = data;

         this.Subscriptiondate = this.localStorageService.getuserinfo();

        this.Subscriptiondate.serverdate = data.severdate ;
        this.Subscriptiondate.subscription_end_date = data.user.subscription_end_date ;


        this.localStorageService.saveUserDetail(this.Subscriptiondate);

        setTimeout(()=>{
          this.router.navigate(['/company']);
         }, 2000);

          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);
       } else if (data['statusCode'] == 400) {
         this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
       } else {
         this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
       }
     });
     // ------------------------- SUBSCRIPTION DATE CHECK END------------------------------------
}

resendemailverifydone(){
    let obj = {"email":this.emailpass};
    this.loginService.resendemailverify(obj).subscribe(data=>{
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later',this.globals.messageCloseTime,this.globals.messageType.error);
      }else if(data['success']==true){
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);

      this.Userdata=data.user;
      this.emailpass = this.Userdata.email;
      this.phonepass = this.Userdata.phone;
      this.emailverify = data.user.is_email_verify;
      this.phoneverify = data.user.is_mobile_verify;

      if(data.user.is_email_verify == 0 && data.user.is_mobile_verify == 0 ){
        this.modalServiceverify.open(this.verifymodal, { size: 'lg', backdrop : 'static', keyboard : false });
      }else{
        this.modalServiceverify.dismissAll();
        this.router.navigate(['/login']);
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);
      }

      }else if(data['statusCode']==400){
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);
    }else{
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.error);
    }
  });
}

resendphoneverifydone(){
    let obj = {"phone":this.phonepass};
    this.loginService.resendphoneverify(obj).subscribe(data=>{
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later',this.globals.messageCloseTime,this.globals.messageType.error);
      }else if(data['success']==true){
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);

      this.Userdata=data.user;
      this.emailpass = this.Userdata.email;
      this.phonepass = this.Userdata.phone;
      this.emailverify = data.user.is_email_verify;
      this.phoneverify = data.user.is_mobile_verify;

      if(data.user.is_email_verify == 0 && data.user.is_mobile_verify == 0 ){
        this.modalServiceverify.open(this.verifymodal, { size: 'lg', backdrop : 'static', keyboard : false });
      }else{
        this.modalServiceverify.dismissAll();
        this.router.navigate(['/login']);
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);
      }

      }else if(data['statusCode']==400){
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);
    }else{
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.error);
    }
  });
}

phoneverifydone(){
  let otp = this.phoneverifyform.controls['otp'].value;

  if (!otp) {
    this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid OTP", this.globals.messageCloseTime, this.globals.messageType.error);
  } else {
    let obj = {"phone":this.phonepass,"otp":otp};

    this.loginService.phoneverify(obj).subscribe(data=>{
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later',this.globals.messageCloseTime,this.globals.messageType.error);
      }else if(data['success']==true){
      this.Userdata=data.user;
      this.emailpass = this.Userdata.email;
      this.phonepass = this.Userdata.phone;
      this.emailverify = data.user.is_email_verify;
      this.phoneverify = data.user.is_mobile_verify;

      if(data.user.is_email_verify == 0 && data.user.is_mobile_verify == 0){
        this.modalServiceverify.open(this.verifymodal, { size: 'lg', backdrop : 'static', keyboard : false });
      }else{
        this.modalServiceverify.dismissAll();
        this.subscriptioncheck();
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);
      }

      }else if(data['statusCode']==400){
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);
    }else{
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.error);
    }
  });
  }
}

forget(){

  let type:number=1;
  let phone="";
  let email="";
    let emailcheck=this.forgetpassform.controls['inputemail'].value;

    if(!emailcheck){
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Vaild Email ID OR Phonr Number",this.globals.messageCloseTime,this.globals.messageType.error);
      return;
    }
    if(this.isNumber(emailcheck)){
      type=2;
      email="";
      phone=emailcheck;
    }else{
      type=1;
      phone="";
      email=emailcheck;
    }
    if(type==1 && (!email || !this.isValid(email)) ){
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Email ID",this.globals.messageCloseTime,this.globals.messageType.error);
    }else if(type==2 && (!phone || phone.length!=10) ){
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Phone Number",this.globals.messageCloseTime,this.globals.messageType.error);
    }else{
      let obj={
        "email":email,
        "phone":phone
    };

    this.loginService.forgetpassword(obj).subscribe(data=>{
      this.user_id = data.userinfo.userid;
    if (data === null || data === undefined) {
      this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later',this.globals.messageCloseTime,this.globals.messageType.error);
    }else if(data['success']==true){

      this.showsteps(2);

    }else if(data['statusCode']==400){
    this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);
  }else{
    this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.error);
  }
    });
   }
}

sendotp(){
  let otp = this.enterotpform.controls['otp'].value;

  if (!otp) {
    this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid OTP", this.globals.messageCloseTime, this.globals.messageType.error);
  } else {
    let obj = {"otp":otp,'user_id':this.user_id};

    this.loginService.EnterOtp(obj).subscribe(data=>{
      this.otp = obj.otp;
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later',this.globals.messageCloseTime,this.globals.messageType.error);
      }else if(data['success']==true){

        this.showsteps(3);

      }else if(data['statusCode']==400){
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);
    }else{
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.error);
    }
  });
  }
}

async changepassword(){

  let inputpass = this.changepassform.controls['inputpass'].value;
  let conformpass = this.changepassform.controls['conformpass'].value;

  if(!inputpass) {
    this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Password", this.globals.messageCloseTime, this.globals.messageType.error);
  }else if (!conformpass || !this.isValidpasswod(conformpass)) {
    this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Confirm Password", this.globals.messageCloseTime, this.globals.messageType.error);
  }else if (!(inputpass === conformpass)) {
    this.messagePanelService.ShowPopupMessageWithLocalization("Password and Confirm Password not match", this.globals.messageCloseTime, this.globals.messageType.error);
  }else {

    let obj = {"password": inputpass, "conformpass": conformpass,"user_id":this.user_id,"otp":this.otp};
     this.loginService.ChangePass(obj).subscribe(data=>{

          if (data === null || data === undefined) {
            this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later',this.globals.messageCloseTime,this.globals.messageType.error);
          }else if(data['success']==true){

            this.showsteps(4);

          }else if(data['statusCode']==400){
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);
        }else{
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.error);
        }
      });
  }
}

ConformPassword(){
  this.modalRef.hide();
  this.router.navigate(['/login']);
}

openEditModal(template: TemplateRef<any>) {
  this.forgetpassform.reset();
  this.enterotpform.reset();
  this.changepassform.reset();
  this.showsteps(1);
    this.modalRef = this.modalService.show(template, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  openconformpassword(conformpassword: TemplateRef<any>) {
    this.modalRef.hide();
    this.modalRef = this.modalService.show(conformpassword, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }


  showsteps(val){
    if(val==1){
    this.isShow_one=true;
    this.isShow_two=false;
    this.isShow_three=false;
    this.isShow_four=false;
    }else if(val==2){
      this.isShow_one=false;
      this.isShow_two=true;
      this.isShow_three=false;
      this.isShow_four=false;
    }else if(val==3){
      this.isShow_one=false;
      this.isShow_two=false;
      this.isShow_three=true;
      this.isShow_four=false;
    }else if(val==4){
      this.isShow_one=false;
      this.isShow_two=false;
      this.isShow_three=false;
      this.isShow_four=true;
    }else{
      // noting
    }
  }

}




