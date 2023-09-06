import { Component, OnInit, TemplateRef, Inject } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LedgerService} from './../../service/ledger.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { Router } from '@angular/router';
import { UserinfoModule } from 'src/app/model/userinfo/userinfo.module';
import { LedgerComponent } from '../../user-dashboard/ledger/ledger.component';
import { Location } from '@angular/common';
import Utils from './../../utils/utils';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SalesinvoiceComponent } from '../../user-dashboard/salesinvoice/salesinvoice.component';
import { CreatejournalvoucherComponent } from '../../user-dashboard/createjournalvoucher/createjournalvoucher.component';

@Component({
  selector: 'app-addledger',
  templateUrl: './addledger.component.html',
  styleUrls: ['./addledger.component.css']
})
export class AddledgerComponent implements OnInit {

  public data : any;
  accountlist:any =[];
  subaccountlist:any=[];
  ledgerList: any =[];
  statelist:any =[];
  deleteData:any = {};
  citylist:any =[];
  taxelist:any =[];
  account_group_id_new :string ='';
  account_sub_group_id :string= '';
  Userdata: UserinfoModule;
  cessblock : boolean = false;
  is_gstshow : boolean = false;
  activecompany : any;
  period_start:any;
  period_end:any;
  selectedType = '';
  bank = '';
  purchase_sales = '';
  capital_account = '';
  tax = '';
  pan_number:any;
  area:any;
  clicked = false;


  gstshow(value){
    this.is_gstshow = value;
  }
  
  show(value){
    this.cessblock = value;
  }
 
  // constructor(public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public ledgerService:LedgerService,private modalService: BsModalService,private location: Location,public dialog: MatDialog,public dialogRef: MatDialogRef<CreatejournalvoucherComponent>) {

  // constructor(public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public ledgerService:LedgerService,private modalService: BsModalService,private location: Location,public dialog: MatDialog, public dialogRef: MatDialogRef<SalesinvoiceComponent>, @Inject(MAT_DIALOG_DATA) public otherdata: any) {
  //correct one 
  constructor(public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public ledgerService:LedgerService,private modalService: BsModalService,private location: Location) {
  
    $(document).on('keydown', 'input[pattern]', function(e){
      var input = $(this);
      var oldVal = input.val();
      var regex = new RegExp(input.attr('pattern'), 'g');
    
      setTimeout(function(){
        var newVal = input.val();
        if(!regex.test(newVal)){
          input.val(oldVal); 
        }
      }, 0);
    });
   }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  closeledger(){
    this.location.back();
  }
  
  public openSubGroupmodal(){
    this.router.navigate(['admin/subaccount']);
  }

  getType(value){
    if(value>0){
      return Utils.converttocomaawithdecimal(value);
      //return Number(value)+' dr';
    }else if (value==0 || value==""){
      return 0;
    }else{
        return Utils.converttocomaawithdecimal(value);
    }
  }

  ngOnInit() {    
    if(this.localStorageService.getuserId()){
      this.getStatesList();
      this.gettaxeslist();
      this.getdefaultaccountgroupList();
    }
    else{
      this.messagePanelService.ShowPopupMessageWithLocalization("Invalid URL Please Try Again Later",this.globals.messageCloseTime,this.globals.messageType.error)
      this.router.navigate(['/login']);
    }
    this.activecompany=this.localStorageService.getCompanyInfo();
    this.period_start=this.activecompany.current_period_start;
    this.period_end=this.activecompany.current_period_end;
  }

  ledgerform = this.formBuilder.group({
    name: ['', Validators.required],
    amount: [''],
    street: [''],
    city_id: [''],
    // area: [''],
    state_id: [''],
    // pan_number: ['',[Validators.pattern('^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$')]],
    gst_number: ['',[Validators.pattern('^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$')]],
    opening_balance: [''],
    is_gst: [''],
    account_group_id: ['', Validators.required],
    account_holder_name: [''],
    bank_account_number: [''],
    ifsc: ['',[Validators.pattern('[A-Z|a-z]{4}[0][\d]{6}$')]],
    bank_name: [''],
    bank_branch: [''],
    taxes_slab_id: [''],
    state_status:[''],
    cess: [''],
    cess_tax: [''],
    is_default_bank:[''],
    sub_account_group_id: [''],

    phone_number: ['',  Validators.pattern('^[0-9]{10}$')],
    website: [''],
    email: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')],
    jurisdiction: [''],
    cin_number: [''],
  });  

  
  validation_messages={
    'ifsc':[
    { type:'pattern', message:'Enter Valid IFSC Number'}
    ],
    'name':[
    { type:'required', message:'Please Enter Name'}
    ],
    'gst_number':[
      { type:'pattern', message:'Please Enter Valid Gst Number'}
      ],
    'account_group_id':[
    { type:'required', message:'Please Enter Account Group'}
    ],
    // 'state_id':[
    //   { type:'required', message:'Please Select State'}
    // ],
    'email':[
      { type:'pattern', message:'Please Enter Valid Email ID'}
    ],
    'phone_number':[
      { type:'pattern', message:'Please Enter Valid Phone Number'}
    ],
  }

