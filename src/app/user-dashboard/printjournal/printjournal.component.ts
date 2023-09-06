import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LedgerService} from './../../service/ledger.service';
import { LocalStorageService } from './../../service/local-storage.service';
import { ViewjournalvoucherService } from './../../service/viewjournalvoucher.service';
import { JournalvoucherService } from './../../service/journalvoucher.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService} from './../../service/items.service';
import { SalesVoucherService } from './../../service/sales-voucher.service';
import Utils from './../../utils/utils';
// import $ from 'jquery';
import * as moment from 'moment';

var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

declare var require: any;

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import jspdf  from 'jspdf';  
import html2canvas from 'html2canvas'; 

@Component({
  selector: 'app-printjournal',
  templateUrl: './printjournal.component.html',
  styleUrls: ['./printjournal.component.css']
})
export class PrintjournalComponent implements OnInit {

  @ViewChild('downloadpdf',{static: false})
  downloadpdf!: ElementRef;

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

  journalvoucher:any = {
    itemAdd  :[],
    invoice_date:'',
    company_id:'',
    purpose_id:'',
    total_amount:'',
  };

  purpose_id: any;
  invoicelogo="";

constructor(private messagePanelService: MessagePanelService,private router: Router,private localStorageService: LocalStorageService, public globals: Globals,public salesVoucherService:SalesVoucherService,  private route: ActivatedRoute,public viewjournalvoucherService:ViewjournalvoucherService,public journalvoucherService:JournalvoucherService, public ledgerService:LedgerService, public itemsService:ItemsService) { 
    this.activecompany=this.localStorageService.getCompanyInfo();

  if(this.activecompany.company_logo_base64){
    this.invoicelogo="data:image/png;base64,"+this.activecompany.company_logo_base64;
  }

}

inWords (num) {
  if(num !== ''){
    if ((num = num.toString()).length > 9) return 'overflow';
    let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; let str = '';
    str += (Number(n[1]) != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (Number(n[2]) != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (Number(n[3]) != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (Number(n[4]) != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (Number(n[5]) != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
  }else{
    // 
  }
}


downloadAsPDF(){
  let printContents;
  printContents = document.getElementById('print-section').innerHTML;
    var html = htmlToPdfmake( printContents , {
    tableAutoSize:true
  });
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download("af.pdf"); 
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

printPage(): void {
let printContents, popupWin;
printContents = document.getElementById('print-section').innerHTML;
popupWin = window.open('', '_salf', 'top=0,left=0,height=100%,width=auto');
popupWin.document.open();
popupWin.document.write(`
  <html>
    <head>
      <title>Print tab</title>
      <style>
        @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
        @page {
          margin:20 auto;
        }
        -webkit-print-color-adjust;
        table{
          border: 1px #ccc solid;
        }
        .logo{
            background: #fff;
            border-radius: 3px;
            height: 80px;
            margin-right: 15px;
            width: 100px;
        }
        .printWrapper {
          width: 1000px;
          margin: auto;
          border: 1px solid #ccc;
          font-family: 'Roboto', sans-serif;
        }
        .company_name_set{
          font-family: 'Roboto', sans-serif;
          font-size: 15px;
          line-height: 26px;
          margin: 0;
        }
    </style>
    </head>
<body onload="window.print();window.close()">${printContents}</body>
  </html>`
);
popupWin.document.close();
}

getImage(image){
if(image){
  return this.imgbaseurl+image;
}else{
  // return "assets/images/logo.png";
}
}

async ngOnInit(){   
this.imgbaseurl=this.localStorageService.getBaseUrl();
  this.journalprint();

}

async journalprint(){
  // this.JournalVoucher.invoice_date = moment(this.JournalVoucher.invoice_date).format('MM-DD-YYYY');
  // this.stockinhand.invoice_date = moment(this.stockinhand.invoice_date).format('MM-DD-YYYY');
  await this.route.params.subscribe(async(params) => {
    await this.viewjournalvoucherService.getJournalVoucher({voucher_id:params.uid}).subscribe(async(data) => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        this.journalvoucher = data.JournalVoucher;
        this.VoucherID = this.journalvoucher.uid;
        this.amountconvert = this.journalvoucher.total_amount;
        this.ledger= data.JournalVoucher.VoucherLedger;
        this.ledgers =await data.JournalVoucher.journal_entries && data.JournalVoucher.journal_entries.length>0?data.JournalVoucher.journal_entries:[];
          
        } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  });
}

Nextvoucherprint(){
    this.salesVoucherService.NextVoucherGet({id:this.VoucherID,type:"journalvoucher"}).subscribe(async data => {
    if (data === null || data === undefined) {
      this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
    } else if (data['success'] === true) {
        this.journalvoucher = data.JournalVoucher; 
        this.VoucherID = this.journalvoucher.uid;
        this.amountconvert = this.journalvoucher.total_amount; 
        this.ledger= data.JournalVoucher.VoucherLedger;
        this.ledgers =await data.JournalVoucher.journal_entries && data.JournalVoucher.journal_entries.length>0?data.JournalVoucher.journal_entries:[];
              
    } else if (data['statusCode'] == 400) {
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
    } else {
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
    }
  });
}


Previousvoucherprint(){
  this.salesVoucherService.PreviousVoucherGet({id:this.VoucherID,type:"journalvoucher"}).subscribe(async data => {
    if (data === null || data === undefined) {
      this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
    } else if (data['success'] === true) {
        this.journalvoucher = data.JournalVoucher;  
        this.VoucherID = this.journalvoucher.uid; 
        this.amountconvert = this.journalvoucher.total_amount;
        this.ledger= data.JournalVoucher.VoucherLedger;
        this.ledgers =await data.JournalVoucher.journal_entries && data.JournalVoucher.journal_entries.length>0?data.JournalVoucher.journal_entries:[];
              
    } else if (data['statusCode'] == 400) {
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
    } else {
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
    }
  });

}

}
