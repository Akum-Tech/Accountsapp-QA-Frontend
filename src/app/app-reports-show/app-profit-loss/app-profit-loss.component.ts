import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from './../../service/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppReportErrorComponent } from '../../app-reports-show/app-report-error/app-report-error.component';
import {MatDialog} from '@angular/material/dialog';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import Utils from "./../../utils/utils";
import * as moment from "moment";

import { AppReportsAllService } from '../../service/app-reports-all.service';

@Component({
  selector: 'app-app-profit-loss',
  templateUrl: './app-profit-loss.component.html',
  styleUrls: ['./app-profit-loss.component.css']
})
export class AppProfitLossComponent implements OnInit {

 
 
  profitlossList:any = [];

  imgbaseurl="";  
  id: string;
  cid:string;
  rtype: string;
  start_date:string;
  end_date:string;
  token:string; 
  name:string;
  dataNotFount: boolean = true;
 
  openingvalue:any;
  closingvalue:any;
  purchasesum: Number = 0 ;
  salessum: Number = 0 ;
  directexpencesum: Number = 0 ;
  indirectexpencesum: Number = 0 ;
  directincomesum: Number = 0 ;
  indirectincomesum: any = 0 ;
  grossprofitsum_opening: any = 0 ;
  grossprofitsum_closing: any = 0;  
  grossprofit_co: any = 0;
  finalsum_opening: any = 0 ;
  finalsum_closing: any = 0 ;
  netprofit: any = 0 ;
  loader = true ;

  constructor(private localStorageService: LocalStorageService,private route: ActivatedRoute,public dialog: MatDialog,
    public appReportsAllService:AppReportsAllService,private messagePanelService: MessagePanelService, public globals: Globals,) { }

  async ngOnInit() {
    this.imgbaseurl=this.localStorageService.getBaseUrl();
    await this.route.queryParams.subscribe((params) => {

    this.cid =  params['cid'] ? params['cid'] : null;
    this.start_date = params['start_date'] ? params['start_date'] : null;
    this.end_date = params['end_date'] ? params['end_date'] : null;
    this.token = params['token'] ? params['token'] : null;

    if(this.cid != null && this.start_date != null && this.end_date != null && this.token != null ){
      
        if(this.token &&  this.cid != '' && this.start_date != '' && this.end_date != ''){
          this.reportshow();
        }
        else{
          this.dataNotFount = false;
          this.dialog.open(AppReportErrorComponent, { width: '800px', disableClose: true, hasBackdrop:true ,data:{}});
        }
      }else{
        this.dataNotFount = false;
        this.dialog.open(AppReportErrorComponent, { width: '800px', disableClose: true, hasBackdrop:true ,data:{}});
      }     
    });
  }

  
  reportshow(){  
    
    this.end_date = moment(this.end_date).format("YYYY-MM-DD");
    this.start_date = moment(this.start_date).format("YYYY-MM-DD");
   
   this.appReportsAllService.profitlossreport({token:this.token,company_id: this.cid,start_date:this.start_date,end_date:this.end_date}).subscribe(data => {
    if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        this.profitlossList = data.sheetdata;
        
        this.openingvalue = this.profitlossList.openingStock;
        this.closingvalue = this.profitlossList.closeingStock;
        
        this.purchasesum = 0;
        this.salessum = 0 ;
        this.directexpencesum = 0 ;
        this.indirectexpencesum = 0 ;
        this.directincomesum = 0 ;
        this.indirectincomesum = 0 ;
        this.grossprofitsum_opening = 0 ;
        this.grossprofitsum_closing = 0 ;
        this.grossprofit_co = 0 ;
        this.finalsum_opening = 0 ;
        this.finalsum_closing = 0 ;
        this.netprofit = 0 ;

        // PurchaseAccount --------------------------------------
        this.profitlossList.PurchaseAccount.forEach((element) => {            
          this.purchasesum = Number(this.purchasesum) + Number ( Number(element.total_amount));
        });

        // SaleAccount --------------------------------------
        this.profitlossList.SaleAccount.forEach((element) => {
            this.salessum = Number(this.salessum) + Number ( Number(element.total_amount));
        });

        // directExpense --------------------------------------
        this.profitlossList.directExpense.forEach((element) => {
            this.directexpencesum = Number(this.directexpencesum) + Number ( Number(element.total_amount));
        });

        // directIncome --------------------------------------
        this.profitlossList.directIncome.forEach((element) => {
            this.directincomesum = Number(this.directincomesum) + Number ( Number(element.total_amount));
        });

        // indirectExpense --------------------------------------
        this.profitlossList.indirectExpense.forEach((element) => {
            this.indirectexpencesum = Number(this.indirectexpencesum) + Number ( Number(element.total_amount));
        });

        // indirectIncome --------------------------------------
        this.profitlossList.indirectIncome.forEach((element) => {
            this.indirectincomesum = Number(Number(this.indirectincomesum) +  Number(element.total_amount)).toFixed(2);
        });

        // GrossProfit Opening Closing Sum --------------------------------------
        this.grossprofitsum_opening = Number(Number(this.openingvalue) + Number(this.purchasesum) + Number(this.directexpencesum)).toFixed(2) ;
        this.grossprofitsum_closing = Number(Number(this.closingvalue) + Number(this.salessum) + Number(this.directincomesum)).toFixed(2) ;
        
        // Gross_Profit C/O Sum --------------------------------------
        this.grossprofit_co =  Number(Number(this.grossprofitsum_closing) - Number(this.grossprofitsum_opening)).toFixed(2);
       
        // FINAL TOTAL --------------------------------------
        this.finalsum_opening = Number(this.indirectexpencesum).toFixed(2);

        this.finalsum_closing = Number(Number(this.grossprofit_co ) + Number(this.indirectincomesum));

        // NET PROFIT --------------------------------------------
          this.netprofit = Number(Number(this.finalsum_closing ) - Number(this.finalsum_opening)).toFixed(2);
        
      } else if (data['statusCode'] == 400) {
        this.dataNotFount = false;
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.dataNotFount = false;
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
