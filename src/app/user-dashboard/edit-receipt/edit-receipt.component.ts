import { Component, OnInit,TemplateRef, ViewChild  } from '@angular/core';
import { LedgerService} from './../../service/ledger.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ItemsService} from './../../service/items.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { ReceiptvoucherService } from './../../service/receiptvoucher.service';
import { NgbModalConfig, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { VeiwreceiptService } from './../../service/veiwreceipt.service';
import { AddledgerComponent } from '../../component/addledger/addledger.component';
import * as moment from 'moment';
import { BuyplaneComponent } from '../../component/buyplane/buyplane.component';
import { BuyplaneService } from 'src/app/service/buyplane.service';

@Component({
  selector: 'app-edit-receipt',
  templateUrl: './edit-receipt.component.html',
  styleUrls: ['./edit-receipt.component.css']
})
export class EditReceiptComponent implements OnInit {


  activecompany : any;
  modalRef: BsModalRef;
  imgbaseurl="";
  public data : any;
  ledgerList:any = [];
  showledger:boolean = false;
  users: any[] = [0];
  banklist:any = [];
  ledgerBankList:any = [];  
  RecieptVoucher: any = [];
  current_periad_startdate : any ;
  current_periad_enddate : any;
  corrent_date_valid : any ;
  current_book : any ;  
  setvalue :any;
  Userdata: any;
  uidvoucherprint : any;
  bank_ledger:any;
  activeuser:any;
  ledger:any = {};
  
  subcription_end_date : any;
  server_date : any;

  receiveledger:any = {};
  recieptvoucher:any = {
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
    type:"credit",
    receive_type:"bank", 
  };
  
  constructor(private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public globals: Globals, public ledgerService:LedgerService,public veiwreceiptService:VeiwreceiptService,public receiptvoucherService:ReceiptvoucherService,public itemsService:ItemsService,private router: Router,config: NgbModalConfig,private buyplaneService: BuyplaneService, private modalService: NgbModal, private route:ActivatedRoute,public dialog: MatDialog) {
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

  @ViewChild('receiptmodal', { static: true }) receiptmodal: TemplateRef<any>;

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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  
  show(value){
    this.showledger = value;
  }
  getImage(image){
    if(image){
      return this.imgbaseurl+image;
    }else{
    }
  }

// -----------------------------------------------------------------------------------------------------------
  public openLedgerAddModal(){
    this.modalService.dismissAll();
    this.router.navigate(['admin/addledger']);
  }
  // -----------------------------------------------------------------------------------------------------------

  ngOnInit() {  
    this.getplandatechanges(); 
      this.activeuser = this.localStorageService.getuserinfo(); 
      this.subcription_end_date = this.activeuser.subscription_end_date;
      this.server_date = this.activeuser.serverdate;
      this.openbuyplaneModal();
      this.imgbaseurl=this.localStorageService.getBaseUrl();
      this.modalService.open(this.receiptmodal, { size: 'lg', backdrop : 'static', keyboard : false });
      this.activecompany=this.localStorageService.getCompanyInfo();

      this.current_book = new Date(this.activecompany.bookstart_date);
      this.corrent_date_valid = new Date(this.activecompany.current_period_start);
  
      if(this.current_book >= this.corrent_date_valid){
        this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
      }else{
        this.current_periad_startdate = new Date(this.activecompany.current_period_start);
      }

      this.recieptvoucher.invoice_date =  new Date(this.activecompany.current_period_start);
      this.recieptvoucher.current_year =new Date(this.activecompany.current_period_start).getFullYear();
      this.recieptvoucher.end_year =new Date(this.activecompany.current_period_end).getFullYear();
      this.activecompany.current_period_start = moment(this.activecompany.current_period_start).format('MM-DD-YYYY');
      this.activecompany.current_period_end = moment(this.activecompany.current_period_end).format('MM-DD-YYYY');
      this.current_periad_enddate = new Date(this.activecompany.current_period_end);
      this.recieptvoucher.description = this.localStorageService.getCompanyTermsInfo();
      this.recieptvoucher.company_id = this.localStorageService.getCompanyId();
      this.getledgerdata();
      this.getbankledger();
      this.imgbaseurl=this.localStorageService.getBaseUrl();
      this.RecieptVoucher.invoice_date = moment(this.RecieptVoucher.invoice_date).format('MM-DD-YYYY');
      this.route.params.subscribe(async(params) => {
         await this.veiwreceiptService.getReceiptVoucher({voucher_id:params.uid}).subscribe(async(data) => {
          if (data === null || data === undefined) {
            this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
          } else if (data['success'] == true) {
            
          if(data.RecieptVoucher.ReciptBuyer != '' && data.RecieptVoucher.ReciptBuyer != null){
            this.recieptvoucher = data.RecieptVoucher;
            this.uidvoucherprint =this.recieptvoucher.uid;
            this.ledger= data.RecieptVoucher.ReciptBuyer;
            this.receiveledger= data.RecieptVoucher.ReciptReciver;
          }else{
            this.recieptvoucher = data.RecieptVoucher;            
            this.uidvoucherprint =this.recieptvoucher.uid;
            this.recieptvoucher.invoice_date = data.RecieptVoucher.invoice_date;
          }

          
            } else if (data['statusCode'] == 400) {
            this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
          } else {
            this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
          }
        });
        });

 }

  getledgerdata(){
    this.ledgerService.getledgercashbank({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
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

  async getbankLedgerData(item){
    let findreceive = await this.ledgerBankList.find(el=>el.uid===item);
    this.receiveledger = findreceive;
    this.recieptvoucher.name = findreceive.name, 
    this.recieptvoucher.bank_name = findreceive.bank_name,
    this.recieptvoucher.bank_account_number = findreceive.bank_account_number, 
     this.recieptvoucher.bank_ifsc = findreceive.ifsc, 
    this.recieptvoucher.receive_id = this.receiveledger.uid;
    if(findreceive.account_group.name == 'cash'){
      this.recieptvoucher.receive_type = "cash";
    }else{
      this.recieptvoucher.receive_type = "bank";
    }
  }

  async getLedgerDataclick(item){
    let findledger = await this.ledgerList.find(el=>el.uid===item);
    this.ledger = findledger;
    this.recieptvoucher.ledger_id = this.ledger.uid;
  }

  Update(){    
    this.recieptvoucher.invoice_date = moment(this.recieptvoucher.invoice_date).format('MM-DD-YYYY');
    this.receiptvoucherService.editReceiptVoucher(this.recieptvoucher).subscribe(data => {
      this.router.navigate(['admin/receipt']);
    if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
       this.modalService.dismissAll();
       this.recieptvoucher = {};
       this.router.navigate(['admin/printreceiptvoucher', this.uidvoucherprint]);
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  
}
