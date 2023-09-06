import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LedgerService } from './../../service/ledger.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { Router } from '@angular/router';
import { UserinfoModule } from 'src/app/model/userinfo/userinfo.module';
import { SubaccountgroupComponent } from '../../component/subaccountgroup/subaccountgroup.component';
import { AddstockgroupComponent } from '../../component/addstockgroup/addstockgroup.component';
import { BuyplaneComponent } from '../../component/buyplane/buyplane.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BuyplaneService } from 'src/app/service/buyplane.service';
import Utils from './../../utils/utils';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css']
})
export class LedgerComponent implements OnInit {

  modalRef: BsModalRef;
  public data: any;
  accountlist: any = [];
  subaccountlist: any = [];
  ledgerList: any = [];
  statelist: any = [];
  deleteData: any = {};
  citylist: any = [];
  taxelist: any = [];
  account_group_id_new: string = '';
  account_sub_group_id: string = '';
  Userdata: any;
  cessblock: boolean = false;
  is_gstshow: boolean = false;
  ROund_OFF_SHOW: any;
  activecompany: any;
  debitsum: number = 0;
  Creditsum: number = 0;
  dataNotFount = true;

  setvalue: any;
  subcription_end_date: any;
  server_date: any;
  gst_number: string = null;
  balancesum: any = 0;
  period_start: any;
  period_end: any;
  pan_number: any;
  area: any;
  clicked = false;
  loader = true;
  activeuser: any;
  selectedType = '';
  bank = '';
  purchase_sales = '';
  capital_account = '';
  tax = '';
  // users: any[] = [0];

  constructor(public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, private buyplaneService: BuyplaneService, public ledgerService: LedgerService, private modalService: BsModalService, public dialog: MatDialog) {
    $(document).on('keydown', 'input[pattern]', function (e) {
      var input = $(this);
      var oldVal = input.val();
      var regex = new RegExp(input.attr('pattern'), 'g');

      setTimeout(function () {
        var newVal = input.val();
        if (!regex.test(newVal)) {
          input.val(oldVal);
        }
      }, 0);
    });
  }

  // -----------------------------------------------------------------------------------------------------------------------

  public openbuyplaneModal() {
    this.getplandatechanges();
    if (this.subcription_end_date < this.server_date || this.subcription_end_date == null) {
      this.modalRef.hide();
      const dialogRef = this.dialog.open(BuyplaneComponent, { width: '800px', disableClose: true, hasBackdrop: true });
      dialogRef.afterClosed().subscribe(result => {
      });
    } else {
      //
    }
  }

  public openSubGroupmodal() {
    this.modalRef.hide();
    this.router.navigate(['admin/subaccount']);
  }
  // -----------------------------------------------------------------------------------------------------------------------

  //___________________GET SINGLE USER____________________________________________________________________________
  getplandatechanges() {
    this.buyplaneService.getsingleuserinfo({ uid: this.localStorageService.getuserUId() }).subscribe(data => {
      if (data['success'] === true) {
        this.Userdata = data.user;
        this.setvalue = this.localStorageService.getuserinfo();
        this.setvalue.subscription_end_date = data.user.subscription_end_date;
        this.localStorageService.saveUserDetail(this.setvalue);

        this.subcription_end_date = this.setvalue.subscription_end_date;
        this.server_date = this.setvalue.serverdate;
      }
    });
  };
  //___________________GET SINGLE USER END____________________________________________________________________________

