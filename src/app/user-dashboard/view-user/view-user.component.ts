import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from 'src/app/service/dashboard.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private service: DashboardService, private messagePanelService: MessagePanelService, public globals: Globals) { }
  loginform: FormGroup;
  userInfo: any
  companyInfo: any
  check: boolean = true;
  check1: boolean = false;
  invite: boolean = true;
  subUser: string
  checkInvite: boolean = false
  // invitePasswrd:string=''
  ngOnInit() {

    this.login()
    this.userInfo = JSON.parse(localStorage.getItem('userinfo'))
    this.companyInfo = JSON.parse(localStorage.getItem('CompanyInfo'))
  }
  login() {
    this.loginform = this.formBuilder.group({
      subUsername: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
    this.userInfo = JSON.parse(localStorage.getItem('userinfo'))
    this.companyInfo = JSON.parse(localStorage.getItem('CompanyInfo'))
    console.log('this.userInfo------>', this.userInfo)
    if (this.userInfo.uid != this.companyInfo.user_id) {
      this.checkInvite = true
      this.subUser = 'SubUser cannot Invite another subUser';
      this.loginform.disable()
    }
  }
  isNumber(value: string | number): boolean {
    return ((value != null) && !isNaN(Number(value.toString())));
  }
  isValid(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  onSubmit() {

    let type: number = 1;
    let phone = "";
    let email = "";
    // const login = this.loginform.value

    let emailcheck = this.loginform.controls['email'].value;
    let subUsername = this.loginform.controls['subUsername'].value;

    if (!emailcheck) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Vaild Email ID OR Phonr Number", this.globals.messageCloseTime, this.globals.messageType.error);
      return;
    }
    if (this.isNumber(emailcheck)) {
      type = 2;
      email = "";
      phone = emailcheck;
    } else {
      type = 1;
      phone = "";
      email = emailcheck;
    }
    if (type == 1 && (!email || !this.isValid(email))) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Vaild Email ID", this.globals.messageCloseTime, this.globals.messageType.error);
    } else if (type == 2 && (!phone || phone.length != 10)) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Vaild Email ID", this.globals.messageCloseTime, this.globals.messageType.error);
    } else {
      let obj = {};
      if (type == 1) {
        obj = { "email": email }
      } else {
        obj = { "phone": phone }
      }

      console.log('login form value ------->', obj)
      this.service.checkUser(obj).subscribe(data => {
        // let data = {}
        // data['success'] = true;
        // // data['message'] = 'Existing User';
        // data['message'] = 'New User'
        // console.log('data----->', data)
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          if (data['message'] == 'Existing User') {
            this.check = true;
            this.check1 = true;
            // this.invite = false;
            obj['mainUser_id'] = this.userInfo.uid
            obj['mainUsername'] = this.userInfo.name
            obj['mainUseremail'] = this.userInfo.email
            obj['mainUserPhone'] = this.userInfo.phone
            obj['application_type'] = this.userInfo.application_type
            obj['company_id'] = this.companyInfo.uid
            obj['companyName'] = this.companyInfo.company_name
            this.inviteUser(obj)
            // obj['subUser_id'] = ''
          } else if (data['message'] == 'New User') {
            this.check = false
            if (this.check == false) {
              // let invitePasswrd = this.loginform.controls['password'].value
              // if (invitePasswrd) {
              //   obj['password'] = this.loginform.controls['password'].value;
              // }

              this.check1 = true;
              this.invite = false;
              obj['mainUser_id'] = this.userInfo.uid
              obj['mainUsername'] = this.userInfo.name
              obj['mainUseremail'] = this.userInfo.email
              obj['mainUserPhone'] = this.userInfo.phone

              obj['subUsername'] = subUsername
              obj['application_type'] = this.userInfo.application_type
              obj['company_id'] = this.companyInfo.uid
              obj['companyName'] = this.companyInfo.company_name

              let invitePasswrd = this.loginform.controls['password'].value
              if (invitePasswrd) {
                obj['password'] = this.loginform.controls['password'].value;
                console.log('obj---->', obj)
                this.inviteUser(obj)
              }
            }
          }
        }
      })
    }
  }
  inviteUser(obj) {
    this.service.subLogin(obj).subscribe(data => {
      console.log(data);
      //need to do some changes
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        this.loginform.reset();
      }
    })
  }
}

