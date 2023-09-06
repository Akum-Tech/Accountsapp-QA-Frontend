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
  selector: 'app-app-sale-register',
  templateUrl: './app-sale-register.component.html',
  styleUrls: ['./app-sale-register.component.css']
})
export class AppSaleRegisterComponent implements OnInit {

  
  ledgerReportList: any = [];

  imgbaseurl="";  
  id: string;
  cid:string;
  rtype: string;
  start_date:string;
  end_date:string;
  token:string; 
  name:string;
  dataNotFount: boolean = true;
  
  debitsum: any = 0;
  creditsum: any = 0;
  balancesum: Number = 0;
  convernumber: any = 0;
  debitshowsum: any;
  creditshowsum: any;
  Total_Amount_sum: Number = 0;
  header:any = [];
  
 
  constructor(private localStorageService: LocalStorageService,private route: ActivatedRoute,public dialog: MatDialog,
    public appReportsAllService:AppReportsAllService,private messagePanelService: MessagePanelService, public globals: Globals,) { }

 
    async ngOnInit() {
      this.imgbaseurl=this.localStorageService.getBaseUrl();
      await this.route.queryParams.subscribe((params) => {
  
      this.cid =  params['cid'] ? params['cid'] : null;
      this.start_date = params['start_date'] ? params['start_date'] : null;
      this.end_date = params['end_date'] ? params['end_date'] : null;
      this.rtype = params['rtype'] ? params['rtype'] : null;
      this.token = params['token'] ? params['token'] : null;
  
      if(this.cid != null && this.start_date != null && this.end_date != null  && this.rtype != null  && this.token != null ){
        
          if(this.token &&  this.cid != '' && this.start_date != '' && this.end_date != ''  && this.rtype == "sales_register"){
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

     this.appReportsAllService.allreportshow({token:this.token,company_id: this.cid,start_date:this.start_date,end_date:this.end_date,type:this.rtype}).subscribe(data => {
        if (data === null || data === undefined) {
            this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
          } else if (data['success'] == true) {
           this.ledgerReportList = data.Voucher.data;
           this.header = data.Voucher.head;
            this.ledgerReportList.map((ele,i)=>(
               ele.showamount=Utils.converttocomaawithdecimal(ele.total_amount),
  
              ele['tax_entries'].map((ele2,j)=>(
                ele2.showamount=Utils.converttocomaawithdecimal(ele2.amount) 
              )),
               ele['item_entries'].map((ele3,j)=>(
                ele3.showprice=Utils.converttocomaawithdecimal(ele3.price) 
              ))
            ));
  
            this.Total_Amount_sum = 0 ;
          
            this.ledgerReportList.forEach(element => {            
              this.Total_Amount_sum = Utils.convertIntoNumber(this.Total_Amount_sum) + Utils.convertIntoNumber(element.total_amount);
            });
    
          } else if (data['statusCode'] == 400) {
            this.dataNotFount = false;
            this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
          } else {
            this.dataNotFount = false;
            this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
          }
        });
    }

    getValue(head, data){
      let match;
      if(head.flag==='local'){
        match = `sale-${head.flag}-${Number(head.key)*2}`;
        let value = data.find(element => element.ledger.name===match);
        if(value){
          return Utils.converttocomaawithdecimal(value.amount);
        }
      }else{
        match= `sale-${head.flag}-state-${head.key}`;
        let value = data.find(element => element.ledger.name===match);
        if(value){
          return Utils.converttocomaawithdecimal(value.amount);
        }
      }
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
