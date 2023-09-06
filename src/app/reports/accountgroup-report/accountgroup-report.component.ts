
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
import Utils from './../../utils/utils';
import * as moment from 'moment';


@Component({
  selector: 'app-accountgroup-report',
  templateUrl: './accountgroup-report.component.html',
  styleUrls: ['./accountgroup-report.component.css']
})
export class AccountgroupReportComponent implements OnInit {

  
  activecompany : any;
  current_periad_startdate : any ;
  current_periad_enddate : any;
  corrent_date_valid : any ;
  current_book : any ;
  accountlist:any =[];
  ledgerReportList:any = [];
  account_group_id_new :string ='';
  account_sub_group_id :string= '';
  selectedType = '';
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
  loader = true ;
  imgbaseurl="";
  dataNotFount = true ;

  groupreport:any = {
    company_id:'',
    start_date:'',
    end_date:'',
    account_id:'',
    type:"group",
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

    this.groupreport.start_date =  new Date(this.current_periad_startdate);
    this.current_periad_enddate = new Date(this.activecompany.current_period_end);
    this.groupreport.end_date = new Date(this.current_periad_enddate);
    this.groupreport.company_id = this.localStorageService.getCompanyId();

     this.getdefaultaccountgroupList();
     this.loader = false;
  }

    
  async groupreportshow(){
    this.loader = true;
    this.dataNotFount = true;
    this.groupreport.start_date =await moment(this.groupreport.start_date).format('YYYY-MM-DD');
    this.groupreport.end_date =await moment(this.groupreport.end_date).format('YYYY-MM-DD');
    
    await this.reportLedgerService.Grouppostreport(this.groupreport).subscribe(data => {
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
          
        this.loader = false;
        this.dataNotFount = false;
        } else if (data['statusCode'] == 400) {
          this.loader = false;
          this.dataNotFount = false;
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.loader = false;
          this.dataNotFount = false;
          this.ledgerReportList = [];
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
  }

  getType(value){
    if(value>0){
      return Utils.converttocomaawithdecimal(value);
    }else if (value==0){
      return 0;
    }else{
        return Utils.converttocomaawithdecimal(value);
    }
  }

  convertintoNumber(value){
    return Utils.converttocomaawithdecimal(value);
  }

  getdefaultaccountgroupList(){
    this.ledgerService.getaccountreport(this.localStorageService.getCompanyId()).subscribe(data => {
      this.accountlist = data && data['AccountGroup'].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    })
  };

  getgroupData(item){
    this.group = item;
    // if(item.account_group_id){
    //   this.groupreport.sub_account_id = item.uid;
    // }else{
      // this.groupreport.account_id = item.uid;
      this.groupreport.account_id = item.account_group_id?item.account_group_id:item.uid;
      this.selectedType = item.name ;
    // }
    if ( this.groupreport.account_id != '' && this.groupreport.start_date && this.groupreport.end_date ) {
      this.groupreportshow();
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

