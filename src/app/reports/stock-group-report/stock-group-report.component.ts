
import { Component, OnInit} from '@angular/core';
import { MessagePanelService } from './../../service/message-panel.service';
import { ItemsService} from './../../service/items.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportLedgerService } from 'src/app/service/report-ledger.service';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import * as moment from 'moment';
import Utils from "./../../utils/utils";

@Component({
  selector: 'app-stock-group-report',
  templateUrl: './stock-group-report.component.html',
  styleUrls: ['./stock-group-report.component.css']
})
export class StockGroupReportComponent implements OnInit {

  activecompany : any;
  current_periad_startdate : any ;
  current_periad_enddate : any;
  corrent_date_valid : any ;
  current_book : any ;
  selectedtype = '';
  total_amount: Number = 0;
  dayBookList:any = [];
  ledgerBankList:any = [];
  ledger:any = { };
  loader = true ;
  imgbaseurl="";
  dataNotFount = true ;

  dayBook:any = {
    company_id:'',
    start_date:'',
    end_date:'',
    type:"day_book",
  };
  
  constructor(private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public globals: Globals,public reportLedgerService:ReportLedgerService, public itemsService:ItemsService,public router:Router,config: NgbModalConfig, private modalService: NgbModal, public route:ActivatedRoute,public dialog: MatDialog) { 
    }

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

    this.dayBook.start_date =  new Date(this.current_periad_startdate);
    this.current_periad_enddate = new Date(this.activecompany.current_period_end);
    this.dayBook.end_date = new Date(this.current_periad_enddate);
    this.dayBook.company_id = this.localStorageService.getCompanyId();

       
    if ( this.dayBook.start_date && this.dayBook.end_date ) {
      this.dayBookshow();
    }

    // this.loader = false;
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
  async dayBookshow(){
        this.loader = true;
        this.dataNotFount = true;
    this.dayBook.start_date = moment(this.dayBook.start_date).format('YYYY-MM-DD');
    this.dayBook.end_date = moment(this.dayBook.end_date).format('YYYY-MM-DD');
    
    this.reportLedgerService.daybookregisterReport(this.dayBook).subscribe(data => {
      if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
         this.dayBookList = data.JournalVoucher;
          this.dayBookList.map(
            (ele, i) => (
              (ele["debitnumber"] = Utils.converttocomaawithdecimal(
                ele["debitAmount"]
              )),
              (ele["creditnumber"] = Utils.converttocomaawithdecimal(
                ele["creditAmount"]
              ))
            )
          );


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
            table{
              border: 1px #ccc solid;
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

            .main-group{
              text-align: left !important;
            }
            .sub-group{
              text-align: center !important;
            }
            .ledger-group{
              text-align: right !important;
              font-weight: 100 !important;
              font-family:'Gilroy-Light' !important;
            }
            .none-font-family{
              font-family: 'Gilroy-Light' !important;
            }
        </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
}

}