  async addledger() {
    let name = this.ledgerform.controls['name'].value?this.ledgerform.controls['name'].value:'';
    let gst_number = this.ledgerform.controls['gst_number'].value?this.ledgerform.controls['gst_number'].value:'';
    let amount = this.ledgerform.controls['amount'].value?this.ledgerform.controls['amount'].value:'0';
    let street = this.ledgerform.controls['street'].value?this.ledgerform.controls['street'].value:'';
    let city_id = this.ledgerform.controls['city_id'].value;
    // let area = this.ledgerform.controls['area'].value? this.ledgerform.controls['area'].value:'';
    let state_id = this.ledgerform.controls['state_id'].value;
    // let pan_number = this.ledgerform.controls['pan_number'].value?this.ledgerform.controls['pan_number'].value:'';
    let opening_balance = this.ledgerform.controls['opening_balance'].value?this.ledgerform.controls['opening_balance'].value:'debit';
    let is_gst = this.ledgerform.controls['is_gst'].value?this.ledgerform.controls['is_gst'].value:'false';
    let account_group_id = this.ledgerform.controls['account_group_id'].value?this.ledgerform.controls['account_group_id'].value:'';
    let account_holder_name = this.ledgerform.controls['account_holder_name'].value?this.ledgerform.controls['account_holder_name'].value:'';
    let bank_account_number = this.ledgerform.controls['bank_account_number'].value? this.ledgerform.controls['bank_account_number'].value:'';
    let ifsc = this.ledgerform.controls['ifsc'].value?this.ledgerform.controls['ifsc'].value:'';
    let bank_name = this.ledgerform.controls['bank_name'].value?this.ledgerform.controls['bank_name'].value:'';
    let bank_branch = this.ledgerform.controls['bank_branch'].value?this.ledgerform.controls['bank_branch'].value:'';
    let taxes_slab_id = this.ledgerform.controls['taxes_slab_id'].value?this.ledgerform.controls['taxes_slab_id'].value:null;
    let state_status = this.ledgerform.controls['state_status'].value? this.ledgerform.controls['state_status'].value:'';
    let is_default_bank = this.ledgerform.controls['is_default_bank'].value?this.ledgerform.controls['is_default_bank'].value:'false';
    let cess_tax = this.ledgerform.controls['cess_tax'].value?this.ledgerform.controls['cess_tax'].value:'';
    let cess = this.ledgerform.controls['cess'].value?this.ledgerform.controls['cess'].value==='no'?false:true:false;
    let sub_account_group_id = this.ledgerform.controls['sub_account_group_id'].value;

    
    let phone_number = this.ledgerform.controls['phone_number'].value? this.ledgerform.controls['phone_number'].value:'';
    let website = this.ledgerform.controls['website'].value? this.ledgerform.controls['website'].value:'';
    let email = this.ledgerform.controls['email'].value? this.ledgerform.controls['email'].value:'';
    let jurisdiction = this.ledgerform.controls['jurisdiction'].value? this.ledgerform.controls['jurisdiction'].value:'';
    let cin_number = this.ledgerform.controls['cin_number'].value? this.ledgerform.controls['cin_number'].value:'';


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
    else{

      if(is_gst == 'false'){
        gst_number = '';
      }
      
      let obj = {"company_id":this.localStorageService.getCompanyId(),"name": name,"gst_number":gst_number,"amount":amount.toString(),"street": street,"opening_balance": opening_balance,"is_gst":is_gst,"account_group_id": this.account_group_id_new,"sub_account_group_id":this.account_sub_group_id,"pan_number":"","account_holder_name":account_holder_name,"bank_account_number":bank_account_number,"ifsc":ifsc,"bank_name":bank_name,"city_id": '',"taxes_slab_id":taxes_slab_id,"cess":cess,"cin_number": cin_number,"phone_number":phone_number,"website":website,"jurisdiction":jurisdiction,"email":email,"bank_branch":bank_branch,"is_default_bank":is_default_bank,"state_status":state_status,"area": "","cess_tax":cess_tax,"state_id": state_id,"period_start": this.period_start=this.activecompany.current_period_start,"period_end": this.period_end=this.activecompany.current_period_end};      

      this.ledgerService.ledger(obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.location.back();
          this.ledgerform.reset();
          // console.log('data----->',data)
          // this.dialogRef.close(data);
          // this.ledgerform.reset();


        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
      
    }
  }

  gettaxeslist(){
    this.ledgerService.gettaxes().subscribe(data => {
      this.taxelist = data["taxes"];
    })
  };
  getStatesList(){
    this.ledgerService.getstate().subscribe(data => {
      this.statelist = data.state;
    })
  };
  
  getCityList(data){
    this.ledgerService.getcity(data).subscribe(data => {
      this.citylist = data.city;
      this.ledgerform.controls['city_id'].setValue(this.citylist[0].id);
    })
  };

  getCityListByEdit(stateid){
    this.ledgerService.getcity(stateid).subscribe(data => {
      this.citylist = data.city;
    })
  };
  
  getdefaultaccountgroupList(){
    this.ledgerService.getaccount(this.localStorageService.getCompanyId()).subscribe(data => {
      // console.log('data------------>',data)
      this.accountlist = data && data['AccountGroup'].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      // console.log('this.accountlist------------>',this.accountlist)
    })
  };

  getaccountname(accoimtid){
    let accountname='';
    this.accountlist.forEach(obj => {
        // this.account_group_id_new = obj.uid;
          if(obj.uid==accoimtid){
            accountname =obj.name;
          }else{
            //
          }
    })
    return accountname;
  }
  getAccountGroupid(data){
    this.accountlist.forEach(obj => {
      //alert(obj.id);
      if(obj.uid==data){
        this.selectedType = obj.name;
        if(obj.account_group_id == null){
          this.account_group_id_new = obj.uid;
           this.account_sub_group_id = '';
        }else{
          this.account_group_id_new = obj.account_group_id;
           this.account_sub_group_id = obj.uid;
        }
         this.selectedType =this.getaccountname(this.account_group_id_new);     
      }
    })
  }
}
