import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../../service/signup.service';
import { UserinfoModule } from './../../model/userinfo/userinfo.module';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LoginService } from './../../service/login.service';
import { LocalStorageService } from './../../service/local-storage.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  // justified:any= 'justified';

  Userdata: UserinfoModule;
  modalRef: BsModalRef;
  check: boolean=true;
  subcriptiondata: any = [];
  subcription_end_date: any;
  server_date: any;
  setuservalue: any;

  emailverify: any;
  phoneverify: any;
  emailpass: any;
  phonepass: any;

  Subscriptiondate: any;
  Subscriptionenddate: any;

  signupform = this.formBuilder.group({
    // email: ['', [ Validators.email]],
    email: [''],
    name: ['', Validators.required],
    phoneno: [''],
    inputpass: ['', [Validators.required, Validators.minLength(6)]],
    conformpass: ['', [Validators.required, Validators.minLength(6)]]
  });


  constructor(public globals: Globals, private router: Router, public loginService: LoginService, private formBuilder: FormBuilder, public SignupService: SignupService, private messagePanelService: MessagePanelService, private modalServiceverify: NgbModal, private localStorageService: LocalStorageService) { }

  @ViewChild('verifymodal', { static: true }) verifymodal: TemplateRef<any>;

  emailverifyform = this.formBuilder.group({
    otp: ['', [Validators.required]],
  });

  phoneverifyform = this.formBuilder.group({
    otp: ['', [Validators.required]],
  });


  open(verifymodal) {
    this.modalServiceverify.open(verifymodal, { size: 'lg' });
  }

  ngOnInit() {
    localStorage.clear();
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

  isValidpasswod(password) {
    //var pass=/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}/;
    //var re=/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}/;
    var pass = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return pass.test(String(password));
  }


  signup() {
    let email = this.signupform.controls['email'].value;
    console.log('email-------->', email)
    let isnum = /^\d+$/.test(email)
    console.log('isnum----->', isnum)
    var phoneno1;
    var emailId;
    if (isnum == true) {
      phoneno1 = this.signupform.controls['email'].value
    } else {
      emailId = this.signupform.controls['email'].value
    }
    console.log('emailId--->', emailId)
    console.log('phno----->', phoneno1)
    let name = this.signupform.controls['name'].value;
    let phoneno = this.signupform.controls['phoneno'].value;
    let inputpass = this.signupform.controls['inputpass'].value;
    let conformpass = this.signupform.controls['conformpass'].value;
    var flag;
    if (phoneno1 != undefined) {
      if (!phoneno1 || phoneno1.toString().length != 10) {
        this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Vaild Mobile Number", this.globals.messageCloseTime, this.globals.messageType.error);
      } else {
        flag = 'isPhone';
        this.validations(name, inputpass, conformpass, phoneno1, flag)
      }

    } else if (emailId != undefined) {
      if (!this.isValid(emailId)) {
        this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Vaild Email ID", this.globals.messageCloseTime, this.globals.messageType.error);
      } else {
        flag = 'isEmail';
        this.validations(name, inputpass, conformpass, emailId, flag)
      }
    }

    // if (!name) {
    //   this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Full Name", this.globals.messageCloseTime, this.globals.messageType.error);
    // }

    // else if (emailId != undefined ||phoneno1 != undefined) {
    //   if (!this.isValid(emailId)) {
    //     this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Vaild Email ID", this.globals.messageCloseTime, this.globals.messageType.error);
    //   } 
    //   if (!phoneno1 || phoneno1.toString().length != 10) {
    //     this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Vaild Mobile Number", this.globals.messageCloseTime, this.globals.messageType.error);
    //   }
    // }


    // else if (!inputpass) {
    //   this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Password", this.globals.messageCloseTime, this.globals.messageType.error);
    // } else if (!conformpass) {
    //   this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Confirm Password", this.globals.messageCloseTime, this.globals.messageType.error);
    // } else if (!(inputpass === conformpass)) {
    //   this.messagePanelService.ShowPopupMessageWithLocalization("Password and Confirm Password not match", this.globals.messageCloseTime, this.globals.messageType.error);
    // }
    //  else {
    //   // if(emailId!=''&&inputpass!=''&&name!=''&&phoneno1!=''&&conformpass!=''){
    //   console.log('iam herer')
    //   let obj = { "email": emailId, "password": inputpass, "name": name, "phone": phoneno1, "conformpass": conformpass, "application_type": this.globals.applicationtype };
    //   console.log('obj---', obj)
    //   // this.SignupService.signup(obj).subscribe(data => {
    //   //   if (data === null || data === undefined) {
    //   //     this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
    //   //   } else if (data['success'] == true) {
    //   //     this.Userdata = data.user;
    //   //     this.Userdata.islogin = true;
    //   //     this.localStorageService.saveUserDetail(this.Userdata);
    //   //     this.emailpass = this.Userdata.email;
    //   //     this.phonepass = this.Userdata.phone;
    //   //     this.emailverify = data.user.is_email_verify;
    //   //     this.phoneverify = data.user.is_mobile_verify;


    //   //     if(data.user.is_mobile_verify == 0 && data.user.is_email_verify==0 ){
    //   //       this.modalServiceverify.open(this.verifymodal, { size: 'lg', backdrop : 'static', keyboard : false });
    //   //     }else{
    //   //       this.modalServiceverify.dismissAll();
    //   //       this.router.navigate(['/company']);
    //   //       this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);
    //   //     }

    //   //   } else if (data['statusCode'] == 400) {
    //   //     this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
    //   //   } else {
    //   //     this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
    //   //   }
    //   // });
    // }
  }

  validations(name, inputpass, conformpass, value, flag) {
    if (!name) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Full Name", this.globals.messageCloseTime, this.globals.messageType.error);
    } else if (!inputpass) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Password", this.globals.messageCloseTime, this.globals.messageType.error);
    } else if (!conformpass) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Confirm Password", this.globals.messageCloseTime, this.globals.messageType.error);
    } else if (!(inputpass === conformpass)) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Password and Confirm Password not match", this.globals.messageCloseTime, this.globals.messageType.error);
    } else {
      if (flag == 'isPhone') {
        let obj = { "email": '', "password": inputpass, "name": name, "phone": value, "conformpass": conformpass, "application_type": this.globals.applicationtype };
        console.log('phone---->', obj)
        this.apicall(obj, flag)
      } else {
        let obj = { "email": value, "password": inputpass, "name": name, "phone": '', "conformpass": conformpass, "application_type": this.globals.applicationtype };
        console.log('mail---->', obj)
        this.apicall(obj, flag)

      }

    }
  }

  apicall(obj, flag) {
    console.log('onject in api----->', obj)
    this.SignupService.signup(obj).subscribe(data => {
      console.log('data in frontend-------->', data)
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
        if (flag == 'isPhone') {
          this.check = true;
        } else {
          this.check = false;
        }

        if (data.user.is_mobile_verify == 0 && data.user.is_email_verify == 0) {
          this.modalServiceverify.open(this.verifymodal, { size: 'lg', backdrop: 'static', keyboard: false });


        } else {
          this.modalServiceverify.dismissAll();
          this.router.navigate(['/company']);
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        }

      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  subscriptioncheck() {
    // ------------------------- SUBSCRIPTION DATE CHECK ------------------------------------
    this.loginService.subscriptioncheck({ id: this.localStorageService.getuserId() }).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        this.subcriptiondata = data;

        this.Subscriptiondate = this.localStorageService.getuserinfo();

        this.Subscriptiondate.serverdate = data.severdate;
        this.Subscriptiondate.subscription_end_date = data.user.subscription_end_date;


        this.localStorageService.saveUserDetail(this.Subscriptiondate);
        setTimeout(() => {
          this.router.navigate(['/company']);
        }, 2000);

        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);

      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
    // ------------------------- SUBSCRIPTION DATE CHECK END------------------------------------
  }

  emailverifydone() {
    let otp = this.emailverifyform.controls['otp'].value;

    if (!otp) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid OTP", this.globals.messageCloseTime, this.globals.messageType.error);
    } else {

      let obj = { "email": this.emailpass, "otp": otp };

      this.loginService.emailverify(obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.Userdata = data.user;
          this.emailpass = this.Userdata.email;
          this.phonepass = this.Userdata.phone;
          this.emailverify = data.user.is_email_verify;
          this.phoneverify = data.user.is_mobile_verify;

          if (data.user.is_mobile_verify == 0 && data.user.is_email_verify == 0) {
            this.modalServiceverify.open(this.verifymodal, { size: 'lg', backdrop: 'static', keyboard: false });
          } else {
            this.modalServiceverify.dismissAll();
            // this.router.navigate(['/company']);
            this.subscriptioncheck();
            this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
          }

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }

  resendemailverifydone() {

    let obj = { "email": this.emailpass };
    this.loginService.resendemailverify(obj).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);

        this.Userdata = data.user;
        this.emailpass = this.Userdata.email;
        this.phonepass = this.Userdata.phone;
        this.emailverify = data.user.is_email_verify;
        this.phoneverify = data.user.is_mobile_verify;

        if (data.user.is_mobile_verify == 0 && data.user.is_email_verify == 0) {
          this.modalServiceverify.open(this.verifymodal, { size: 'lg', backdrop: 'static', keyboard: false });
        } else {
          this.modalServiceverify.dismissAll();
          this.router.navigate(['/company']);
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        }

      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  resendphoneverifydone() {

    let obj = { "phone": this.phonepass };
    this.loginService.resendphoneverify(obj).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);

        this.Userdata = data.user;
        this.emailpass = this.Userdata.email;
        this.phonepass = this.Userdata.phone;
        this.emailverify = data.user.is_email_verify;
        this.phoneverify = data.user.is_mobile_verify;

        if (data.user.is_mobile_verify == 0 && data.user.is_email_verify == 0) {
          this.modalServiceverify.open(this.verifymodal, { size: 'lg', backdrop: 'static', keyboard: false });
        } else {
          this.modalServiceverify.dismissAll();
          this.router.navigate(['/company']);
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        }

      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  phoneverifydone() {
    let otp = this.phoneverifyform.controls['otp'].value;

    if (!otp) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid OTP", this.globals.messageCloseTime, this.globals.messageType.error);
    } else {
      let obj = { "phone": this.phonepass, "otp": otp };

      this.loginService.phoneverify(obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.Userdata = data.user;
          this.emailpass = this.Userdata.email;
          this.phonepass = this.Userdata.phone;
          this.emailverify = data.user.is_email_verify;
          this.phoneverify = data.user.is_mobile_verify;

          if (data.user.is_mobile_verify == 0 && data.user.is_email_verify == 0) {
            this.modalServiceverify.open(this.verifymodal, { size: 'lg', backdrop: 'static', keyboard: false });
          } else {
            this.modalServiceverify.dismissAll();
            // this.router.navigate(['/company']);
            this.subscriptioncheck();
            this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
          }

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }

}
