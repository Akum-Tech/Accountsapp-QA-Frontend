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
  selector: 'app-app-group-reports',
  templateUrl: './app-group-reports.component.html',
  styleUrls: ['./app-group-reports.component.css']
})
export class AppGroupReportsComponent implements OnInit {

  group:any = {};
  total_open:any='0';
  total_open_cr:any='0';
  total_open_dr:any='0';
  total_debit:any="0";
  total_credit:any='0';
  total_close:any='0';
  total_close_sales:any='0';
  total_close_all:any='0';
  total_sum_cr:any='0';
  total_sum_dr:any='0';
  ledgerReportList:any = [];
  selectedType = '';

  imgbaseurl="";  
  id: string;
  cid:string;
  rtype: string;
  start_date:string;
  end_date:string;
  token:string; 
  name:string;
  dataNotFount: boolean = true;
  

  constructor(private localStorageService: LocalStorageService,private route: ActivatedRoute,public dialog: MatDialog,
    public appReportsAllService:AppReportsAllService,private messagePanelService: MessagePanelService, public globals: Globals,) { }

  async ngOnInit() {
    this.imgbaseurl=this.localStorageService.getBaseUrl();
    await this.route.queryParams.subscribe((params) => {

    this.id = params['id'] ? params['id'] : null;
    this.name = params['name'] ? params['name'] : null;
    this.cid =  params['cid'] ? params['cid'] : null;
    this.start_date = params['start_date'] ? params['start_date'] : null;
    this.end_date = params['end_date'] ? params['end_date'] : null;
    this.rtype = params['rtype'] ? params['rtype'] : null;
    this.token = params['token'] ? params['token'] : null;

    this.selectedType = this.name ;

    if(this.id != null && this.cid != null && this.start_date != null && this.end_date != null  && this.rtype != null  && this.token != null ){
      
        if(this.token &&  this.id != '' && this.cid != '' && this.start_date != '' && this.end_date != ''  && this.rtype == "group"){
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

    this.appReportsAllService.allreportshow({token:this.token,company_id: this.cid,account_id:this.id,start_date:this.start_date,end_date:this.end_date,type:this.rtype}).subscribe(data => {
      if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.ledgerReportList = data.JournalVoucher;
          this.total_open = 0;
          this.total_debit = 0;
          this.total_credit = 0;
          this.total_close = 0;
          this.total_close_sales = 0;
          this.total_open_cr = 0;
          this.total_open_dr = 0 ;
          this.total_close_all = 0 ;
          this.total_sum_cr = 0 ;
          this.total_sum_dr = 0 ;
          

          this.ledgerReportList.forEach(lel=>{
            if(lel.ishead || lel.ismain){
              this.total_open =  Utils.convertIntoNumber(this.total_open)+ Utils.convertIntoNumber(lel.open_amount);
               this.total_debit = Utils.sumoftwovalue(this.total_debit,lel.debitAmount); 
              this.total_credit = Utils.sumoftwovalue(this.total_credit,lel.creditAmount);
              if( Utils.convertIntoNumber(lel.closeing_amount)>=0){
                this.total_close =  Utils.convertIntoNumber(this.total_close)+ Utils.convertIntoNumber(lel.closeing_amount);
              }else{
                this.total_close =  Utils.convertIntoNumber(this.total_close)+ Utils.convertIntoNumber( Utils.convertIntoNumber(lel.closeing_amount));
              }

              this.total_sum_cr = (lel.open_type);
              this.total_sum_dr = (lel.accounttype);
            }
          })

          if(this.total_sum_dr == 'debit'){
            this.total_close = Utils.converttocomaawithdecimal(this.total_close)+' Dr.';
          }else{
            this.total_close = Utils.converttocomaawithdecimal(this.total_close) +' Cr.';
          }
          
          // this.total_sum_cr = Utils.convertIntoNumber(this.total_credit) + Utils.convertIntoNumber(this.total_open_cr);
          // this.total_sum_dr = Utils.convertIntoNumber(this.total_debit) + Utils.convertIntoNumber(this.total_open_dr);

          this.total_close_sales = Utils.convertIntoNumber(this.total_credit) - Utils.convertIntoNumber(this.total_debit);
          // this.total_close_all = Utils.convertIntoNumber(this.total_sum_cr) - Utils.convertIntoNumber(this.total_sum_dr);
          // this.total_open= Utils.convertIntoNumber(this.total_open_cr) - Utils.convertIntoNumber(this.total_open_dr);

          if( this.total_sum_cr == 'debit'){
            this.total_open = Utils.converttocomaawithdecimal(this.total_open)+' Dr.';
          }else{
            this.total_open = Utils.converttocomaawithdecimal(this.total_open) +' Cr.';
          }
          
        } else if (data['statusCode'] == 400) {
          this.dataNotFount = false;
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.dataNotFount = false;
          this.ledgerReportList = [];
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
  
  convertintoNumber(value){
    return Utils.converttocomaawithdecimal(value);
  }


}

