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
  selector: 'app-gst-reports',
  templateUrl: './gst-reports.component.html',
  styleUrls: ['./gst-reports.component.css']
})
export class GSTReportsComponent implements OnInit {

  activecompany : any;
  current_periad_startdate : any ;
  current_periad_enddate : any;
  corrent_date_valid : any ;
  current_book : any ;
  loader = true ;
  imgbaseurl="";
  dataNotFount = true ;
  gstreportList:any = [];
  gstrlist:any = [];
  gstrtable:any = [];

  gstreport:any = {
    company_id:'',
    start_date:'',
    end_date:'',
  };


  constructor(private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public globals: Globals,public reportLedgerService:ReportLedgerService, public itemsService:ItemsService,public router:Router,config: NgbModalConfig, private modalService: NgbModal, public route:ActivatedRoute,public dialog: MatDialog) { }

  
  ngOnInit() {
    this.activecompany=this.localStorageService.getCompanyInfo();

    this.current_book = new Date(this.activecompany.bookstart_date);
    this.corrent_date_valid = new Date(this.activecompany.current_period_start);

    if(this.current_book >= this.corrent_date_valid){
      this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
    }else{
      this.current_periad_startdate = new Date(this.activecompany.current_period_start);
    }

    this.gstreport.start_date =  new Date(this.current_periad_startdate);
    this.current_periad_enddate = new Date(this.activecompany.current_period_end);
    this.gstreport.end_date = new Date(this.current_periad_enddate);
    this.gstreport.company_id = this.localStorageService.getCompanyId();

        
    if ( this.gstreport.start_date && this.gstreport.end_date ) {
      this.gstreportshowsummary();
    }
    
    // this.loader = false;
  }

  async gstreportshowsummary(){
    this.loader = true;
    this.dataNotFount = true;
    this.gstreport.start_date = moment(this.gstreport.start_date).format('YYYY-MM-DD');
    this.gstreport.end_date = moment(this.gstreport.end_date).format('YYYY-MM-DD');
    
    this.reportLedgerService.gstronereportsummarythreeB(this.gstreport).subscribe(async data => {
      if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {

          this.gstrlist = data;
          this.gstrtable = data.data;

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
  

  getType(value){
    if(value>0){
      return Utils.converttocomaawithdecimal(value);
    }else if (value==0 || value==""){
      return 0;
    }else{
        return Utils.converttocomaawithdecimal(value);
    }
  }


}
