import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './../../service/local-storage.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ItemsService} from './../../service/items.service';
import { ReportLedgerService } from 'src/app/service/report-ledger.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {CompanyService} from './../../service/company.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import * as moment from 'moment';
import Utils from "./../../utils/utils";

@Component({
  selector: 'app-stock-item',
  templateUrl: './stock-item.component.html',
  styleUrls: ['./stock-item.component.css']
})
export class StockItemComponent implements OnInit {

  
  itemslist: any =[];
  activecompany : any;
  current_periad_startdate : any ;
  current_periad_enddate : any;
  corrent_date_valid : any ;
  current_book : any ;
  selectedtype = '';
  stockItemList:any = [];
  item:any = { };
  total_amount: Number = 0;
  getunit : any;
  inwardItem: Number = 0 ;
  outwarditem: Number  = 0 ; 
  loader = true ;
  imgbaseurl="";
  dataNotFount = true ;

  stockitem:any = {
    start_date:'',
    end_date:'',
    item_id:'',
    limit:15,
    offset: 0
  };
  
  constructor( private router: Router , private localStorageService: LocalStorageService,private modalService: BsModalService,public globals: Globals, private formBuilder: FormBuilder,public reportLedgerService:ReportLedgerService,public itemsService:ItemsService, private messagePanelService: MessagePanelService, public companyService:CompanyService){ }

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

    this.stockitem.start_date =  new Date(this.current_periad_startdate);
    this.current_periad_enddate = new Date(this.activecompany.current_period_end);
    this.stockitem.end_date = new Date(this.current_periad_enddate);

    this.getitemsList();
    this.loader = false;
  }

  getreportitem(item){
    this.item = item;
    this.stockitem.item_id = item.uid;
    if ( this.stockitem.item_id && this.stockitem.start_date && this.stockitem.end_date ) {
      this.stockitemsshow();
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
  getitemsList(){
    this.itemsService.getitems({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] === true) {
        this.itemslist =  data.Item.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  async stockitemsshow(){
    this.loader = true;
    this.dataNotFount = true;
    this.stockitem.start_date = moment(this.stockitem.start_date).format('YYYY-MM-DD');
    this.stockitem.end_date = moment(this.stockitem.end_date).format('YYYY-MM-DD');
    
    this.reportLedgerService.stockitemreport(this.stockitem).subscribe(data => {
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