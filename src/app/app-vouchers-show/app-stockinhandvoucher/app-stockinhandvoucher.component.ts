import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LedgerService} from './../../service/ledger.service';
import { LocalStorageService } from './../../service/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService} from './../../service/items.service';
import { AppallvoucherprintService } from 'src/app/service/appallvoucherprint.service';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppErrorShowComponent } from '../../app-vouchers-show/app-error-show/app-error-show.component';
import {MatDialog} from '@angular/material/dialog';
import Utils from './../../utils/utils';
import * as moment from 'moment';


var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];


@Component({
  selector: 'app-app-stockinhandvoucher',
  templateUrl: './app-stockinhandvoucher.component.html',
  styleUrls: ['./app-stockinhandvoucher.component.css']
})
export class AppStockinhandvoucherComponent implements OnInit {

  
  
  activecompany : any;
  imgbaseurl="";
  public data : any;
  ledgerList:any = [];
  showledger:boolean = false;
  journalvoucherlist:any = [];
  users: any[] = [0];
  banklist:any = [];
  ledgers: any = [{}];
  VoucherID:any;
  StockID:any;
  ledgerBankList:any = [];
  amountconvert:any = '0';
  JournalVoucher : any = [];
  current_periad_startdate : any ;
  current_periad_enddate : any;
  bank_ledger:any;
  ledger:any = {};
  activeuser:any;
  stockledger:any = [];
  itemList:any = [];
  items: any = [{}];
  // ledgers: any = [{}];
  clicked = false;  
  select_composition : boolean = false;
  corrent_date_valid : any ;
  current_book : any ;

  id: string;
  type: string;
  vtype: string;
  token:string; 
  userId : any;
  Userdata:any =[];
  voucherAppshow: boolean = true;

  stockinhand:any = {
    itemAdd  :[],
    invoice_date:'',
    company_id:'',
    purpose_id:'7',
    ledger_id:'',
    voucher_type:"stockJournalVoucher",
    narration:"",
    type:"",
    total_amount:'0',
  };

   
  constructor(private messagePanelService: MessagePanelService,private appallvoucherprintService: AppallvoucherprintService,private router: Router,private localStorageService: LocalStorageService, public globals: Globals, private route: ActivatedRoute, public ledgerService:LedgerService, public itemsService:ItemsService,
    private modalService: NgbModal,public dialog: MatDialog) { 
  }

  inWords (amountconvert) {
    if ((amountconvert = amountconvert.toString()).length > 9) return 'overflow';
    let n = ('000000000' + amountconvert).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; let str = '';
    str += (Number(n[1]) != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (Number(n[2]) != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (Number(n[3]) != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (Number(n[4]) != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (Number(n[5]) != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
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

  async ngOnInit() {
    this.imgbaseurl=this.localStorageService.getBaseUrl();
    await this.route.queryParams.subscribe((params) => {

    this.id = params['id'] ? params['id'] : null;
    this.type = params['type'] ? params['type'] : null;
    this.vtype = params['vtype'] ? params['vtype'] : null;
    this.token = params['token'] ? params['token'] : null;

    if(this.id != null && this.type != null  && this.vtype != null  && this.token != null ){
      
      if(this.token && this.type == "current" && this.id != '' && this.vtype == "itemstockvoucher"){
        this.vouchershow();
      }
      // else if(this.token && this.type == "next" && this.id != '' && this.vtype == "itemstockvoucher"){
      //   this.Nextvoucherprint();
      // }else if(this.token && this.type == "previos" && this.id != '' && this.vtype == "itemstockvoucher"){
      //   this.Previousvoucherprint();
      // }
      else{
        this.voucherAppshow = false;
        this.dialog.open(AppErrorShowComponent, { width: '800px', disableClose: true, hasBackdrop:true ,data:{}});
      }
    }else{
      this.voucherAppshow = false;
      this.dialog.open(AppErrorShowComponent, { width: '800px', disableClose: true, hasBackdrop:true ,data:{}});
    }     
  });
}

  async vouchershow(){
  await this.appallvoucherprintService.getstockinhand({token:this.token,voucher_id:this.id}).subscribe(async(data) => {
    if (data === null || data === undefined) {
      this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
    } else if (data['success'] == true) {
      this.stockinhand = data.ItemStockVoucher;
      // this.id = this.stockinhand.uid; 
      this.amountconvert = data.ItemStockVoucher.total_amount;
      this.items =await data.ItemStockVoucher.item_stock_voucher_entries && data.ItemStockVoucher.item_stock_voucher_entries.length>0?data.ItemStockVoucher.item_stock_voucher_entries:[];
        
      } else if (data['statusCode'] == 400) {
        this.voucherAppshow = false;
        this.dialog.open(AppErrorShowComponent, { width: '800px', disableClose: true, hasBackdrop:true ,data:{}});
      // this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
    } else {
      this.voucherAppshow = false;
      this.dialog.open(AppErrorShowComponent, { width: '800px', disableClose: true, hasBackdrop:true ,data:{}});
      // this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
    }
  });
}

 
// Nextvoucherprint(){
//   this.appallvoucherprintService.NextVoucherGet({token:this.token,id:this.id,type:this.vtype}).subscribe(async data => {
//   if (data === null || data === undefined) {
//     this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
//   } else if (data['success'] === true) {
//       this.stockinhand = data.JournalVoucher; 
//       // this.id = this.stockinhand.uid;
//       this.amountconvert = this.stockinhand.total_amount; 
//       // this.ledger= data.stockinhand.VoucherLedger;
//       this.items =await data.JournalVoucher.item_stock_voucher_entries && data.JournalVoucher.item_stock_voucher_entries.length>0?data.JournalVoucher.item_stock_voucher_entries:[];
            
//   } else if (data['statusCode'] == 400) {
//     this.voucherAppshow = false;
//     this.modalService.open(this.nodatafoundmodal, { size: 'lg', backdrop : 'static', keyboard : false });
//     // this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
//   } else {
//     this.voucherAppshow = false;
//     this.modalService.open(this.nodatafoundmodal, { size: 'lg', backdrop : 'static', keyboard : false });
//     // this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
//   }
// });
// }


// Previousvoucherprint(){
// this.appallvoucherprintService.PreviousVoucherGet({token:this.token,id:this.id,type:this.vtype}).subscribe(async data => {
//   if (data === null || data === undefined) {
//     this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
//   } else if (data['success'] === true) {
//       this.stockinhand = data.JournalVoucher;  
//       // this.id = this.stockinhand.uid;
//       this.amountconvert = this.stockinhand.total_amount;
//       // this.ledger= data.JournalVoucher.VoucherLedger;
//       this.items =await data.JournalVoucher.item_stock_voucher_entries && data.JournalVoucher.item_stock_voucher_entries.length>0?data.JournalVoucher.item_stock_voucher_entries:[];
            
//   } else if (data['statusCode'] == 400) {
//     this.voucherAppshow = false;
//     this.modalService.open(this.nodatafoundmodal, { size: 'lg', backdrop : 'static', keyboard : false });
//     // this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
//   } else {
//     this.voucherAppshow = false;
//     this.modalService.open(this.nodatafoundmodal, { size: 'lg', backdrop : 'static', keyboard : false });
//     // this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
//   }
// });

// }


}
