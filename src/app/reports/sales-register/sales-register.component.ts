
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
  selector: 'app-sales-register',
  templateUrl: './sales-register.component.html',
  styleUrls: ['./sales-register.component.css']
})
export class SalesRegisterComponent implements OnInit {

  activecompany : any;
  current_periad_startdate : any ;
  current_periad_enddate : any;
  corrent_date_valid : any ;
  current_book : any ;
  selectedtype : any = [{}];
  total_amount: Number = 0;
  ledgerReportList:any = [];
  ledgerBankList:any = [];
  header:any = [];
  loader = true ;
  imgbaseurl="";
  dataNotFount = true ;
  Total_Amount_sum: Number = 0;

  ledgerreport:any = {
    company_id:'',
    start_date:'',
    end_date:'',
    type:"sales_register",
  };

  
  constructor(private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public globals: Globals,public reportLedgerService:ReportLedgerService, public itemsService:ItemsService,public router:Router,config: NgbModalConfig, private modalService: NgbModal, public route:ActivatedRoute,public dialog: MatDialog) {   }

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

    this.ledgerreport.start_date =  new Date(this.current_periad_startdate);
    this.current_periad_enddate = new Date(this.activecompany.current_period_end);
    this.ledgerreport.end_date = new Date(this.current_periad_enddate);
    this.ledgerreport.company_id = this.localStorageService.getCompanyId();

    if ( this.ledgerreport.start_date && this.ledgerreport.end_date ) {
      this.ledgerreportshow();
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

  async ledgerreportshow(){
    this.loader = true;
    this.dataNotFount = true;
    this.ledgerreport.start_date = moment(this.ledgerreport.start_date).format('YYYY-MM-DD');
    this.ledgerreport.end_date = moment(this.ledgerreport.end_date).format('YYYY-MM-DD');
    
    this.reportLedgerService.salesregisterReport(this.ledgerreport).subscribe(async data => {
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
