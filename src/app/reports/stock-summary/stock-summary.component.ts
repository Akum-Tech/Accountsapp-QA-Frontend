
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
import Utils from "./../../utils/utils";


@Component({
  selector: 'app-stock-summary',
  templateUrl: './stock-summary.component.html',
  styleUrls: ['./stock-summary.component.css']
})
export class StockSummaryComponent implements OnInit {

  activecompany : any;
  current_periad_startdate : any ;
  current_periad_enddate : any;
  corrent_date_valid : any ;
  current_book : any ;
  selectedtype = '';
  stockitemgroup:any;
  stockitemgrouplist:any = [];
  stockitemlist:any = [];
  stockitemgroupname:any = [];
  loader = true ;
  imgbaseurl="";
  dataNotFount = true ;

  itemgroupreport:any = {
    company_id:'',
    start_date:'',
    end_date:'',
  };
  
  constructor(private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public globals: Globals, public ledgerService:LedgerService,public reportLedgerService:ReportLedgerService, public itemsService:ItemsService,public router:Router,config: NgbModalConfig, private modalService: NgbModal, public route:ActivatedRoute,public dialog: MatDialog) {
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

    this.itemgroupreport.start_date =  new Date(this.current_periad_startdate);
    this.current_periad_enddate = new Date(this.activecompany.current_period_end);
    this.itemgroupreport.end_date = new Date(this.current_periad_enddate);
    this.itemgroupreport.company_id = this.localStorageService.getCompanyId();

    if ( this.itemgroupreport.start_date && this.itemgroupreport.end_date ) {
      this.itemgroupshow();
    }

    // this.loader = false;
    // this.itemgroupshow();
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

  async itemgroupshow(){
    this.loader = true;
    this.dataNotFount = true;
    this.stockitemgrouplist = [];
    this.stockitemgroupname = [];
    this.stockitemlist = [];

    this.itemgroupreport.start_date = moment(this.itemgroupreport.start_date).format('YYYY-MM-DD');
    this.itemgroupreport.end_date = moment(this.itemgroupreport.end_date).format('YYYY-MM-DD');
    this.reportLedgerService.stockgroupitemreport(this.itemgroupreport).subscribe(async data => {
      if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
         this.stockitemgroup = data.ItemStock;
         
         await  this.stockitemgroup.map(val=>{
           if(val[0].subgroup_name){
              let subgroup_name=val[0].subgroup_name;
              this.stockitemgroupname.push({'groupname' : subgroup_name});
           }else{
              let subgroup_name=val[0].stock_name;
              this.stockitemgroupname.push({'groupname' : subgroup_name});
           }
           this.stockitemgrouplist = this.stockitemgroupname;
           val.map(stockitemlist=>{             
           this.stockitemgrouplist.push(stockitemlist);
           })
         })

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
            .font-bold-set{
              font-family: 'Gilroy-ExtraBold';
              float: left !important;
              margin-left: 12px;
            }
            .sungroup-set{
              float: right;
              margin-right: 12px;
            }
        </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
}

}
