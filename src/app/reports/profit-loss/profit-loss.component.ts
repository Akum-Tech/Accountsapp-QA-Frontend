
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
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.css']
})
export class ProfitLossComponent implements OnInit {

  activecompany : any;
  current_periad_startdate : any ;
  current_periad_enddate : any;
  corrent_date_valid : any ;
  current_book : any ;
  profitlossList:any = [];
  ledger:any = { };
  imgbaseurl="";

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
  dataNotFount = true ;

  profitlossreport:any = {
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

    this.profitlossreport.start_date =  new Date(this.current_periad_startdate);
    this.current_periad_enddate = new Date(this.activecompany.current_period_end);
    this.profitlossreport.end_date = new Date(this.current_periad_enddate);
    this.profitlossreport.company_id = this.localStorageService.getCompanyId();

    if ( this.profitlossreport.start_date && this.profitlossreport.end_date ) {
      this.profitandlossshow();
    }

    // this.loader = false;
  }

  async profitandlossshow(){
    this.loader = true;
    this.dataNotFount = true;
    this.profitlossreport.start_date = moment(this.profitlossreport.start_date).format('YYYY-MM-DD');
    this.profitlossreport.end_date = moment(this.profitlossreport.end_date).format('YYYY-MM-DD');
    
    this.reportLedgerService.profitlossreport(this.profitlossreport).subscribe(data => {
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
          
        this.loader = false;

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
