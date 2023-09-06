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
  selector: 'app-app-purhcasevoucherprint',
  templateUrl: './app-purhcasevoucherprint.component.html',
  styleUrls: ['./app-purhcasevoucherprint.component.css']
})
export class AppPurhcasevoucherprintComponent implements OnInit {

  
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
  firstNumber:any = '0';
  secondNumber:any = '0';

  imgbaseurl="";

  id: string;
  type: string;
  vtype: string;
  token:string; 
  userId : any;
  Userdata:any =[];
  voucherAppshow: boolean = true;

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

  async ngOnInit() {
  this.imgbaseurl=this.localStorageService.getBaseUrl();
    await this.route.queryParams.subscribe((params) => {

    this.id = params['id'] ? params['id'] : null;
    this.type = params['type'] ? params['type'] : null;
    this.vtype = params['vtype'] ? params['vtype'] : null;
    this.token = params['token'] ? params['token'] : null;

    if(this.id != null && this.type != null  && this.vtype != null  && this.token != null ){
      
      if(this.token && this.type == "current" && this.id != '' && this.vtype == "purchasevoucher"){
        this.vouchershow();
      }
      // else if(this.token && this.type == "next" && this.id != '' && this.vtype == "purchasevoucher"){
      //   this.Nextvoucherprint();
      // }else if(this.token && this.type == "previos" && this.id != '' && this.vtype == "purchasevoucher"){
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
    await this.appallvoucherprintService.getpurchasevoucher({token:this.token,voucher_id:this.id}).subscribe(async(data) => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        this.purchasevoucher = data.PurchaseVoucher;
        // this.id = this.purchasevoucher.uid;
        // console.log("--------VOUCHER ID current-----------",this.id);
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
          this.voucherAppshow = false;
          const dialogRef =this.dialog.open(AppErrorShowComponent, { width: '800px', disableClose: true, hasBackdrop:true ,data:{}});
        } else {
        this.voucherAppshow = false;
        const dialogRef =this.dialog.open(AppErrorShowComponent, { width: '800px', disableClose: true, hasBackdrop:true ,data:{}});
      }
    });
  }

  // Nextvoucherprint(){
  //     this.appallvoucherprintService.NextVoucherGet({token:this.token,id:this.id,type:this.vtype}).subscribe(async data => {
  //     if (data === null || data === undefined) {
  //       this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
  //     } else if (data['success'] === true) {
  //         this.purchasevoucher = data.PurchaseVoucher;   
  //         // this.id = this.purchasevoucher.uid;
  //         // console.log("--------VOUCHER ID next-----------",this.id);
  //         this.amountconvert =this.purchasevoucher.total_amount;
  //         this.ledger= data.PurchaseVoucher.PurchaseLedger;
  //         this.bank_ledger= data.PurchaseVoucher.Bank;
  //         this.showledger = true;
  //         this.showbankledger = true;
  //         this.items =await data.PurchaseVoucher.item_entries && data.PurchaseVoucher.item_entries.length>0?data.PurchaseVoucher.item_entries:[];
  //         this.taxesdata =await data.PurchaseVoucher.tax_entries && data.PurchaseVoucher.tax_entries.length>0?data.PurchaseVoucher.tax_entries:[];

  //         this.taxesdata.forEach((element, index) => {
  //           this.taxesamouneadd = Number(Number(this.taxesamouneadd) + Number(element.amount)).toFixed(2);
  //         });

  //         this.items.map(
  //           (ele, i) => (
  //             (ele["taxamount"] = 
  //               Number(Number(Number(ele["total_amount"]) * Number(ele["igst_tax"]))/100).toFixed(2)
  //             ),
  //             (ele["Total_sum_Item"] = 
  //               Number(Number(ele["total_amount"]) + Number(ele["taxamount"])).toFixed(2)
  //             )
  //           )
  //         );

  //         this.selectedlocal = data.PurchaseVoucher.is_local;
  //         this.selectbank =  data.PurchaseVoucher.is_bank;
  //         this.select_teamsconditions = data.PurchaseVoucher.description;
  //         this.select_narration = data.PurchaseVoucher.narration;
    
  //     } else if (data['statusCode'] == 400) {
  //       this.voucherAppshow = false;
  //       this.modalService.open(this.nodatafoundmodal, { size: 'lg', backdrop : 'static', keyboard : false });
  //     } else {
  //       this.voucherAppshow = false;
  //       this.modalService.open(this.nodatafoundmodal, { size: 'lg', backdrop : 'static', keyboard : false });
  //      }
  //   });
  // }

  // Previousvoucherprint(){
  //   this.appallvoucherprintService.PreviousVoucherGet({token:this.token,id:this.id,type:this.vtype}).subscribe(async data => {
  //     if (data === null || data === undefined) {
  //       this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
  //     } else if (data['success'] === true) {
  //         this.purchasevoucher = data.PurchaseVoucher;   
  //         // this.id = this.purchasevoucher.uid;  
  //         // console.log("--------VOUCHER ID previos-----------",this.id);
  //         this.amountconvert = this.purchasevoucher.total_amount;
  //         this.ledger= data.PurchaseVoucher.PurchaseLedger;
  //         this.bank_ledger= data.PurchaseVoucher.Bank;
  //         this.showledger = true;
  //         this.showbankledger = true;
  //         this.items =await data.PurchaseVoucher.item_entries && data.PurchaseVoucher.item_entries.length>0?data.PurchaseVoucher.item_entries:[];
  //         this.taxesdata =await data.PurchaseVoucher.tax_entries && data.PurchaseVoucher.tax_entries.length>0?data.PurchaseVoucher.tax_entries:[];

  //         this.taxesdata.forEach((element, index) => {
  //           this.taxesamouneadd = Number(Number(this.taxesamouneadd) + Number(element.amount)).toFixed(2);
  //         });

  //         this.items.map(
  //           (ele, i) => (
  //             (ele["taxamount"] = 
  //               Number(Number(Number(ele["total_amount"]) * Number(ele["igst_tax"]))/100).toFixed(2)
  //             ),
  //             (ele["Total_sum_Item"] = 
  //               Number(Number(ele["total_amount"]) + Number(ele["taxamount"])).toFixed(2)
  //             )
  //           )
  //         );

  //         this.selectedlocal = data.PurchaseVoucher.is_local;
  //         this.selectbank =  data.PurchaseVoucher.is_bank;
  //         this.select_teamsconditions = data.PurchaseVoucher.description;
  //         this.select_narration = data.PurchaseVoucher.narration;
    
  //     } else if (data['statusCode'] == 400) {
  //       this.voucherAppshow = false;
  //       this.modalService.open(this.nodatafoundmodal, { size: 'lg', backdrop : 'static', keyboard : false });
  //       } else {
  //       this.voucherAppshow = false;
  //       this.modalService.open(this.nodatafoundmodal, { size: 'lg', backdrop : 'static', keyboard : false });
  //       }
  //   });
  // }


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
