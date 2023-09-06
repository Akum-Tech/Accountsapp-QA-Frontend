
import { Component, OnInit,TemplateRef, ViewChild, ElementRef  } from '@angular/core';
import { LedgerService} from './../../service/ledger.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { JournalvoucherService } from 'src/app/service/journalvoucher.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AddledgerComponent } from '../../component/addledger/addledger.component';
import { ViewjournalvoucherService } from './../../service/viewjournalvoucher.service';
import {MatDialog} from '@angular/material/dialog';
import { BuyplaneComponent } from '../../component/buyplane/buyplane.component';
import { BuyplaneService } from 'src/app/service/buyplane.service';

@Component({
  selector: 'app-edit-journal',
  templateUrl: './edit-journal.component.html',
  styleUrls: ['./edit-journal.component.css']
})
export class EditJournalComponent implements OnInit {

  public data : any;
  activecompany : any;
  ledgerList:any = [];
  itemList:any = [];
  ledgers: any = [{}];
  setvalue :any;
  Userdata: any;
  activeuser:any;
  ledger:any = {};
  uidvoucherprint : any;
  purposelist:any = [];
  currentDate:any = new Date();
  current_periad_startdate : any ;
  current_periad_enddate : any;
  corrent_date_valid : any ;
  current_book : any ;
  JournalVoucher : any = [];
  total_amount: number = 0;
  disablebtn:boolean = true;
  purpose:any = {};
  
  subcription_end_date : any;
  server_date : any;

  journalvoucher:any = {
    itemAdd  :[],
    invoice_date:'',
    company_id:'',
    purpose_id:'',
    narration:"",
    total_amount:'0',
  };
  

