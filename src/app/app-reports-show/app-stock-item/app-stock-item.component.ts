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
  selector: 'app-app-stock-item',
  templateUrl: './app-stock-item.component.html',
  styleUrls: ['./app-stock-item.component.css']
})
export class AppStockItemComponent implements OnInit {

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
  
  stockItemList:any = [];
  item:any = { };
  total_amount: Number = 0;
  getunit : any;
  inwardItem: Number = 0 ;
  outwarditem: Number  = 0 ; 
  


  constructor(private localStorageService: LocalStorageService,private route: ActivatedRoute,public dialog: MatDialog,
    public appReportsAllService:AppReportsAllService,private messagePanelService: MessagePanelService, public globals: Globals,) { }

  async ngOnInit() {
    this.imgbaseurl=this.localStorageService.getBaseUrl();
    await this.route.queryParams.subscribe((params) => {

    this.id = params['id'] ? params['id'] : null;
    this.name = params['name'] ? params['name'] : null;
    this.start_date = params['start_date'] ? params['start_date'] : null;
    this.end_date = params['end_date'] ? params['end_date'] : null;
    this.token = params['token'] ? params['token'] : null;

    if(this.id != null && this.start_date != null && this.end_date != null && this.token != null ){
      
        if(this.token &&  this.id != '' && this.start_date != '' && this.end_date != ''){
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

   this.appReportsAllService.stockitemreport({token:this.token,item_id: this.id,start_date:this.start_date,end_date:this.end_date}).subscribe(data => {
      if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
         this.stockItemList = data.ItemStock;
        
         this.inwardItem = 0;
         this.outwarditem = 0;
         
         this.stockItemList.forEach((element, index) => {
           this.inwardItem =  (Number(this.inwardItem) + Number(element.inwards));
           this.outwarditem = (Number(this.outwarditem) + Number(element.outwards));
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

  
callitemstock(object, index){
  if(object){
    let total_blance = 0;
    if(index===0){
      this.stockItemList[index].total_blance= Number (Number(object.inwards) - Number(object.outwards));
      return this.stockItemList[index].total_blance;
    }else{
      if(object.type==='Debit' || object.type==='Purchase'){
         this.stockItemList[index].total_blance = Number( Number(this.stockItemList[index-1].total_blance) + Number(object.inwards)).toFixed(2);
        return this.stockItemList[index].total_blance;
      }else{
        this.stockItemList[index].total_blance = Number(Number(this.stockItemList[index-1].total_blance) - Number(object.outwards)).toFixed(2);
        return  this.stockItemList[index].total_blance;
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
