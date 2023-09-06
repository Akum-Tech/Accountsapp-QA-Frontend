import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LedgerService} from './../../service/ledger.service';
import { LocalStorageService } from './../../service/local-storage.service';
import { EditviewSalesVoucherService } from './../../service/editview-sales-voucher.service';
import { PurchaseinvoiceprintService } from './../../service/purchaseinvoiceprint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesVoucherService } from './../../service/sales-voucher.service';
import Utils from './../../utils/utils';
import { ItemsService} from './../../service/items.service';
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
import html2canvas from 'html2canvas'


@Component({
  selector: 'app-purchaseinvoiceprint',
  templateUrl: './purchaseinvoiceprint.component.html',
  styleUrls: ['./purchaseinvoiceprint.component.css']
})

export class PurchaseinvoiceprintComponent implements OnInit {
 
  @ViewChild('downloadpdf',{static: false})
  downloadpdf!: ElementRef;

  items: any = [{}];
  taxesdata: any = [{}];
  PurchaseVoucher : any = [];
  salesinvoiselist:any = [];
  ledgerBankList:any = [];
  ledgerList:any = [];
  VoucherID:any;
  activecompany : any;
  voucher_id:String = '';  
  showledger:boolean = false;
  showbankledger:boolean = false;
  showpurchasevoucher:boolean = false;
  select_composition : boolean = false;
  taxesamouneadd: any = 0 ;
  selectedlocal = '';
  selectbank ='';
  select_teamsconditions = '';
  select_narration = '';
  amountconvert:any = '0';
  imgbaseurl="";
  invoicelogo="";
  purchasevoucher:any = {
    itemAdd :[],
    invoice_date:new Date(),
    company_id:'',
    buyer_ledger_id:'',
    shipping_address:"",
    description:"",
    is_local: "no",
    is_bank: "no",
    discount_type:"",
    discount:"0"
  };
  public data : any;
  ledger:any;
  bank_ledger:any;
  itemList:any = [];
  constructor(private messagePanelService: MessagePanelService,private router: Router, private localStorageService: LocalStorageService,public salesVoucherService:SalesVoucherService,  public globals: Globals, public purchaseinvoiceprintService:PurchaseinvoiceprintService, private route: ActivatedRoute, public ledgerService:LedgerService, public itemsService:ItemsService) { 
    this.activecompany=this.localStorageService.getCompanyInfo();
    if(this.activecompany.company_logo_base64){
      this.invoicelogo="data:image/png;base64,"+this.activecompany.company_logo_base64;
    }
  }

  
  withDecimal(n) {
    var nums = n.toString().split('.')
    var whole = this.inWords(nums[0])
    if (nums.length == 2) {
        var fraction = this.inWords(nums[1])
        return whole + 'and ' + fraction;
    } else {
        return whole;
    }
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

downloadAsPDF(){
  let printContents;
  printContents = document.getElementById('print-section').innerHTML;
    var html = htmlToPdfmake( printContents , {
    tableAutoSize:true
  });
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download("af.pdf"); 
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
            font-size: 14px;
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
  this.PurchaseVoucher.invoice_date = moment(this.PurchaseVoucher.invoice_date).format('MM-DD-YYYY');
  this.select_composition =  this.activecompany.composition_dealer;
   await this.route.params.subscribe(async(params) => {
     await this.purchaseinvoiceprintService.getpurchasevoucher({voucher_id:params.uid}).subscribe(async(data) => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        this.purchasevoucher = data.PurchaseVoucher;
        this.VoucherID = this.purchasevoucher.uid;
        this.amountconvert = this.purchasevoucher.total_amount;
        this.ledger= data.PurchaseVoucher.PurchaseLedger;
        this.bank_ledger= data.PurchaseVoucher.Bank;
        this.showledger = true;
        this.showbankledger = true;
        this.items =await data.PurchaseVoucher.item_entries && data.PurchaseVoucher.item_entries.length>0?data.PurchaseVoucher.item_entries:[];
        this.taxesdata =await data.PurchaseVoucher.tax_entries && data.PurchaseVoucher.tax_entries.length>0?data.PurchaseVoucher.tax_entries:[];

        this.taxesdata.forEach((element, index) => {
          this.taxesamouneadd = Number(Number(this.taxesamouneadd) + Number(element.amount)).toFixed(2);
        });

        this.items.map(
          (ele, i) => (
            (ele["taxamount"] = 
              Number(Number(Number(ele["total_amount"]) * Number(ele["igst_tax"]))/100).toFixed(2)
            ),
            (ele["Total_sum_Item"] = 
              Number(Number(ele["total_amount"]) + Number(ele["taxamount"])).toFixed(2)
            )
          )
        );


        this.selectedlocal = data.PurchaseVoucher.is_local;
        this.selectbank =  data.PurchaseVoucher.is_bank;
        this.select_teamsconditions = data.PurchaseVoucher.description;
        this.select_narration = data.PurchaseVoucher.narration;

        } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
    });
  }

  Nextvoucherprint(){
      this.salesVoucherService.NextVoucherGet({id:this.VoucherID,type:"purchasevoucher"}).subscribe(async data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] === true) {
          this.purchasevoucher = data.PurchaseVoucher;   
          this.VoucherID = this.purchasevoucher.uid;
          this.amountconvert =this.purchasevoucher.total_amount;
          this.ledger= data.PurchaseVoucher.PurchaseLedger;
          this.bank_ledger= data.PurchaseVoucher.Bank;
          this.showledger = true;
          this.showbankledger = true;
          this.items =await data.PurchaseVoucher.item_entries && data.PurchaseVoucher.item_entries.length>0?data.PurchaseVoucher.item_entries:[];
          this.taxesdata =await data.PurchaseVoucher.tax_entries && data.PurchaseVoucher.tax_entries.length>0?data.PurchaseVoucher.tax_entries:[];
  
          this.taxesdata.forEach((element, index) => {
            this.taxesamouneadd = Number(Number(this.taxesamouneadd) + Number(element.amount)).toFixed(2);
          });

          this.items.map(
            (ele, i) => (
              (ele["taxamount"] = 
                Number(Number(Number(ele["total_amount"]) * Number(ele["igst_tax"]))/100).toFixed(2)
              ),
              (ele["Total_sum_Item"] = 
                Number(Number(ele["total_amount"]) + Number(ele["taxamount"])).toFixed(2)
              )
            )
          );

          this.selectedlocal = data.PurchaseVoucher.is_local;
          this.selectbank =  data.PurchaseVoucher.is_bank;
          this.select_teamsconditions = data.PurchaseVoucher.description;
          this.select_narration = data.PurchaseVoucher.narration;
     
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  Previousvoucherprint(){
    this.salesVoucherService.PreviousVoucherGet({id:this.VoucherID,type:"purchasevoucher"}).subscribe(async data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] === true) {
          this.purchasevoucher = data.PurchaseVoucher;   
          this.VoucherID = this.purchasevoucher.uid;  
          this.amountconvert = this.purchasevoucher.total_amount;
          this.ledger= data.PurchaseVoucher.PurchaseLedger;
          this.bank_ledger= data.PurchaseVoucher.Bank;
          this.showledger = true;
          this.showbankledger = true;
          this.items =await data.PurchaseVoucher.item_entries && data.PurchaseVoucher.item_entries.length>0?data.PurchaseVoucher.item_entries:[];
          this.taxesdata =await data.PurchaseVoucher.tax_entries && data.PurchaseVoucher.tax_entries.length>0?data.PurchaseVoucher.tax_entries:[];
  
          this.taxesdata.forEach((element, index) => {
            this.taxesamouneadd = Number(Number(this.taxesamouneadd) + Number(element.amount)).toFixed(2);
          });

          this.items.map(
            (ele, i) => (
              (ele["taxamount"] = 
                Number(Number(Number(ele["total_amount"]) * Number(ele["igst_tax"]))/100).toFixed(2)
              ),
              (ele["Total_sum_Item"] = 
                Number(Number(ele["total_amount"]) + Number(ele["taxamount"])).toFixed(2)
              )
            )
          );

          this.selectedlocal = data.PurchaseVoucher.is_local;
          this.selectbank =  data.PurchaseVoucher.is_bank;
          this.select_teamsconditions = data.PurchaseVoucher.description;
          this.select_narration = data.PurchaseVoucher.narration;
     
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
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
}