import { Component, OnInit} from '@angular/core';
import { LedgerService} from './../../service/ledger.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { ItemsService} from './../../service/items.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportLedgerService } from 'src/app/service/report-ledger.service';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import * as moment from 'moment';
import Utils from './../../utils/utils';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.css']
})
export class BalanceSheetComponent implements OnInit {

  activecompany : any;
  current_periad_startdate : any ;
  current_periad_enddate : any;
  corrent_date_valid : any ;
  current_book : any ;
  balancesheetlist:any = [];
  ledger:any = { };
  loader = true ;
  imgbaseurl="";
  dataNotFount = true ;
  
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

  balancesheetreport:any = {
    company_id:'',
    start_date:'',
    end_date:'',
  };
  
  constructor(private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public globals: Globals, public ledgerService:LedgerService,public reportLedgerService:ReportLedgerService, public itemsService:ItemsService,public router:Router,config: NgbModalConfig, private modalService: NgbModal, public route:ActivatedRoute,public dialog: MatDialog) { }
  
   
  ngOnInit() {
    this.imgbaseurl=this.localStorageService.getBaseUrl();
    this.activecompany=this.localStorageService.getCompanyInfo();

    this.current_book = new Date(this.activecompany.bookstart_date);
    this.corrent_date_valid = new Date(this.activecompany.current_period_start);

    if(this.current_book >= this.corrent_date_valid){
      this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
    }else{
      this.current_periad_startdate = new Date(this.activecompany.current_period_start);
    }

    this.balancesheetreport.start_date =  new Date(this.current_periad_startdate);
    this.current_periad_enddate = new Date(this.activecompany.current_period_end);
    this.balancesheetreport.end_date = new Date(this.current_periad_enddate);
    this.balancesheetreport.company_id = this.localStorageService.getCompanyId();
    
    if ( this.balancesheetreport.start_date && this.balancesheetreport.end_date ) {
      this.balancesheetshow();
    }
    // this.loader = false;
  }

  async balancesheetshow(){
    this.loader = true;
    this.dataNotFount = true;

    this.balancesheetreport.start_date = moment(this.balancesheetreport.start_date).format('YYYY-MM-DD');
    this.balancesheetreport.end_date = moment(this.balancesheetreport.end_date).format('YYYY-MM-DD');
    
    this.reportLedgerService.getbalancesheet(this.balancesheetreport).subscribe(data => {
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

         
          this.loader = false;
          this.dataNotFount = false;

        } else if (data['statusCode'] == 400) {
          this.loader = false;
          this.dataNotFount = false;
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.loader = false;
          this.dataNotFount = false;
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
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
            table-borderset{
              border: 1.5px #00000078 solid;
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
            .font-right-set{
              text-align: right;
            }
        </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
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
