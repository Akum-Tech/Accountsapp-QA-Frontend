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
  selector: 'app-app-balance-sheet',
  templateUrl: './app-balance-sheet.component.html',
  styleUrls: ['./app-balance-sheet.component.css']
})
export class AppBalanceSheetComponent implements OnInit {

  balancesheetlist:any = [];

  imgbaseurl="";  
  id: string;
  cid:string;
  rtype: string;
  start_date:string;
  end_date:string;
  token:string; 
  name:string;
  dataNotFount: boolean = true;
 
  profitlossList:any = [];
  
  Fixed_Assets_sum: Number = 0 ;
  Current_Assets_sum: Number = 0 ;
  Bank_L_sum: any ;
  Bank_A_sum: Number = 0 ;
  Sundry_Debtors_sum: Number = 0 ;
  Sundry_Creditors_sum: Number = 0 ;
  Capital_Account_sum: any ;
  Current_Liabilities_sum: Number = 0 ;
  Taxes_sum: Number = 0 ;
  Cash_sum: Number = 0 ;
  Stock_in_Hand_sum: Number = 0 ;
  Current_Liabilities_totalsum: any ;
  Current_Assets_totalsum: Number = 0 ;
  total_opening: Number = 0 ;
  total_closing: any ;
  current_period: any = 0 ;
  Current_ProfitLoss: any =0;
  currentProfitlossvalue: any =0;
  lessamount : any = 0;
  oldProfitlossvalue: any =0;
  


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
   
   this.appReportsAllService.getbalancesheet({token:this.token,company_id: this.cid,start_date:this.start_date,end_date:this.end_date}).subscribe(data => {
    if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {

        this.balancesheetlist = data.sheetdatanewspace;   

        this.currentProfitlossvalue = this.balancesheetlist.currentProfitloss;
        this.oldProfitlossvalue = this.balancesheetlist.oldProfitloss;
        this.lessamount =this.balancesheetlist.less;

        this.Fixed_Assets_sum = 0 ;
        this.Current_Assets_sum = 0 ;
        this.Bank_L_sum = 0 ;
        this.Bank_A_sum = 0 ;
        this.Sundry_Debtors_sum = 0 ;
        this.Sundry_Creditors_sum = 0 ;
        this.Capital_Account_sum = 0 ;
        this.Current_Liabilities_sum = 0 ;
        this.Taxes_sum = 0 ;
        this.Cash_sum = 0 ;
        this.Stock_in_Hand_sum = 0 ;
        this.Current_Liabilities_totalsum = 0 ;
        this.Current_Assets_totalsum = 0 ;
        this.total_opening = 0 ;
        this.total_closing = 0 ;
        this.current_period = 0 ;
        this.Current_ProfitLoss = 0 ;

        // Fixed_Assets --------------------------------------
        this.balancesheetlist.Fixed_Assets.forEach((element) => {
          this.Fixed_Assets_sum = Number(this.Fixed_Assets_sum) + Number ( Number(element.amount));
        });

        //  Current_Assets --------------------------------------
         this.balancesheetlist.Current_Assets.forEach((element) => {
          this.Current_Assets_sum = Number(this.Current_Assets_sum) + Number ( Number(element.amount));
        });

         // Sundry_Debtors --------------------------------------
         this.balancesheetlist.Sundry_Debtors.forEach((element) => {
          this.Sundry_Debtors_sum = Number(this.Sundry_Debtors_sum) + Number ( Number(element.amount));
        });

         // Sundry_Creditors --------------------------------------
         this.balancesheetlist.Sundry_Creditors.forEach((element) => {
          this.Sundry_Creditors_sum = Number(this.Sundry_Creditors_sum) + Number ( Number(element.amount));
        });

         // Capital_Account --------------------------------------
         this.balancesheetlist.Capital_Account.forEach((element) => {
          this.Capital_Account_sum = Number(this.Capital_Account_sum) + Number ( Number(element.amount));
        });

         // Current_Liabilities --------------------------------------
         this.balancesheetlist.Current_Liabilities.forEach((element) => {
          this.Current_Liabilities_sum = Number(this.Current_Liabilities_sum) + Number ( Number(element.amount));
        });

        // Bank_A --------------------------------------
        this.balancesheetlist.Bank_A.forEach((element) => {
          this.Bank_A_sum = Number(this.Bank_A_sum) + Number ( Number(element.amount));
        });

        // Bank_L --------------------------------------
        this.balancesheetlist.Bank_L.forEach((element) => {
          this.Bank_L_sum = Number(this.Bank_L_sum) + Number ( Number(element.amount));
        });

         // Taxes --------------------------------------
         this.balancesheetlist.Taxes.forEach((element) => {
          this.Taxes_sum = Number(this.Taxes_sum) + Number ( Number(element.amount));
        });

         // Cash --------------------------------------
         this.balancesheetlist.Cash.forEach((element) => {
          this.Cash_sum = Number(this.Cash_sum) + Number ( Number(element.amount));
        });

         // Stock_in_Hand --------------------------------------
         this.balancesheetlist.Stock_in_Hand.forEach((element) => {
          this.Stock_in_Hand_sum = Number(this.Stock_in_Hand_sum) + Number ( Number(element.amount));
        });

         // Current_ProfitLoss + Profit & Loss --------------------------------------
         this.Current_ProfitLoss = Number(this.currentProfitlossvalue) + Number(this.oldProfitlossvalue) + Number(this.lessamount);


         // Current_Liabilities_totalsum - Current_Assets_totalsum -------------------------------------
        this.Current_Liabilities_totalsum = Number(this.Current_Liabilities_sum) + Number(this.Taxes_sum) + Number(this.Sundry_Creditors_sum);

        this.Current_Assets_totalsum = Number(this.Bank_A_sum) + Number(this.Stock_in_Hand_sum) + Number(this.Current_Assets_sum) + Number(this.Sundry_Debtors_sum) + Number(this.Cash_sum);

         // TOTAL SUM -------------------------------------- 
        this.total_opening = Number(this.Capital_Account_sum) + Number(this.Current_Liabilities_totalsum) +  Number(this.Bank_L_sum) + Number(this.Current_ProfitLoss);

        this.total_closing = Number(this.Fixed_Assets_sum) + Number(this.Current_Assets_totalsum); 

        
        // current_period --------------------------------------
        this.current_period = Number(this.total_closing) - Number(this.total_opening);

        
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