  constructor(private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public globals: Globals, public ledgerService:LedgerService,public viewjournalvoucherService:ViewjournalvoucherService,public journalvoucherService:JournalvoucherService,public router:Router,config: NgbModalConfig,private modalService: NgbModal,private buyplaneService: BuyplaneService, public route:ActivatedRoute,public dialog: MatDialog) {
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

  @ViewChild('journalvouchermodal', { static: true }) journalvouchermodal: TemplateRef<any>;
  
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

  done(updateinvoice) {
    this.modalService.dismissAll();
    this.modalService.open(updateinvoice , { size: 'lg' , backdrop : 'static', keyboard : false });
  }

  addLedger(){
    this.ledgers.push({});
  }

  removeLedger(i, item){
    if(item.amount!=='0' || item.amount!==0){
      this.journalvoucher.total_amount = Number(this.journalvoucher.total_amount)-Number(item.amount)
    }
    this.ledgers.splice(i, 1); 
    this.calculateamount(this.ledgers,i, item.amount);
  }
  
  public openLedgerAddModal(){
    this.modalService.dismissAll();
    this.router.navigate(['admin/addledger']);
  }
  

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ngOnInit() {  
    this.getplandatechanges();   
    this.activeuser = this.localStorageService.getuserinfo(); 
    this.subcription_end_date = this.activeuser.subscription_end_date;
    this.server_date = this.activeuser.serverdate;
    this.openbuyplaneModal();
     this.modalService.open(this.journalvouchermodal, { size: 'lg', backdrop : 'static', keyboard : false });
     this.activecompany=this.localStorageService.getCompanyInfo();
     this.current_book = new Date(this.activecompany.bookstart_date);
     this.corrent_date_valid = new Date(this.activecompany.current_period_start);
 
     if(this.current_book >= this.corrent_date_valid){
       this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
     }else{
       this.current_periad_startdate = new Date(this.activecompany.current_period_start);
     }

     
     this.journalvoucher.invoice_date =  new Date(this.activecompany.current_period_start);
     this.journalvoucher.current_year =new Date(this.activecompany.current_period_start).getFullYear();
     this.journalvoucher.end_year =new Date(this.activecompany.current_period_end).getFullYear();
     this.activecompany.current_period_start = moment(this.activecompany.current_period_start).format('MM-DD-YYYY');
     this.activecompany.current_period_end = moment(this.activecompany.current_period_end).format('MM-DD-YYYY');
     this.current_periad_enddate = new Date(this.activecompany.current_period_end);
     this.journalvoucher.company_id = this.localStorageService.getCompanyId();

    this.JournalVoucher.invoice_date = moment(this.JournalVoucher.invoice_date).format('MM-DD-YYYY');
    this.route.params.subscribe(async(params) => {
      await this.viewjournalvoucherService.getJournalVoucher({voucher_id:params.uid}).subscribe(async(data) => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {

          if(data.JournalVoucher.purpose_voucher != '' && data.JournalVoucher.purpose_voucher != null){
            this.journalvoucher = data.JournalVoucher;
            this.uidvoucherprint =this.journalvoucher.uid;
            this.ledger= data.JournalVoucher.VoucherLedger;
            this.purpose = data.JournalVoucher.purpose_voucher;
            this.ledgers =await data.JournalVoucher.journal_entries && data.JournalVoucher.journal_entries.length>0?data.JournalVoucher.journal_entries:[];
            
          }else{
            this.journalvoucher = data.JournalVoucher;
            this.uidvoucherprint =this.journalvoucher.uid;
            this.journalvoucher.invoice_date = data.JournalVoucher.invoice_date;
          }


         
          await this.getledger();
          this.getPurposelist();
          } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    });      
 }

 getPurposelist(){
   this.journalvoucherService.getpurpose({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
     this.purposelist = data && data['city'].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
   })
 };


 async calculateamount(itemledger, index, status){
  this.journalvoucher.total_amount = 0;
  let debitAmount=0;
  let creditAmount=0;
  
  await this.ledgers.forEach((element, index) => {
      this.journalvoucher.total_amount = Number(this.journalvoucher.total_amount)+Number(element.amount);
      if(element.type=='debit'){
        debitAmount = Number(debitAmount)+Number(element.amount)
      }else{
        creditAmount = Number(creditAmount)+Number(element.amount)
      }
     if(index==this.ledgers.length-1){   
        if(Number(debitAmount.toFixed(2))!==Number(creditAmount.toFixed(2))){ 
          this.disablebtn=false; 
          if(itemledger.type && itemledger.amount){
            this.addLedger();
          }
        }else{  
         
          this.disablebtn=true;
        }
      }else{
        console.log("index-else",index);
        console.log("length-else",this.ledgers.length);
      }
  });
}
 
 getledger(){
   this.ledgerService.getjournalledgerdata({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
     if (data === null || data === undefined) {
       this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
     } else if (data['success'] == true){
       this.ledgerList = data && data.Ledger.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
     } else if (data['statusCode'] == 400){
       this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
     } else {
       this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
     }
   });
 }

 async getpurposeData(item){
  let findpurpose = await this.purposelist.find(el=>el.id===item);
   this.purpose = findpurpose;
   this.journalvoucher.purpose_id = this.purpose.id;
 }

 async getLedgerData(itemledger, index){
   if(itemledger!==''){
     let data = await this.ledgerList.find(data=>data.uid===itemledger);
     this.ledgers[index] = await {
       'company_id': this.localStorageService.getCompanyId(),
       'type':'',
       'ledger_id':data.uid,
       'amount':'',
     };   
   }
 }
 
 Update(){    
  this.journalvoucher.itemAdd  = this.ledgers;
  this.journalvoucher.invoice_date = moment(this.journalvoucher.invoice_date).format('MM-DD-YYYY');
  this.journalvoucherService.editjournalVoucher(this.journalvoucher).subscribe(data => {
    this.router.navigate(['admin/journalvoucher']);
  if (data === null || data === undefined) {
      this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
    } else if (data['success'] == true) {
     this.modalService.dismissAll();
     this.journalvoucher = {};
     this.ledgers = [{}];
     this.router.navigate(['admin/printjournalvoucher', this.uidvoucherprint]);
    } else if (data['statusCode'] == 400) {
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
    } else {
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
    }
  });
}

}
