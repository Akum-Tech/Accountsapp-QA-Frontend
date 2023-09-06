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
  selector: 'app-app-bank-book',
  templateUrl: './app-bank-book.component.html',
  styleUrls: ['./app-bank-book.component.css']
})
export class AppBankBookComponent implements OnInit {
  
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

    if(this.id != null && this.cid != null && this.start_date != null && this.end_date != null  && this.rtype != null  && this.token != null ){
      
        if(this.token &&  this.id != '' && this.cid != '' && this.start_date != '' && this.end_date != ''  && this.rtype == "bank"){
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

    this.appReportsAllService.allreportshow({token:this.token,company_id: this.cid,ledger_id:this.id,start_date:this.start_date,end_date:this.end_date,type:this.rtype}).subscribe(data => {
        if (data === null || data === undefined) {this.messagePanelService.ShowPopupMessageWithLocalization
          ("An error occured, please try again later",this.globals.messageCloseTime,this.globals.messageType.error);
        } else if (data["success"] == true) {

          this.ledgerReportList = data.JournalVoucher;
          this.balancesum = 0;
          this.debitsum = 0;
          this.creditsum = 0;
          this.convernumber = 0;

          this.ledgerReportList.map(
            (ele, i) => (
              (ele["debitnumber"] = Utils.converttocomaawithdecimal(
                ele["debitAmount"]
              )),
              (ele["creditnumber"] = Utils.converttocomaawithdecimal(
                ele["creditAmount"]
              ))
            )
          );

          this.ledgerReportList.forEach(element => {
            this.balancesum =
              Utils.convertIntoNumber(this.balancesum) +
              Utils.convertIntoNumber(
                Utils.convertIntoNumber(element.debitAmount) -
                  Utils.convertIntoNumber(element.creditAmount)
              );
            if (this.balancesum < 0) {
              this.convernumber = Utils.converttocomaawithdecimal(
                Utils.convertIntoNumber(-1) *
                  Utils.convertIntoNumber(this.balancesum)
              );
            } else {
              this.convernumber = Utils.converttocomaawithdecimal(
                Utils.convertIntoNumber(this.balancesum)
              );
            }
          });

          this.ledgerReportList.forEach((element, index) => {
            this.debitsum =
              Utils.convertIntoNumber(this.debitsum) +
              Utils.convertIntoNumber(element.debitAmount);
            this.creditsum =
              Utils.convertIntoNumber(this.creditsum) +
              Utils.convertIntoNumber(element.creditAmount);
          });

          this.debitshowsum = Utils.converttocomaawithdecimal(this.debitsum);
          this.creditshowsum = Utils.converttocomaawithdecimal(this.creditsum);
        } else if (data["statusCode"] == 400) {  
          this.dataNotFount = false;
          this.messagePanelService.ShowPopupMessageWithLocalization(data["message"],this.globals.messageCloseTime,this.globals.messageType.success);
        } else {
          
          this.dataNotFount = false;
          this.messagePanelService.ShowPopupMessageWithLocalization(data["message"],this.globals.messageCloseTime,this.globals.messageType.error);
        }
      });
  }

  callbalance(object, index){
    if(object){
      let total_blance = 0;
      if(index===0){
        this.ledgerReportList[index].total_blance= Utils.convertIntoNumber (Utils.convertIntoNumber (object.debitAmount) - Utils.convertIntoNumber(object.creditAmount));
           return  this.ledgerReportList[index].total_blance;
      }else{
        let creditamount=Utils.convertIntoNumber(object.creditAmount);
        if(creditamount>0){
           this.ledgerReportList[index].total_blance =  Utils.convertIntoNumber(this.ledgerReportList[index-1].total_blance) - Utils.convertIntoNumber(object.creditAmount);
          return  this.ledgerReportList[index].total_blance;
        }else{
          this.ledgerReportList[index].total_blance = Utils.convertIntoNumber(this.ledgerReportList[index-1].total_blance) + Utils.convertIntoNumber(object.debitAmount);
          return  this.ledgerReportList[index].total_blance;
          //return  Utils.converttocomaawithdecimal(this.ledgerReportList[index].total_blance);
        }
      }
    }else{
      return 0;
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
