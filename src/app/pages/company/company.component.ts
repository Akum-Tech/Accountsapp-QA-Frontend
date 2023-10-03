import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators } from '@angular/forms';
import { CompanyService } from './../../service/company.service';
import { UserinfoModule } from './../../model/userinfo/userinfo.module';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { Router } from '@angular/router';
import { BuyplaneService } from './../../service/buyplane.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})

export class CompanyComponent implements OnInit {
  modalRef: BsModalRef;
  public data: any;
  imagename: any;
  defaultImage: any = '';
  deleteData: any = {};
  companyList: any = [];
  banklist: any = [];
  statelist: any = [];
  activeuser: any;
  activebuyPlan: any;
  citylist: any = [];
  Userdata: UserinfoModule;
  cin_number: any;
  marked = false;
  clicked = false;
  imgbaseurl = "";
  currentDate: any = new Date();
  fileToUpload: any = '';
  // fileToUpload: File = null;
  role: string
  gstvalidation: any;
  setvalue: any;
subUsercheck:boolean
  subcriptiondata: any = [];
  subcription_end_date: any;
  server_date: any;

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  companyform = this.formBuilder.group({
    company_name: ['', Validators.required],
    composition_dealer: [''],
    // gst_number:[''],
    gst_number: ['', [Validators.pattern('^([a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$')]],
    // company_pan_number: ['',[Validators.pattern('^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$')]],
    company_pan_number: ['', [Validators.pattern('^([A-Z]){5}([0-9]){4}([A-Z]){1}?$')]],
    street: [''],
    city_id: ['', Validators.required],
    area: [''],
    state_id: ['', Validators.required],
    pin_code: [''],
    terms: [''],
    phone_number: ['', Validators.pattern('^[0-9]{10}$')],
    website: [''],
    email: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')],
    jurisdiction: [''],
    cin_number: [''],
    financial_year: ['', Validators.required],
    file: "",
  });

  companyformedit = this.formBuilder.group({
    company_name: ['', Validators.required],
    composition_dealer: [''],
    // gst_number:[''],
    gst_number: ['', [Validators.pattern('^([a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$')]],
    company_pan_number: ['', [Validators.pattern('^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$')]],
    street: [''],
    city_id: ['', Validators.required],
    area: [''],
    state_id: ['', Validators.required],
    pin_code: [''],
    terms: [''],
    phone_number: ['', Validators.pattern('^[0-9]{10}$')],
    website: [''],
    email: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')],
    jurisdiction: [''],
    cin_number: [''],
    financial_year: ['', Validators.required],
    file: "",
  });

  validation_messages = {
    'company_pan_number': [
      { type: 'pattern', message: 'Enter Valid Pan Number' }
    ],
    'gst_number': [
      { type: 'pattern', message: 'Enter Valid GST Number' }
    ],
    'company_name': [
      { type: 'required', message: 'Please Enter Company Name' }
    ],
    'state_id': [
      { type: 'required', message: 'Please Enter State' }
    ],
    'city_id': [
      { type: 'required', message: 'Please Enter City' }
    ],
    'financial_year': [
      { type: 'required', message: 'Financial Year Is Requied' }
    ],
    'email': [
      { type: 'pattern', message: 'Please Enter Valid Email ID' }
    ],
    'phone_number': [
      { type: 'pattern', message: 'Please Enter Valid Phone Number' }
    ],
  }

  constructor(public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, public buyplaneService: BuyplaneService, private localStorageService: LocalStorageService, public companyService: CompanyService, private modalServiceverify: NgbModal, private modalService: BsModalService) {
  }

  @ViewChild('subscriptionmodal', { static: true }) subscriptionmodal: TemplateRef<any>;

  compositiondealer(e) {
    this.marked = e.target.checked;
  }

  //___________________GET SINGLE USER____________________________________________________________________________
  getplandatechanges() {
    this.buyplaneService.getsingleuserinfo({ uid: this.localStorageService.getuserUId() }).subscribe(data => {
      if (data['success'] === true) {
        this.Userdata = data.user;
        this.setvalue = this.localStorageService.getuserinfo();
        this.setvalue.subscription_end_date = data.user.subscription_end_date;
        this.localStorageService.saveUserDetail(this.setvalue);
      }
    });
  };
  //___________________GET SINGLE USER END____________________________________________________________________________

