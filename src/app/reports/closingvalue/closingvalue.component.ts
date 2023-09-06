import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LocalStorageService } from './../../service/local-storage.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { StockReportsService} from './../../service/stock-reports.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {CompanyService} from './../../service/company.service';
import { LedgerService} from './../../service/ledger.service';
import * as moment from 'moment';

@Component({
  selector: 'app-closingvalue',
  templateUrl: './closingvalue.component.html',
  styleUrls: ['./closingvalue.component.css']
})
export class ClosingvalueComponent implements OnInit {
  
  modalRef: BsModalRef;
  activecompany : any;
  current_periad_startdate : any ;
  current_periad_enddate : any;
  corrent_date_valid : any ;
  current_book : any   
  deleteData:any = {};
  closingvaluelist: any =[];
  loader = true ;
  Ledger_id:String = '';  
  account_group_id_new :string ='';
  account_sub_group_id :string= '';
  period_end:any;
  period_start:any;
  is_gstshow : boolean = false;
  ledgerdata:any= [];

  changemanualstock:any;

  constructor(public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService,public ledgerService:LedgerService, public companyService:CompanyService,public stockReportsService:StockReportsService,private modalService: BsModalService,public route:ActivatedRoute,public dialog: MatDialog) {
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
  gstshow(value){
    this.is_gstshow = value;
  }
  Closingvalueform = this.formBuilder.group({
    closingdate: ['', Validators.required],
    stockvalue: ['', Validators.required],
  }); 

  
  ledgerform = this.formBuilder.group({
    name: ['', Validators.required],
    gst_number: ['',[Validators.pattern('^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$')]],
    amount: [''],
    street: [''],
    city_id: [''],
    // area: [''],
    state_id: [''],
    // pan_number: [''],
    opening_balance: [''],
    is_gst:[''],
    account_group_id: ['', Validators.required],
    account_holder_name: [''],
    bank_account_number: [''],
    ifsc: ['',[Validators.pattern('[A-Za-z]{4}[a-zA-Z0-9]{7}$')]],
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
  async editledger(){    
    let id = this.ledgerdata.uid;
    let name = this.ledgerform.controls['name'].value?this.ledgerform.controls['name'].value:'';
    let amount = this.ledgerform.controls['amount'].value?this.ledgerform.controls['amount'].value:'0';
    let gst_number = this.ledgerform.controls['gst_number'].value?this.ledgerform.controls['gst_number'].value:'';
    let street = this.ledgerform.controls['street'].value?this.ledgerform.controls['street'].value:'';
    let city_id = this.ledgerform.controls['city_id'].value?this.ledgerform.controls['city_id'].value:'';
    // let area = this.ledgerform.controls['area'].value? this.ledgerform.controls['area'].value:'';
    let state_id = this.ledgerform.controls['state_id'].value?this.ledgerform.controls['state_id'].value:'';
    // let pan_number = this.ledgerform.controls['pan_number'].value?this.ledgerform.controls['pan_number'].value:'';
    let opening_balance = this.ledgerform.controls['opening_balance'].value;
    let is_gst = this.ledgerform.controls['is_gst'].value;

    this.account_sub_group_id = this.ledgerform.controls['sub_account_group_id'].value?this.ledgerform.controls['sub_account_group_id'].value:'';
    this.account_group_id_new = this.ledgerform.controls['account_group_id'].value?this.ledgerform.controls['account_group_id'].value:'';
    let account_group_id = this.ledgerform.controls['account_group_id'].value?this.ledgerform.controls['account_group_id'].value:'';
    let sub_account_group_id = this.ledgerform.controls['sub_account_group_id'].value?this.ledgerform.controls['sub_account_group_id'].value:'';
    
    let account_holder_name = this.ledgerform.controls['account_holder_name'].value?this.ledgerform.controls['account_holder_name'].value:'';
    let bank_account_number = this.ledgerform.controls['bank_account_number'].value? this.ledgerform.controls['bank_account_number'].value:'';
    let ifsc = this.ledgerform.controls['ifsc'].value?this.ledgerform.controls['ifsc'].value:'';
    let bank_name = this.ledgerform.controls['bank_name'].value?this.ledgerform.controls['bank_name'].value:'';
    let bank_branch = this.ledgerform.controls['bank_branch'].value?this.ledgerform.controls['bank_branch'].value:'';
    let taxes_slab_id = this.ledgerform.controls['taxes_slab_id'].value?this.ledgerform.controls['taxes_slab_id'].value:null;
    let state_status = this.ledgerform.controls['state_status'].value? this.ledgerform.controls['state_status'].value:'';
    let is_default_bank = this.ledgerform.controls['is_default_bank'].value;
    let cess_tax = this.ledgerform.controls['cess_tax'].value? this.ledgerform.controls['cess_tax'].value:'';
    let cess = this.ledgerform.controls['cess'].value?this.ledgerform.controls['cess'].value==='no'?false:true:false;
 
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
    } else{

      if(is_gst == 'false'){
        gst_number = '';
      }
      
      let obj = {"company_id":this.localStorageService.getCompanyId(),"name": name,"gst_number":gst_number,"amount":amount.toString(),"street": street,"opening_balance": opening_balance,"is_gst":is_gst,"account_group_id": this.account_group_id_new,"sub_account_group_id":this.account_sub_group_id,"pan_number":"","account_holder_name":account_holder_name,"bank_account_number":bank_account_number,"ifsc":ifsc,"bank_name":bank_name,"city_id": '',"taxes_slab_id":taxes_slab_id,"cin_number": cin_number,"phone_number":phone_number,"website":website,"jurisdiction":jurisdiction,"email":email,"cess":cess,"bank_branch":bank_branch,"state_status":state_status,"is_default_bank":is_default_bank,"area": "","cess_tax":cess_tax,"state_id": state_id,"period_start": this.period_start=this.activecompany.current_period_start,"period_end": this.period_end=this.activecompany.current_period_end};  

      this.ledgerService.putledger(id,obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) { 
          this.modalRef.hide();
        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }

  ngOnInit() {
    this.activecompany=this.localStorageService.getCompanyInfo();
    
    this.period_start=this.activecompany.current_period_start;
    this.period_end=this.activecompany.current_period_end;

    this.changemanualstock = this.formBuilder.group({
      user_id: [this.activecompany.user_id, Validators.required],
      uid: [this.activecompany.uid, Validators.required],
      manualstock_closing: ['No', Validators.required],
    });
   this.GetAllStockvalue();
   this.current_book = new Date(this.activecompany.bookstart_date);
   this.corrent_date_valid = new Date(this.activecompany.current_period_start);

   if(this.current_book >= this.corrent_date_valid){
     this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
   }else{
     this.current_periad_startdate = new Date(this.activecompany.current_period_start);
   }
   
   this.current_periad_enddate = new Date(this.activecompany.current_period_end);

    this.route.params.subscribe(async(params) => {
      await this.ledgerService.getsingleledger({Ledger_id:params.uid}).subscribe(async(data) => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.ledgerdata = data.Ledger;                 
              
          } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    });
  }

  async addClosingvalue() {
    let closingdate = this.Closingvalueform.controls['closingdate'].value?this.Closingvalueform.controls['closingdate'].value:'';
    let stockvalue = this.Closingvalueform.controls['stockvalue'].value?this.Closingvalueform.controls['stockvalue'].value:'';


    if (!closingdate) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Select Closing Date", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    } else if (!stockvalue) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Stock Value", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else{

     closingdate = moment(closingdate).format('YYYY-MM-DD');

      let obj = {"company_id":this.localStorageService.getCompanyId(),"closingdate": closingdate,"stockvalue":stockvalue,"financial_year":this.activecompany.financial_year};      
      this.stockReportsService.manualstockadd(obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.modalRef.hide();
          this.Closingvalueform.reset();

          setTimeout(()=>{ 
            this.GetAllStockvalue();
           
       }, 1000);

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }

  GetAllStockvalue(){
    this.loader = true;
    this.stockReportsService.getmanualstoclall({company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
      
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        this.closingvaluelist = data.stock;
        this.loader = false;
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  
  async editClosingvalue(){    
    let id = this.Closingvalueform.controls['id'].value;
    let closingdate = this.Closingvalueform.controls['closingdate'].value?this.Closingvalueform.controls['closingdate'].value:'';
    let stockvalue = this.Closingvalueform.controls['stockvalue'].value?this.Closingvalueform.controls['stockvalue'].value:'';
    

    if (!closingdate) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Select Closing Date", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    } else if (!stockvalue) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Stock Value", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }
    else{
      
     closingdate = moment(closingdate).format('YYYY-MM-DD');
      
      let obj = {"company_id":this.localStorageService.getCompanyId(),"closingdate": closingdate,"stockvalue":stockvalue,"financial_year":this.activecompany.financial_year};  

      this.stockReportsService.manualstockput(id,obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) { 
          //modal close event
          this.modalRef.hide();
          this.Closingvalueform.reset();

          setTimeout(()=>{ 
            this.GetAllStockvalue();
            
          }, 1000);

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }

  deleteclosingvalue(data) {
    this.stockReportsService.manualstockdelete(data).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) { 
        //modal close event
        this.deleteData = {};
        this.modalRef.hide();
        setTimeout(()=>{ 
          this.GetAllStockvalue();
        }, 1000);
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  openClosingAddModal(addtemplate: TemplateRef<any>) {
    this.Closingvalueform.reset();
    this.modalRef = this.modalService.show(addtemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }
  openOpenignAddModal(addopeningtemplate: TemplateRef<any>) {
    this.Closingvalueform.reset();
    this.ledgerform = this.formBuilder.group({
      id: [this.ledgerdata.uid],
      name: [this.ledgerdata.name, Validators.required],
      gst_number: [this.ledgerdata.gst_number,[Validators.pattern('^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$')]],
      amount: [this.ledgerdata.amount],
      street: [this.ledgerdata.street],
      city_id: [this.ledgerdata.city_id],
      area: [this.ledgerdata.area],
      state_id: [this.ledgerdata.state_id],
      pan_number: [this.ledgerdata.pan_number],
      opening_balance: [this.ledgerdata.opening_balance],
      is_gst: [this.ledgerdata.is_gst],
      account_group_id: [this.ledgerdata.account_group_id],
      account_holder_name: [this.ledgerdata.account_holder_name],
      bank_account_number: [this.ledgerdata.bank_account_number],
      ifsc: [this.ledgerdata.ifsc,Validators.pattern('[A-Za-z]{4}[a-zA-Z0-9]{7}$')],
      bank_name: [this.ledgerdata.bank_name],
      bank_branch: [this.ledgerdata.bank_branch],
      taxes_slab_id: [this.ledgerdata.taxes_slab_id],
      state_status:[this.ledgerdata.state_status],
      cess: [this.ledgerdata.cess],
      cess_tax:[this.ledgerdata.cess_tax],
      is_default_bank: [this.ledgerdata.is_default_bank],      
      cin_number: [this.ledgerdata.cin_number],
      phone_number: [this.ledgerdata.phone_number, Validators.pattern('^[0-9]{10}$')],
      website: [this.ledgerdata.website],
      email: [this.ledgerdata.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')],
      jurisdiction: [this.ledgerdata.jurisdiction],
      sub_account_group_id: [this.ledgerdata.sub_account_group_id],
      company_id: [this.localStorageService.getCompanyId()],
    });

    this.modalRef = this.modalService.show(addopeningtemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }
  openclosingEditModal(Edittemplate: TemplateRef<any>, item) {
     this.Closingvalueform = this.formBuilder.group({
       id: [item.uid],
       closingdate: [item.closingdate, Validators.required],
       stockvalue: [item.stockvalue, Validators.required],
       company_id: [this.localStorageService.getCompanyId()],
       financial_year: [this.activecompany.financial_year],
     });
 
     this.modalRef = this.modalService.show(Edittemplate, {
       class:'modal-lg',
       keyboard: false,
       backdrop:'static'
     });
  }
  openclosingDeleteModal(Deleteemplate: TemplateRef<any>, item) {
    this.deleteData = item?item:{};
    this.modalRef = this.modalService.show(Deleteemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  openclosingdefine(addclosingtemplate: TemplateRef<any>) {

    this.activecompany=this.localStorageService.getCompanyInfo();
    this.changemanualstock = this.formBuilder.group({
      user_id: [this.activecompany.user_id, Validators.required],
      uid: [this.activecompany.uid, Validators.required],
      manualstock_closing: [this.activecompany.manualstock_closing, Validators.required],
    });

    this.modalRef = this.modalService.show(addclosingtemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  
  ChangeManualStockValue(){
    let uid = this.changemanualstock.controls['uid'].value;
    let manualstock_closing =  this.changemanualstock.controls['manualstock_closing'].value?this.changemanualstock.controls['manualstock_closing'].value:'No';
   
    if (!manualstock_closing) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Select Manual Stock Closing", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else {
    
      let obj = {"uid":this.activecompany.uid,"manualstock_closing":manualstock_closing,"current_period_start":this.activecompany.current_period_start,"financial_start":this.activecompany.financial_start};

      this.companyService.ChangemanualStock(uid,obj).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) { 
        this.localStorageService.saveCompanyinfo(data.company);
        this.modalRef.hide();
        this.changemanualstock.reset();

      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
    }
  }


}
