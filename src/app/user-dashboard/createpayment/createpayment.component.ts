import { Component, OnInit,TemplateRef, ViewChild  } from '@angular/core';
import { LedgerService} from './../../service/ledger.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { ItemsService} from './../../service/items.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { PaymentvoucherService } from './../../service/paymentvoucher.service';
import { NgbModalConfig, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { AddledgerComponent } from '../../component/addledger/addledger.component';
import * as moment from 'moment';
import { BuyplaneComponent } from '../../component/buyplane/buyplane.component';
import { BuyplaneService } from 'src/app/service/buyplane.service';

@Component({
  selector: 'app-createpayment',
  templateUrl: './createpayment.component.html',
  styleUrls: ['./createpayment.component.css']
})
export class CreatepaymentComponent implements OnInit {
  activecompany : any;
  imgbaseurl="";
  public data : any;
  ledgerList:any = [];
  showledger:boolean = false;
  users: any[] = [0];
  banklist:any = [];
  lastdatefind : any [];
  disableDate:any;
  setvalue :any;
  Userdata: any;
  disableDateUid:any;
  loader = true ;
  ledgerBankList:any = [];
  current_periad_startdate : any ;
  current_periad_enddate : any;
  corrent_date_valid : any ;
  current_book : any ;
  bank_ledger:any;
  activeuser:any;
  ledger:any = { };
  receiveledger:any = {};
  clicked = false;

  subcription_end_date : any;
  server_date : any;

  payment:any = {
    company_id:'', 
    invoice_date:'',
    ledger_id:'',
    receive_id:'', 
    total_amount:'',
    narration:"",
    is_local:"no", 
    name:"", 
    bank_name:"",
    bank_account_number:"", 
    bank_ifsc:"", 
    // type:"credit",
    type:"debit",
    receive_type:"", 
  };
  receive_id: any;


  constructor(private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public globals: Globals, public ledgerService:LedgerService,public paymentvoucherService:PaymentvoucherService,public itemsService:ItemsService,public router:Router,config: NgbModalConfig, private modalService: NgbModal,private buyplaneService: BuyplaneService, public route:ActivatedRoute,public dialog: MatDialog) {
       
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

  @ViewChild('paymentmodal', { static: true }) paymentmodal: TemplateRef<any>;

  // -------------------------------------------------------------------------------------------------------
    public openbuyplaneModal(){
    if(this.subcription_end_date < this.server_date || this.subcription_end_date == null ){
       const dialogRef = this.dialog.open(BuyplaneComponent, { width: '800px', disableClose: true, hasBackdrop:true});
        dialogRef.afterClosed().subscribe(result =>  {
        this.modalService.dismissAll();
        });
      }else{
        //
      } 
    }
// -------------------------------------------------------------------------------------------------------
//___________________GET SINGLE USER____________________________________________________________________________
getplandatechanges(){
  this.buyplaneService.getsingleuserinfo({uid:this.localStorageService.getuserUId()}).subscribe(data => {
    if (data['success'] === true) {
          this.Userdata=data.user;
          this.setvalue = this.localStorageService.getuserinfo();
          this.setvalue.subscription_end_date = data.user.subscription_end_date ;
          this.localStorageService.saveUserDetail(this.setvalue);
          
          // this.subcription_end_date = this.setvalue.subscription_end_date;
          // this.server_date = this.setvalue.serverdate;
      }
    });
};
//___________________GET SINGLE USER END____________________________________________________________________________

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  done(createinvoice) {
    this.modalService.dismissAll();
    this.modalService.open(createinvoice , { size: 'lg' , backdrop : 'static', keyboard : false });
  }

  show(value){
    this.showledger = value;
  }
// -----------------------------------------------------------------------------------------------------------
  
  public openLedgerAddModal(){
    this.modalService.dismissAll();
    this.router.navigate(['admin/addledger']);
  }
  
// -----------------------------------------------------------------------------------------------------------

  
  async ngOnInit() {  
    this.getplandatechanges(); 
    this.activeuser = this.localStorageService.getuserinfo(); 
    this.subcription_end_date = this.activeuser.subscription_end_date;
    this.server_date = this.activeuser.serverdate;
    this.openbuyplaneModal();
    this.imgbaseurl= this.localStorageService.getBaseUrl();
    this.activecompany= this.localStorageService.getCompanyInfo();
    this.route.params.subscribe((params) => {
     if(params.status==="after"){
        this.payment.is_after=true;
        this.payment.is_before=false;
        this.payment.after_id=params.uid==='none'?'':params.uid;
      }else if(params.status==="before"){
        this.payment.is_before=true;
        this.payment.is_after=false;
        this.payment.after_id=params.uid==='none'?'':params.uid;
        this.disableDateUid = params.invoicedate;
      }else{
        this.payment.is_after=false;
        this.payment.is_before=false;
        this.payment.after_id='';
      }
    })
    this.current_book = new Date(this.activecompany.bookstart_date);
    this.corrent_date_valid = new Date(this.activecompany.current_period_start);
    this.payment.current_year = new Date(this.activecompany.current_period_start).getFullYear();
    this.payment.end_year = new Date(this.activecompany.current_period_end).getFullYear();
    this.activecompany.current_period_start = moment(this.activecompany.current_period_start).format('MMM-DD-YYYY');
    this.activecompany.current_period_end = moment(this.activecompany.current_period_end).format('MMM-DD-YYYY');
    this.payment.description = this.localStorageService.getCompanyTermsInfo();
    this.payment.company_id = this.localStorageService.getCompanyId();
    this.paymentvoucherService.LastDate({company_id:this.localStorageService.getCompanyId(),current_year:new Date(this.activecompany.current_period_start).getFullYear(),end_year:new Date(this.activecompany.current_period_end).getFullYear()}).subscribe(data => {
      if (data['success'] == true && data.PaymentVoucher  && data.PaymentVoucher.uid) {
        this.lastdatefind = data.PaymentVoucher;
        this.disableDate = data.PaymentVoucher.invoice_date;
        this.getValidation(data.PaymentVoucher.invoice_date);
      } else {
        this.getBeforeValidation();
      }
    });
    this.getledgerdata();
    this.getbankledger();
  }
  getBeforeValidation(){
    if(this.current_book >= this.corrent_date_valid){
      this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
      this.current_periad_enddate = new Date(this.activecompany.current_period_end);
      this.payment.invoice_date =  new Date(this.current_periad_startdate);
    }else{
      this.current_periad_startdate = new Date(this.activecompany.current_period_start);
      this.current_periad_enddate = new Date(this.activecompany.current_period_end);
      this.payment.invoice_date =  new Date(this.current_periad_startdate);
    }
    this.modalService.open(this.paymentmodal, { size: 'lg', backdrop : 'static', keyboard : false });
  }

  getValidation(disableDate){
    if(this.payment.is_before){
      if(this.current_book >= this.corrent_date_valid){
        this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
        this.current_periad_enddate = new Date(this.disableDateUid);
        this.payment.invoice_date =  new Date(this.current_periad_startdate);
      }else{
        this.current_periad_startdate = new Date(this.activecompany.current_period_start);
        this.current_periad_enddate = new Date(this.disableDateUid);
        this.payment.invoice_date =  new Date(this.current_periad_startdate);
      }
    }else{
      this.current_periad_startdate = new Date(disableDate);
      this.current_periad_enddate = new Date(this.activecompany.current_period_end);
      this.payment.invoice_date = new Date(disableDate); 
    }
    this.modalService.open(this.paymentmodal, { size: 'lg', backdrop : 'static', keyboard : false });
  }


  getledgerdata(){
    this.ledgerService.getledgercashbank({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true){
        this.ledgerList = data && data.Ledger.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        this.loader = false;
      } else if (data['statusCode'] == 400){
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  getbankledger(){
    this.ledgerService.getbankcashledger({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        this.ledgerBankList = data && data.Ledger.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }
  
  getbankLedgerData(item){
    this.receiveledger = item;
    this.payment.name = item.name, 
    this.payment.bank_name = item.bank_name,
    this.payment.bank_account_number = item.bank_account_number, 
    this.payment.bank_ifsc = item.ifsc,
    this.payment.receive_id = item.uid;
    if(item.account_group.name == 'cash'){
      this.payment.receive_type = "cash";
    }else{
      this.payment.receive_type = "bank";
    }
  }
  getLedgerData(item){
    this.ledger = item;
    this.payment.ledger_id = item.uid;
    this.payment.ledger_id = item.uid;
  }

  async genrateVoucher(){
    this.clicked = false;
    this.payment.invoice_date = moment(this.payment.invoice_date).format('MM-DD-YYYY');
    this.clicked = true;
    this.paymentvoucherService.createPaymenrvoucher(this.payment).subscribe(data => {
    if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {     
       this.modalService.dismissAll();
       this.payment = {};
       this.router.navigate(['admin/payment']);
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

}