  async addCompany() {
    this.clicked = false;
    this.companyform.controls['file'].setValue(this.fileToUpload);
    let company_name = this.companyform.controls['company_name'].value;
    let composition_dealer = this.companyform.controls['composition_dealer'].value ? this.companyform.controls['composition_dealer'].value : 'false';
    let gst_number = this.companyform.controls['gst_number'].value ? this.companyform.controls['gst_number'].value : '';
    let company_pan_number = this.companyform.controls['company_pan_number'].value ? this.companyform.controls['company_pan_number'].value : '';
    let street = this.companyform.controls['street'].value ? this.companyform.controls['street'].value : '';
    let city_id = this.companyform.controls['city_id'].value;
    let area = this.companyform.controls['area'].value ? this.companyform.controls['area'].value : '';
    let state_id = this.companyform.controls['state_id'].value;
    let pin_code = this.companyform.controls['pin_code'].value ? this.companyform.controls['pin_code'].value : '';
    let terms = this.companyform.controls['terms'].value ? this.companyform.controls['terms'].value : '';
    let financial_year = this.companyform.controls['financial_year'].value ? this.companyform.controls['financial_year'].value : '';
    let company_logo = this.companyform.controls['file'].value ? this.companyform.controls['file'].value : '';

    let phone_number = this.companyform.controls['phone_number'].value ? this.companyform.controls['phone_number'].value : '';
    let website = this.companyform.controls['website'].value ? this.companyform.controls['website'].value : '';
    let email = this.companyform.controls['email'].value ? this.companyform.controls['email'].value : '';
    let jurisdiction = this.companyform.controls['jurisdiction'].value ? this.companyform.controls['jurisdiction'].value : '';
    let cin_number = this.companyform.controls['cin_number'].value ? this.companyform.controls['cin_number'].value : '';

    if (!company_name) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Company Name", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    } else if (!state_id) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter State", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    } else if (!city_id) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter City", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    } else if (!financial_year) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Financial Year", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    } else {
      financial_year = moment(financial_year).format('MM-DD-YYYY');
      if (gst_number != '') {
        gst_number = (this.gstvalidation + gst_number);
      } else {
        //
      }
      let obj = null;
      if (company_logo != null && company_logo != "") {
        obj = { "company_name": company_name, "composition_dealer": composition_dealer, "gst_number": gst_number, "company_pan_number": company_pan_number, "street": street, "city_id": city_id, "cin_number": cin_number, "phone_number": phone_number, "website": website, "jurisdiction": jurisdiction, "email": email, "area": area, "state_id": state_id, "pin_code": pin_code, "financial_year": financial_year, "terms": terms, "file": company_logo };
      } else {
        obj = { "company_name": company_name, "composition_dealer": composition_dealer, "gst_number": gst_number, "company_pan_number": company_pan_number, "street": street, "city_id": city_id, "cin_number": cin_number, "phone_number": phone_number, "website": website, "jurisdiction": jurisdiction, "email": email, "area": area, "state_id": state_id, "pin_code": pin_code, "financial_year": financial_year, "terms": terms };
      }
      let form_data = await new FormData();
      for (var key in obj) {
        await form_data.append(key, obj[key]);
      }
      console.log('form_data------------>', form_data)
      this.clicked = true;
      this.companyService.company(form_data).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.modalRef.hide();
          this.companyform.reset();
          setTimeout(() => {
            this.getCompanyList();

            this.defaultImage = '';
            this.fileToUpload = null;
          }, 1000);

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }

  getYearsList(minYear) {
    return new Promise((resolve, reject) => {
      var a = [];
      var nowYear = new Date().getFullYear();
      minYear = minYear ? Number(minYear) : Number(nowYear) - 10;
      for (let index = minYear; index < nowYear; index++) {
        a.push(index + '-' + ((Number(index) + 1).toString().substr(-2)));
      }
      resolve(a);
    });
  }

  openAddModal(template: TemplateRef<any>) {

    this.clicked = false;
    this.companyform.reset();
    // this.gstvalidation = '';
    // this.defaultImage='';
    // this.fileToUpload=null;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      keyboard: false,
      backdrop: 'static'
    });
  }

  openEditModal(template: TemplateRef<any>, item) {

    console.log("edit---------------", item);
    console.log('this.localstorage.userInfo----------->', this.localStorageService.getuserinfo())
    var userInfo = this.localStorageService.getuserinfo();

    this.defaultImage = item.company_logo ? this.localStorageService.getBaseUrl() + item.company_logo : '';
    this.fileToUpload = item.company_logo;
    this.getCityListByEdit(item.state_id);
    let gst_number_convert = item.gst_number;

    gst_number_convert = gst_number_convert.slice(2);
    this.gstvalidation = item.state_id;

    this.companyformedit = this.formBuilder.group({
      id: [item.uid],
      company_name: [item.company_name, Validators.required],
      composition_dealer: [item.composition_dealer],
      gst_number: [gst_number_convert, Validators.pattern('^([a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$')],
      company_pan_number: [item.company_pan_number, Validators.pattern('^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$')],
      street: [item.street],
      city_id: [item.city_id, Validators.required],
      area: [item.area],
      state_id: [item.state_id, Validators.required],
      pin_code: [item.pin_code],
      terms: [item.terms],
      financial_year: [new Date(item.financial_year)],

      cin_number: [item.cin_number],
      phone_number: [item.phone_number, Validators.pattern('^[0-9]{10}$')],
      website: [item.website],
      email: [item.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')],
      jurisdiction: [item.jurisdiction],
      file: "",
    });

    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      keyboard: false,
      backdrop: 'static'
    });
    if (userInfo.uid != item.user_id) {
      console.log('userInfo.uid------------>', userInfo.uid)
      console.log('item.user_id------------>', item.user_id)
      this.companyformedit.disable()
    }
  }

  async editCompany() {
    // this.companyform.controls['file'].setValue(this.fileToUpload);
    this.companyformedit.controls['file'].setValue(this.fileToUpload);
    let id = this.companyformedit.controls['id'].value;
    let company_name = this.companyformedit.controls['company_name'].value;
    let composition_dealer = this.companyformedit.controls['composition_dealer'].value;
    let gst_number = this.companyformedit.controls['gst_number'].value ? this.companyformedit.controls['gst_number'].value : '';
    let company_pan_number = this.companyformedit.controls['company_pan_number'].value ? this.companyformedit.controls['company_pan_number'].value : '';
    let street = this.companyformedit.controls['street'].value ? this.companyformedit.controls['street'].value : '';
    let city_id = this.companyformedit.controls['city_id'].value;
    let area = this.companyformedit.controls['area'].value ? this.companyformedit.controls['area'].value : '';
    let state_id = this.companyformedit.controls['state_id'].value;
    let pin_code = this.companyformedit.controls['pin_code'].value ? this.companyformedit.controls['pin_code'].value : '';
    let terms = this.companyformedit.controls['terms'].value ? this.companyformedit.controls['terms'].value : '';
    let financial_year = this.companyformedit.controls['financial_year'].value;
    let company_logo = this.companyformedit.controls['file'].value ? this.companyformedit.controls['file'].value : '';


    let phone_number = this.companyformedit.controls['phone_number'].value ? this.companyformedit.controls['phone_number'].value : '';
    let website = this.companyformedit.controls['website'].value ? this.companyformedit.controls['website'].value : '';
    let email = this.companyformedit.controls['email'].value ? this.companyformedit.controls['email'].value : '';
    let jurisdiction = this.companyformedit.controls['jurisdiction'].value ? this.companyformedit.controls['jurisdiction'].value : '';
    let cin_number = this.companyformedit.controls['cin_number'].value ? this.companyformedit.controls['cin_number'].value : '';

    if (!company_name) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Company Name", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    } else if (!state_id) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter State", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    } else if (!city_id) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter City", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    } else if (!financial_year) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Financial Year", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    } else {

      financial_year = moment(financial_year).format('MM-DD-YYYY');

      if (gst_number != '') {
        gst_number = (this.gstvalidation + gst_number);
      } else {
        //
      }

      let obj = null;
      if (company_logo != null && company_logo != "") {
        obj = { "company_name": company_name, "composition_dealer": composition_dealer, "gst_number": gst_number, "company_pan_number": company_pan_number, "street": street, "city_id": city_id, "cin_number": cin_number, "phone_number": phone_number, "website": website, "jurisdiction": jurisdiction, "email": email, "area": area, "state_id": state_id, "pin_code": pin_code, "financial_year": financial_year, "terms": terms, "file": company_logo };
      } else {
        obj = { "company_name": company_name, "composition_dealer": composition_dealer, "gst_number": gst_number, "company_pan_number": company_pan_number, "street": street, "city_id": city_id, "cin_number": cin_number, "phone_number": phone_number, "website": website, "jurisdiction": jurisdiction, "email": email, "area": area, "state_id": state_id, "pin_code": pin_code, "financial_year": financial_year, "terms": terms };
      }

      let form_data = await new FormData();
      for (var key in obj) {
        await form_data.append(key, obj[key]);
      }
      let data = {
        id: id,
        form_data: form_data
      }
      this.companyService.putcompany(data).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.modalRef.hide();
          this.companyformedit.reset();

          setTimeout(() => {
            this.getCompanyList();

            this.defaultImage = '';
            this.fileToUpload = null;
          }, 1000);

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }

  onChangeSetImagePath(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      this.imagename = file.name;
      const img = new Image();
      img.src = window.URL.createObjectURL(file);
      this.fileToUpload = file;
      reader.readAsDataURL(file);
      reader.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src);
        this.defaultImage = reader.result;
      };
    }
  }

  getDate(date) {
    let data = date.split('T');
    if (data.length === 1) {
      date = date.replaceAll('-', '/');
    }
    return moment(new Date(date)).format('DD-MMM-YYYY')
  }

  ngOnInit() {
    let isDisabled: boolean = false;

    this.getplandatechanges();
    this.activeuser = this.localStorageService.getuserinfo();
    this.subcription_end_date = this.activeuser.subscription_end_date;
    this.server_date = this.activeuser.serverdate;

    if (this.subcription_end_date < this.server_date || this.subcription_end_date == null) {
      this.modalServiceverify.open(this.subscriptionmodal, { size: 'lg', backdrop: 'static', keyboard: false });
    } else {
      this.router.navigate(['/company']);
    }

    if (this.localStorageService.getuserId()) {
      this.imgbaseurl = this.localStorageService.getBaseUrl();
      this.getCompanyList();
      this.getStatesList();
    } else {
      this.messagePanelService.ShowPopupMessageWithLocalization("Invalid URL Please Try Again Later", this.globals.messageCloseTime, this.globals.messageType.error)
      this.router.navigate(['/login']);
    }
  }



  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getStatesList() {
    this.companyService.getstate().subscribe(data => {
      this.statelist = data.state;
    })
  };

  getCityList(data) {
    this.companyService.getcity(data).subscribe(data => {
      // if(data.length > 0){
      this.citylist = data.city;
      this.companyform.controls['city_id'].setValue(this.citylist[0].id);
      // }
    });
    if (data > 9) {

    } else {
      data = '0' + data.toString();
    }
    this.gstvalidation = data;
    // this.companyform.controls['gst_number'].setValue(data);
  };


  getCityListByEdit(stateid) {
    this.companyService.getcity(stateid).subscribe(data => {
      this.citylist = data.city;
    })
  };

  deletecompanyModal(template: TemplateRef<any>, item) {
    this.deleteData = item ? item : {};
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      keyboard: false,
      backdrop: 'static'
    });
  }

  deletecompany(data) {
    this.companyService.deletecompany(data).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        this.deleteData = {};
        this.modalRef.hide();
        setTimeout(() => {
          this.getCompanyList();
        }, 1000);
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }



  getCompanyList() {
    this.companyService.getcompany({ user_id: this.localStorageService.getuserUId() }).subscribe(data => {
      console.log('data from companylist----------->', data.company)
      let userInfo = this.localStorageService.getuserinfo();
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] === true) {
        if (data.company.length > 0) {
          this.companyList = data.company;
          let companyData = data.company
   
          // let checkset = [...new Set(companyData.map(x => x.user_id))]
          // console.log('checkset---------->',checkset)
          // console.log('userInfo.uid----->',userInfo.uid)
          // for (let i = 0; i < checkset.length; i++) {
          //   if (checkset[i] != userInfo.uid) {
          //     console.log('here---->')
          //     this.role = 'SubUser'
          //     this.subUsercheck=true
          //   }else{
          //     console.log('here123---->')
              
          //     this.role = 'Admin'
          //     this.subUsercheck=false
          //   }
          // }
          // this.companyList = data.company;
        } else {
          this.companyList = data.company;
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        }
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  gotoDashBoard(obj) {
    if (obj.current_period_start && obj.current_period_end && obj.financial_end && obj.financial_start && obj.financial_year) {
      obj.current_period_start = obj.current_period_start.replaceAll('-', '/');
      obj.current_period_end = obj.current_period_end.replaceAll('-', '/');
      obj.financial_end = obj.financial_end.replaceAll('-', '/');
      obj.financial_start = obj.financial_start.replaceAll('-', '/');
      obj.financial_year = obj.financial_year.replaceAll('-', '/');
    }

    console.log('object', obj);
    this.localStorageService.saveCompanyinfo(obj);
    this.router.navigate(['admin/dashboard']);
  }

}
