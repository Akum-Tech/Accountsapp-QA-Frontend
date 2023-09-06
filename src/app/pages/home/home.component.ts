import AOS from 'aos';
import { Component, OnInit, TemplateRef,ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../../service/signup.service';
import { UserinfoModule } from './../../model/userinfo/userinfo.module';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LoginService} from './../../service/login.service';
import { LocalStorageService } from './../../service/local-storage.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  Userdata: UserinfoModule;
  modalRef: BsModalRef;

  clicked = false;
  subcriptiondata: any = [];
  subcription_end_date : any;
  server_date : any;
  setuservalue :any;

  emailverify : any;
  phoneverify : any;
  emailpass : any;
  phonepass : any;
  
  loader = true ;

  Subscriptiondate : any ;
  Subscriptionenddate : any ;

  signupform = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    phoneno: ['', Validators.required],
    inputpass: ['', [Validators.required, Validators.minLength(6)]],
    conformpass: ['', [Validators.required, Validators.minLength(6)]]
  });
  
  contactform = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    number: ['', Validators.required,  Validators.minLength(10)],
  }); 

  constructor(public globals: Globals, private router: Router,public loginService:LoginService, private formBuilder: FormBuilder, public SignupService: SignupService,private messagePanelService: MessagePanelService,private modalServiceverify: NgbModal, private localStorageService: LocalStorageService) { 
    

    // $(function() {
    //   console.log( "ready!" );
    //   AOS.init({
    //     disable: 'mobile'
    //   });


    //   // Set the date we're counting down to
    // var countDownDate = new Date("Dec 2, 2021 19:00:00").getTime();
    
    // // Update the count down every 1 second
    // var x = setInterval(function() {
    
    //   // Get today's date and time
    //   var now = new Date().getTime();
        
    //   // Find the distance between now and the count down date
    //   var distance = countDownDate - now;
        
    //   // Time calculations for days, hours, minutes and seconds
    //   var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    //   var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //   var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    //   var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
    //   // Output the result in an element with id="demo"
    //   document.getElementById("demo").innerHTML = days + "d " + hours + "h "
    //   + minutes + "m " + seconds + "s ";
        
    //   // If the count down is over, write some text 
    //   if (distance < 0) {
    //     clearInterval(x);
    //     document.getElementById("demo").innerHTML = "EXPIRED";
    //   }
    // }, 1000);


    // });

  }



 @ViewChild('verifymodal', { static: true }) verifymodal: TemplateRef<any>;

  emailverifyform = this.formBuilder.group({
    otp: ['', [Validators.required]],  
  });
  
  phoneverifyform = this.formBuilder.group({
    otp: ['', [Validators.required]],  
  });
  

  open(verifymodal) {
    this.modalServiceverify.open(verifymodal , { size: 'lg' });
  }

  ngOnInit() {
    localStorage.clear();
    this.loader = false;
  }

numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
}
 

 isValid(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
 }

isValidpasswod(password){
//var pass=/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}/;
//var re=/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}/;
var pass = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
return pass.test(String(password));
}


  signup() {   
    let email = this.signupform.controls['email'].value;
    let name = this.signupform.controls['name'].value;
    let phoneno = this.signupform.controls['phoneno'].value;
    let inputpass = this.signupform.controls['inputpass'].value;
    let conformpass = this.signupform.controls['conformpass'].value;
    if (!name) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Full Name", this.globals.messageCloseTime, this.globals.messageType.error);
    } else if (!email || !this.isValid(email)) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Vaild Email ID", this.globals.messageCloseTime, this.globals.messageType.error);
    }else if (!phoneno || phoneno.toString().length!=10) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Vaild Mobile Number", this.globals.messageCloseTime, this.globals.messageType.error);
    } else if (!inputpass ) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Password", this.globals.messageCloseTime, this.globals.messageType.error);
    }else if (!conformpass ) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Confirm Password", this.globals.messageCloseTime, this.globals.messageType.error);
    }else if (!(inputpass === conformpass)) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Password and Confirm Password not match", this.globals.messageCloseTime, this.globals.messageType.error);
    } else {
      let obj = {"email": email, "password": inputpass, "name": name, "phone": phoneno, "conformpass": conformpass,"application_type":this.globals.applicationtype};
      this.SignupService.signup(obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.Userdata = data.user;
          this.Userdata.islogin = true;
          this.localStorageService.saveUserDetail(this.Userdata);
          this.emailpass = this.Userdata.email;
          this.phonepass = this.Userdata.phone;
          this.emailverify = data.user.is_email_verify;
          this.phoneverify = data.user.is_mobile_verify;
   

          if(data.user.is_email_verify == 0 || data.user.is_mobile_verify == 0 ){
            this.modalServiceverify.open(this.verifymodal, { size: 'lg', backdrop : 'static', keyboard : false });
          }else{
            this.modalServiceverify.dismissAll();
            this.router.navigate(['/company']);
            this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);
          }

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
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
      
      if(data.user.is_email_verify == 0 || data.user.is_mobile_verify == 0 ){
        this.modalServiceverify.open(this.verifymodal, { size: 'lg', backdrop : 'static', keyboard : false });
      }else{
        this.modalServiceverify.dismissAll();
        // this.router.navigate(['/company']);
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
      
      if(data.user.is_email_verify == 0 || data.user.is_mobile_verify == 0 ){
        this.modalServiceverify.open(this.verifymodal, { size: 'lg', backdrop : 'static', keyboard : false });
      }else{
        this.modalServiceverify.dismissAll();
        this.router.navigate(['/company']);
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
      
      if(data.user.is_email_verify == 0 || data.user.is_mobile_verify == 0 ){
        this.modalServiceverify.open(this.verifymodal, { size: 'lg', backdrop : 'static', keyboard : false });
      }else{
        this.modalServiceverify.dismissAll();
        this.router.navigate(['/company']);
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
      
      if(data.user.is_email_verify == 0 || data.user.is_mobile_verify == 0 ){
        this.modalServiceverify.open(this.verifymodal, { size: 'lg', backdrop : 'static', keyboard : false });
      }else{
        this.modalServiceverify.dismissAll();
        // this.router.navigate(['/company']);
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



MessageSend(){
  this.clicked = false;
  this.loader = false;
  let name = this.contactform.controls['name'].value;
  let email = this.contactform.controls['email'].value;
  let number = this.contactform.controls['number'].value;
  if (!name) {
    this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Name", this.globals.messageCloseTime, this.globals.messageType.error);
    return false;
  }
  else if(!email || !this.isValid(email)) {
    this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Email ID", this.globals.messageCloseTime, this.globals.messageType.error);
    return false;
  }
  else if(!number) {
    this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Phone NUmber", this.globals.messageCloseTime, this.globals.messageType.error);
    return false;
  }
  else{

    let obj = {"name":name,"email":email,"number":number};

    console.log("ADD------------",obj)
    this.clicked = true;
    this.loader = true;
    this.loginService.Contectsend(obj).subscribe(data => {        
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) { 
        this.contactform.reset();
        // setTimeout(()=>{ 
        //   this.getitemsList();
        //  }, 1000);

         this.clicked = false;
         this.loader = false;
      } else if (data['statusCode'] == 400) {
        this.clicked = false;
        this.loader = false;
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.clicked = false;
        this.loader = false;
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });

  }
}

}
