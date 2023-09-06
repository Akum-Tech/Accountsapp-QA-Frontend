import { Component, OnInit } from "@angular/core";
import { MessagePanelService } from "./../../service/message-panel.service";
import { ItemsService } from "./../../service/items.service";
import { Globals } from "./../../global";
import { LocalStorageService } from "./../../service/local-storage.service";
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ReportLedgerService } from "src/app/service/report-ledger.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import * as moment from "moment";
import Utils from "./../../utils/utils";
@Component({
  selector: "app-bank-bookreport",
  templateUrl: "./bank-bookreport.component.html",
  styleUrls: ["./bank-bookreport.component.css"]
})
export class BankBookreportComponent implements OnInit {
  activecompany: any;
  current_periad_startdate: any;
  current_periad_enddate: any;
  corrent_date_valid: any;
  current_book: any;
  selectedtype = "";
  total_amount: Number = 0;
  ledgerReportList: any = [];
  ledgerBankList: any = [];
  debitsum: any = 0;
  creditsum: any = 0;
  balancesum: Number = 0;
  convernumber: any = 0;
  ledger: any = {};
  loader = true;
  dataNotFount = true ;
  imgbaseurl = "";
  debitshowsum: any;
  creditshowsum: any;
  ledgerreport: any = {
    company_id: "",
    start_date: "",
    end_date: "",
    ledger_id: "",
    type: "bank"
  };

  constructor(
    private messagePanelService: MessagePanelService,
    private localStorageService: LocalStorageService,
    public globals: Globals,
    public reportLedgerService: ReportLedgerService,
    public itemsService: ItemsService,
    public router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    
    this.imgbaseurl=this.localStorageService.getBaseUrl();
    this.activecompany=this.localStorageService.getCompanyInfo();
    
    
    this.current_book = new Date(this.activecompany.bookstart_date);
    this.corrent_date_valid = new Date(this.activecompany.current_period_start);

    if (this.current_book >= this.corrent_date_valid) {
      this.current_periad_startdate = new Date(
        this.activecompany.bookstart_date
      );
    } else {
      this.current_periad_startdate = new Date(
        this.activecompany.current_period_start
      );
    }

    this.ledgerreport.start_date = new Date(this.current_periad_startdate);
    this.current_periad_enddate = new Date(
      this.activecompany.current_period_end
    );
    this.ledgerreport.end_date = new Date(this.current_periad_enddate);
    this.ledgerreport.company_id = this.localStorageService.getCompanyId();

    this.getbankledgerdata();
    this.loader = false;
  }

  getbankLedgerData(item) {
    this.ledger = item;
    this.ledgerreport.ledger_id = item.uid;
    
     if ( this.ledgerreport.ledger_id != '' && this.ledgerreport.start_date && this.ledgerreport.end_date ) {
      this.ledgerreportshow();
    }
  }

  getbankledgerdata() {
    this.reportLedgerService
      .getbankledger({
        user_id: this.localStorageService.getuserId(),
        company_id: this.localStorageService.getCompanyId()
      })
      .subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization(
            "An error occured, please try again later",
            this.globals.messageCloseTime,
            this.globals.messageType.error
          );
        } else if (data["success"] == true) {
          this.ledgerBankList = data.Ledger.sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          );
        } else if (data["statusCode"] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(
            data["message"],
            this.globals.messageCloseTime,
            this.globals.messageType.success
          );
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(
            data["message"],
            this.globals.messageCloseTime,
            this.globals.messageType.error
          );
        }
      });
  }

  async ledgerreportshow() {
    this.loader = true;
    this.dataNotFount = true;
    this.ledgerreport.start_date = moment(this.ledgerreport.start_date).format(
      "YYYY-MM-DD"
    );
    this.ledgerreport.end_date = moment(this.ledgerreport.end_date).format(
      "YYYY-MM-DD"
    );

    this.reportLedgerService
      .ledgerpostreport(this.ledgerreport)
      .subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization(
            "An error occured, please try again later",
            this.globals.messageCloseTime,
            this.globals.messageType.error
          );
        } else if (data["success"] == true) {
          this.ledgerReportList = data.JournalVoucher;
          this.balancesum = 0;
          this.debitsum = 0;
          this.creditsum = 0;
          this.convernumber = 0;

          this.ledgerReportList.map(
            (ele, i) => (
              (ele["debitnumber"] = Utils.converttocomaawithdecimal(
                ele["debitAmount"]
              )),
              (ele["creditnumber"] = Utils.converttocomaawithdecimal(
                ele["creditAmount"]
              ))
            )
          );

          this.ledgerReportList.forEach(element => {
            this.balancesum =
              Utils.convertIntoNumber(this.balancesum) +
              Utils.convertIntoNumber(
                Utils.convertIntoNumber(element.debitAmount) -
                  Utils.convertIntoNumber(element.creditAmount)
              );
            if (this.balancesum < 0) {
              this.convernumber = Utils.converttocomaawithdecimal(
                Utils.convertIntoNumber(-1) *
                  Utils.convertIntoNumber(this.balancesum)
              );
            } else {
              this.convernumber = Utils.converttocomaawithdecimal(
                Utils.convertIntoNumber(this.balancesum)
              );
            }
          });

          this.ledgerReportList.forEach((element, index) => {
            this.debitsum =
              Utils.convertIntoNumber(this.debitsum) +
              Utils.convertIntoNumber(element.debitAmount);
            this.creditsum =
              Utils.convertIntoNumber(this.creditsum) +
              Utils.convertIntoNumber(element.creditAmount);
          });

          this.debitshowsum = Utils.converttocomaawithdecimal(this.debitsum);
          this.creditshowsum = Utils.converttocomaawithdecimal(this.creditsum);
          this.loader = false;
          this.dataNotFount = false;
        } else if (data["statusCode"] == 400) {          
          this.loader = false;
          this.dataNotFount = false;
          this.messagePanelService.ShowPopupMessageWithLocalization(
            data["message"],
            this.globals.messageCloseTime,
            this.globals.messageType.success
          );
        } else {
          this.loader = false;
          this.dataNotFount = false;
          this.messagePanelService.ShowPopupMessageWithLocalization(
            data["message"],
            this.globals.messageCloseTime,
            this.globals.messageType.error
          );
        }
      });
  }
callbalance(object, index){
  if(object){
    let total_blance = 0;
    if(index===0){
      this.ledgerReportList[index].total_blance= Utils.convertIntoNumber (Utils.convertIntoNumber (object.debitAmount) - Utils.convertIntoNumber(object.creditAmount));
         return  this.ledgerReportList[index].total_blance;
    }else{
      let creditamount=Utils.convertIntoNumber(object.creditAmount);
      if(creditamount>0){
         this.ledgerReportList[index].total_blance =  Utils.convertIntoNumber(this.ledgerReportList[index-1].total_blance) - Utils.convertIntoNumber(object.creditAmount);
        return  this.ledgerReportList[index].total_blance;
      }else{
        this.ledgerReportList[index].total_blance = Utils.convertIntoNumber(this.ledgerReportList[index-1].total_blance) + Utils.convertIntoNumber(object.debitAmount);
        return  this.ledgerReportList[index].total_blance;
        //return  Utils.converttocomaawithdecimal(this.ledgerReportList[index].total_blance);
      }
    }
  }else{
    return 0;
  }    
}


  printPage(): void {
    let printContents, popupWin;
    printContents = document.getElementById("print-section").innerHTML;
    popupWin = window.open("", "_salf", "top=0,left=0,height=100%,width=auto");
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
      </html>`);
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
