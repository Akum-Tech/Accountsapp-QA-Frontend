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
  selector: 'app-app-receiptprint',
  templateUrl: './app-receiptprint.component.html',
  styleUrls: ['./app-receiptprint.component.css']
})
export class AppReceiptprintComponent implements OnInit {

  
  activecompany : any;
  imgbaseurl="";
  public data : any;
  ledgerList:any = [];
  showledger:boolean = false;
  users: any[] = [0];
  banklist:any = [];
  amountconvert:any = '0';
  VoucherID:any;
  ledgerBankList:any = [];
  RecieptVoucher: any = [];
  current_periad_startdate : any ;
  current_periad_enddate : any;
  select_teamsconditions = '';
  bank_ledger:any;
  receive_id: any;
  ledger:any = {
    pin_code:''
  };

  id: string;
  type: string;
  vtype: string;
  token:string; 
  userId : any;
  Userdata:any =[];
  voucherAppshow: boolean = true;

  receiptvoucher:any = {
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
      
      if(this.token && this.type == "current" && this.id != '' && this.vtype == "recieptvoucher"){
        this.vouchershow();
      }
      // else if(this.token && this.type == "next" && this.id != '' && this.vtype == "recieptvoucher"){
      //   this.Nextvoucherprint();
      // }else if(this.token && this.type == "previos" && this.id != '' && this.vtype == "recieptvoucher"){
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
    await this.appallvoucherprintService.getReceiptVoucher({token:this.token,voucher_id:this.id}).subscribe(async(data) => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        this.receiptvoucher = data.RecieptVoucher;
        this.amountconvert = this.receiptvoucher.total_amount;
        this.ledger= data.RecieptVoucher.ReciptBuyer;
        // this.id = this.receiptvoucher.uid;
        this.select_teamsconditions = data.RecieptVoucher.description;
        } else if (data['statusCode'] == 400) {
          this.voucherAppshow = false;
          this.dialog.open(AppErrorShowComponent, { width: '800px', disableClose: true, hasBackdrop:true ,data:{}});
       } else {
        this.voucherAppshow = false;
        this.dialog.open(AppErrorShowComponent, { width: '800px', disableClose: true, hasBackdrop:true ,data:{}});
       }
    });
  }

  
  // Nextvoucherprint(){
  //   this.appallvoucherprintService.NextVoucherGet({token:this.token,id:this.id,type:this.vtype}).subscribe(data => {
  //   if (data === null || data === undefined) {
  //     this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
  //   } else if (data['success'] === true) {
  //       this.receiptvoucher = data.RecieptVoucher;   
  //       // this.id = this.receiptvoucher.uid;
  //       this.amountconvert = this.receiptvoucher.total_amount;
  //       this.ledger= data.RecieptVoucher.ReciptBuyer;
  //       this.select_teamsconditions = data.RecieptVoucher.description; 
  //   } else if (data['statusCode'] == 400) {
  //     this.voucherAppshow = false;
  //     this.modalService.open(this.nodatafoundmodal, { size: 'lg', backdrop : 'static', keyboard : false });
  //    } else {
  //     this.voucherAppshow = false;
  //     this.modalService.open(this.nodatafoundmodal, { size: 'lg', backdrop : 'static', keyboard : false });
  //   }
  // });
  // } 


  // Previousvoucherprint(){
  //   this.appallvoucherprintService.PreviousVoucherGet({token:this.token,id:this.id,type:this.vtype}).subscribe(data => {
  //     if (data === null || data === undefined) {
  //       this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
  //     } else if (data['success'] === true) {
  //         this.receiptvoucher = data.RecieptVoucher;   
  //         // this.id = this.receiptvoucher.uid;
  //         this.amountconvert = this.receiptvoucher.total_amount;
  //         this.ledger= data.RecieptVoucher.ReciptBuyer;
  //         this.select_teamsconditions = data.RecieptVoucher.description;    
  //     } else if (data['statusCode'] == 400) {
  //       this.voucherAppshow = false;
  //       this.modalService.open(this.nodatafoundmodal, { size: 'lg', backdrop : 'static', keyboard : false });
  //       // this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
  //     } else {
  //       this.voucherAppshow = false;
  //       this.modalService.open(this.nodatafoundmodal, { size: 'lg', backdrop : 'static', keyboard : false });
  //       // this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
  //     }
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