  // addUser(){
  //   this.users.push({});
  // }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  show(value) {
    this.cessblock = value;
  }

  gstshow(value) {
    this.is_gstshow = value;
  }

  ledgerform = this.formBuilder.group({
    name: ['', Validators.required],
    gst_number: ['', [Validators.pattern('^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$')]],
    amount: [''],
    street: [''],
    city_id: [''],
    // area: [''],
    state_id: [''],
    // pan_number: [''],
    opening_balance: [''],
    is_gst: [''],
    account_group_id: ['', Validators.required],
    account_holder_name: [''],
    bank_account_number: [''],
    ifsc: ['', [Validators.pattern('[A-Za-z]{4}[a-zA-Z0-9]{7}$')]],
    bank_name: [''],
    bank_branch: [''],
    taxes_slab_id: [''],
    state_status: [''],
    cess: [''],
    cess_tax: [''],
    is_default_bank: [''],
    sub_account_group_id: [''],

    phone_number: ['', Validators.pattern('^[0-9]{10}$')],
    website: [''],
    email: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')],
    jurisdiction: [''],
    cin_number: [''],
  });

  validation_messages = {
    'ifsc': [
      { type: 'pattern', message: 'Enter Valid IFSC Number' }
    ],
    'name': [
      { type: 'required', message: 'Please Enter Name' }
    ],
    'gst_number': [
      { type: 'pattern', message: 'Please Enter Valid Gst Number' }
    ],
    'account_group_id': [
      { type: 'required', message: 'Please Enter Account Group' }
    ],
    // 'state_id':[
    //   { type:'required', message:'Please Select State'}
    // ],
    'email': [
      { type: 'pattern', message: 'Please Enter Valid Email ID' }
    ],
    'phone_number': [
      { type: 'pattern', message: 'Please Enter Valid Phone Number' }
    ],
  }

  async addledger() {
    let name = this.ledgerform.controls['name'].value ? this.ledgerform.controls['name'].value : '';
    let gst_number = this.ledgerform.controls['gst_number'].value ? this.ledgerform.controls['gst_number'].value : '';
    let amount = this.ledgerform.controls['amount'].value ? this.ledgerform.controls['amount'].value : '0';
    let street = this.ledgerform.controls['street'].value ? this.ledgerform.controls['street'].value : '';
    let city_id = this.ledgerform.controls['city_id'].value ? this.ledgerform.controls['city_id'].value : '';
    // let area = this.ledgerform.controls['area'].value? this.ledgerform.controls['area'].value:'';
    let state_id = this.ledgerform.controls['state_id'].value ? this.ledgerform.controls['state_id'].value : '';
    // let pan_number = this.ledgerform.controls['pan_number'].value?this.ledgerform.controls['pan_number'].value:'';
    let opening_balance = this.ledgerform.controls['opening_balance'].value ? this.ledgerform.controls['opening_balance'].value : 'debit';
    let is_gst = this.ledgerform.controls['is_gst'].value ? this.ledgerform.controls['is_gst'].value : 'false';
    let account_group_id = this.ledgerform.controls['account_group_id'].value ? this.ledgerform.controls['account_group_id'].value : '';
    let account_holder_name = this.ledgerform.controls['account_holder_name'].value ? this.ledgerform.controls['account_holder_name'].value : '';
    let bank_account_number = this.ledgerform.controls['bank_account_number'].value ? this.ledgerform.controls['bank_account_number'].value : '';
    let ifsc = this.ledgerform.controls['ifsc'].value ? this.ledgerform.controls['ifsc'].value : '';
    let bank_name = this.ledgerform.controls['bank_name'].value ? this.ledgerform.controls['bank_name'].value : '';
    let bank_branch = this.ledgerform.controls['bank_branch'].value ? this.ledgerform.controls['bank_branch'].value : '';
    let taxes_slab_id = this.ledgerform.controls['taxes_slab_id'].value ? this.ledgerform.controls['taxes_slab_id'].value : null;
    let state_status = this.ledgerform.controls['state_status'].value ? this.ledgerform.controls['state_status'].value : 'local';
    let is_default_bank = this.ledgerform.controls['is_default_bank'].value ? this.ledgerform.controls['is_default_bank'].value : 'false';
    let cess_tax = this.ledgerform.controls['cess_tax'].value ? this.ledgerform.controls['cess_tax'].value : '';
    let cess = this.ledgerform.controls['cess'].value ? this.ledgerform.controls['cess'].value === 'no' ? false : true : false;
    let sub_account_group_id = this.ledgerform.controls['sub_account_group_id'].value ? this.ledgerform.controls['sub_account_group_id'].value : '';

    let phone_number = this.ledgerform.controls['phone_number'].value ? this.ledgerform.controls['phone_number'].value : '';
    let website = this.ledgerform.controls['website'].value ? this.ledgerform.controls['website'].value : '';
    let email = this.ledgerform.controls['email'].value ? this.ledgerform.controls['email'].value : '';
    let jurisdiction = this.ledgerform.controls['jurisdiction'].value ? this.ledgerform.controls['jurisdiction'].value : '';
    let cin_number = this.ledgerform.controls['cin_number'].value ? this.ledgerform.controls['cin_number'].value : '';


    if (!name) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Name", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }
    else if ((is_gst == 'true') && !gst_number) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid GST Number", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }
    else if ((this.selectedType == 'Bank (L)' || this.selectedType == 'Bank (A)' || this.selectedType == 'Sundry Debtors' || this.selectedType == 'Sundry Creditors') && !state_id) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Select State", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }

    else {

      if (is_gst == 'false') {
        gst_number = '';
      }
      let obj = { "company_id": this.localStorageService.getCompanyId(), "name": name, "gst_number": gst_number, "amount": amount.toString(), "street": street, "opening_balance": opening_balance, "is_gst": is_gst, "account_group_id": this.account_group_id_new, "sub_account_group_id": this.account_sub_group_id, "pan_number": "", "account_holder_name": account_holder_name, "bank_account_number": bank_account_number, "ifsc": ifsc, "bank_name": bank_name, "city_id": '', "taxes_slab_id": taxes_slab_id, "cess": cess, "bank_branch": bank_branch, "is_default_bank": is_default_bank, "state_status": state_status, "area": "", "cin_number": cin_number, "phone_number": phone_number, "website": website, "jurisdiction": jurisdiction, "email": email, "cess_tax": cess_tax, "state_id": state_id, "period_start": this.period_start = this.activecompany.current_period_start, "period_end": this.period_end = this.activecompany.current_period_end };
      console.log('object--------------->', obj)
      this.ledgerService.ledger(obj).subscribe(data => {
        console.log('data----------------->',data)
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          //modal close event
          this.modalRef.hide();
          this.ledgerform.reset();

          setTimeout(() => {
            this.getLedgerList();

          }, 1000);

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });

    }
  }

  ngOnInit() {

    this.getplandatechanges();
    this.activeuser = this.localStorageService.getuserinfo();
    if (this.localStorageService.getuserId()) {
      this.getLedgerList();
      this.getStatesList();
      this.gettaxeslist();
      this.getdefaultaccountgroupList();
    }
    else {
      this.messagePanelService.ShowPopupMessageWithLocalization("Invalid URL Please Try Again Later", this.globals.messageCloseTime, this.globals.messageType.error)
      this.router.navigate(['/login']);
    }
    this.activecompany = this.localStorageService.getCompanyInfo();
    this.period_start = this.activecompany.current_period_start;
    this.period_end = this.activecompany.current_period_end;
  }

  async editledger() {
    let id = this.ledgerform.controls['id'].value;
    let name = this.ledgerform.controls['name'].value ? this.ledgerform.controls['name'].value : '';
    let amount = this.ledgerform.controls['amount'].value ? this.ledgerform.controls['amount'].value : '0';
    let gst_number = this.ledgerform.controls['gst_number'].value ? this.ledgerform.controls['gst_number'].value : '';
    let street = this.ledgerform.controls['street'].value ? this.ledgerform.controls['street'].value : '';
    let city_id = this.ledgerform.controls['city_id'].value ? this.ledgerform.controls['city_id'].value : '';
    // let area = this.ledgerform.controls['area'].value? this.ledgerform.controls['area'].value:'';
    let state_id = this.ledgerform.controls['state_id'].value ? this.ledgerform.controls['state_id'].value : '';
    // let pan_number = this.ledgerform.controls['pan_number'].value?this.ledgerform.controls['pan_number'].value:'';
    let opening_balance = this.ledgerform.controls['opening_balance'].value;
    let is_gst = this.ledgerform.controls['is_gst'].value;

    this.account_sub_group_id = this.ledgerform.controls['sub_account_group_id'].value ? this.ledgerform.controls['sub_account_group_id'].value : '';
    this.account_group_id_new = this.ledgerform.controls['account_group_id'].value ? this.ledgerform.controls['account_group_id'].value : '';
    let account_group_id = this.ledgerform.controls['account_group_id'].value ? this.ledgerform.controls['account_group_id'].value : '';
    let sub_account_group_id = this.ledgerform.controls['sub_account_group_id'].value ? this.ledgerform.controls['sub_account_group_id'].value : '';

    let account_holder_name = this.ledgerform.controls['account_holder_name'].value ? this.ledgerform.controls['account_holder_name'].value : '';
    let bank_account_number = this.ledgerform.controls['bank_account_number'].value ? this.ledgerform.controls['bank_account_number'].value : '';
    let ifsc = this.ledgerform.controls['ifsc'].value ? this.ledgerform.controls['ifsc'].value : '';
    let bank_name = this.ledgerform.controls['bank_name'].value ? this.ledgerform.controls['bank_name'].value : '';
    let bank_branch = this.ledgerform.controls['bank_branch'].value ? this.ledgerform.controls['bank_branch'].value : '';
    let taxes_slab_id = this.ledgerform.controls['taxes_slab_id'].value ? this.ledgerform.controls['taxes_slab_id'].value : null;
    let state_status = this.ledgerform.controls['state_status'].value ? this.ledgerform.controls['state_status'].value : '';
    let is_default_bank = this.ledgerform.controls['is_default_bank'].value;
    let cess_tax = this.ledgerform.controls['cess_tax'].value ? this.ledgerform.controls['cess_tax'].value : '';
    let cess = this.ledgerform.controls['cess'].value ? this.ledgerform.controls['cess'].value === 'no' ? false : true : false;

    let phone_number = this.ledgerform.controls['phone_number'].value ? this.ledgerform.controls['phone_number'].value : '';
    let website = this.ledgerform.controls['website'].value ? this.ledgerform.controls['website'].value : '';
    let email = this.ledgerform.controls['email'].value ? this.ledgerform.controls['email'].value : '';
    let jurisdiction = this.ledgerform.controls['jurisdiction'].value ? this.ledgerform.controls['jurisdiction'].value : '';
    let cin_number = this.ledgerform.controls['cin_number'].value ? this.ledgerform.controls['cin_number'].value : '';

    if (!name) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Name", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }
    else if ((is_gst == 'true') && !gst_number) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid GST Number", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }
    else if ((this.selectedType == 'Bank (L)' || this.selectedType == 'Bank (A)' || this.selectedType == 'Sundry Debtors' || this.selectedType == 'Sundry Creditors') && !state_id) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Select State", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }

    else {

      if (is_gst == 'false') {
        gst_number = '';
      }

      let obj = { "company_id": this.localStorageService.getCompanyId(), "name": name, "gst_number": gst_number, "amount": amount.toString(), "street": street, "opening_balance": opening_balance, "is_gst": is_gst, "account_group_id": this.account_group_id_new, "sub_account_group_id": this.account_sub_group_id, "pan_number": "", "account_holder_name": account_holder_name, "bank_account_number": bank_account_number, "ifsc": ifsc, "bank_name": bank_name, "city_id": '', "taxes_slab_id": taxes_slab_id, "cin_number": cin_number, "phone_number": phone_number, "website": website, "jurisdiction": jurisdiction, "email": email, "cess": cess, "bank_branch": bank_branch, "state_status": state_status, "is_default_bank": is_default_bank, "area": "", "cess_tax": cess_tax, "state_id": state_id, "period_start": this.period_start = this.activecompany.current_period_start, "period_end": this.period_end = this.activecompany.current_period_end };

      this.ledgerService.putledger(id, obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.modalRef.hide();
          this.ledgerform.reset();

          setTimeout(() => {
            this.getLedgerList();

          }, 1000);

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }

  openLedgerEditModal(Edittemplate: TemplateRef<any>, item) {
    this.ROund_OFF_SHOW = item.name;
    if (item.cess) {
      this.cessblock = true;
    } else {
      this.cessblock = false;
    }
    if (item.is_gst) {
      this.is_gstshow = true;
    } else {
      this.is_gstshow = false;
    }
    // this.getCityListByEdit(item.state_id);
    this.selectedType = item.account_group.name;
    this.ledgerform = this.formBuilder.group({
      id: [item.uid],
      name: [item.name, Validators.required],
      gst_number: [item.gst_number, [Validators.pattern('^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$')]],
      amount: [item.amount],
      street: [item.street],
      city_id: [item.city_id],
      area: [item.area],
      state_id: [item.state_id],
      pan_number: [item.pan_number],
      opening_balance: [item.opening_balance],
      is_gst: [item.is_gst],
      account_group_id: [item.account_group_id],
      account_holder_name: [item.account_holder_name],
      bank_account_number: [item.bank_account_number],
      ifsc: [item.ifsc, Validators.pattern('[A-Za-z]{4}[a-zA-Z0-9]{7}$')],
      bank_name: [item.bank_name],
      bank_branch: [item.bank_branch],
      taxes_slab_id: [item.taxes_slab_id],
      state_status: [item.state_status],
      cess: [item.cess],
      cess_tax: [item.cess_tax],
      is_default_bank: [item.is_default_bank],

      cin_number: [item.cin_number],
      phone_number: [item.phone_number, Validators.pattern('^[0-9]{10}$')],
      website: [item.website],
      email: [item.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')],
      jurisdiction: [item.jurisdiction],
      sub_account_group_id: [item.sub_account_group_id],
      company_id: [this.localStorageService.getCompanyId()],
    });

    this.modalRef = this.modalService.show(Edittemplate, {
      class: 'modal-lg',
      keyboard: false,
      backdrop: 'static'
    });
  }

  getLedgerList() {
    this.ledgerService.getledger({ user_id: this.localStorageService.getuserId(), company_id: this.localStorageService.getCompanyId() }).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        this.ledgerList = data.Ledger; //data && data.Ledger.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        this.loader = false;
        this.dataNotFount = false;
        this.Creditsum = 0;
        this.debitsum = 0;
        this.balancesum = 0;

        this.ledgerList.forEach((element, index) => {
          if (element.opening_balance === "debit") {
            this.debitsum = (Utils.convertIntoNumber(this.debitsum) + Utils.convertIntoNumber(element.amount));
          } else {
            this.Creditsum = (Utils.convertIntoNumber(this.Creditsum) + Utils.convertIntoNumber(element.amount));
          }
        });
        this.balancesum = (Utils.convertIntoNumber(this.debitsum) - Utils.convertIntoNumber(this.Creditsum));

      } else if (data['statusCode'] == 400) {
        this.loader = false;
        this.dataNotFount = false;
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.loader = false;
        this.dataNotFount = false;
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  deleteledger(data) {
    this.ledgerService.deleteledger(data).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        //modal close event
        this.deleteData = {};
        this.modalRef.hide();
        setTimeout(() => {
          this.getLedgerList();
        }, 1000);
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  openLedgerAddModal(addtemplate: TemplateRef<any>) {
    this.ledgerform.reset();
    this.modalRef = this.modalService.show(addtemplate, {
      class: 'modal-lg',
      keyboard: false,
      backdrop: 'static'
    });
  }

  openLedgerDeleteModal(Deleteemplate: TemplateRef<any>, item) {
    this.deleteData = item ? item : {};
    this.modalRef = this.modalService.show(Deleteemplate, {
      class: 'modal-lg',
      keyboard: false,
      backdrop: 'static'
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getStatesList() {
    this.ledgerService.getstate().subscribe(data => {
      this.statelist = data && data.state.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    })
  };

  getCityList(data) {
    this.ledgerService.getcity(data).subscribe(data => {
      this.citylist = data && data.city.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      this.ledgerform.controls['city_id'].setValue(this.citylist[0].id);
    })
  };

  getCityListByEdit(stateid) {
    this.ledgerService.getcity(stateid).subscribe(data => {
      this.citylist = data && data.city.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    })
  };

  gettaxeslist() {
    this.ledgerService.gettaxes().subscribe(data => {
      this.taxelist = data["taxes"];
    })
  };

  getdefaultaccountgroupList() {
    this.ledgerService.getaccount(this.localStorageService.getCompanyId()).subscribe(data => {
      this.accountlist = data && data['AccountGroup'].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    })
  };

  getaccountname(accoimtid) {
    let accountname = '';
    this.accountlist.forEach(obj => {
      if (obj.uid == accoimtid) {
        accountname = obj.name;
      } else {
        //
      }
    })
    return accountname;
  }


  getAccountGroupid(data) {
    this.accountlist.forEach(obj => {
      if (obj.uid == data) {
        this.selectedType = obj.name;
        if (obj.account_group_id == null) {
          this.account_group_id_new = obj.uid;
          this.account_sub_group_id = '';
        } else {
          this.account_group_id_new = obj.account_group_id;
          this.account_sub_group_id = obj.uid;
        }
        this.selectedType = this.getaccountname(this.account_group_id_new);
      }
    })
  }


  getType(value) {
    if (value > 0) {
      return Utils.converttocomaawithdecimal(value);
    } else if (value == 0 || value == "") {
      return 0;
    } else {
      return Utils.converttocomaawithdecimal(value);
    }
  }
}

