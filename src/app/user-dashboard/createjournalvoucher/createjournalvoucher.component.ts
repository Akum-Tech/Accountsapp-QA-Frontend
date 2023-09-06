
import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { LedgerService } from './../../service/ledger.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { ItemsService } from './../../service/items.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { JournalvoucherService } from 'src/app/service/journalvoucher.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AddledgerComponent } from '../../component/addledger/addledger.component';

import { MatDialog } from '@angular/material/dialog';
import { BuyplaneComponent } from '../../component/buyplane/buyplane.component';
import { BuyplaneService } from 'src/app/service/buyplane.service';

@Component({
  selector: 'app-createjournalvoucher',
  templateUrl: './createjournalvoucher.component.html',
  styleUrls: ['./createjournalvoucher.component.css']
})
export class CreatejournalvoucherComponent implements OnInit {
  value: boolean = true;
  oldLedger: any;
  imgbaseurl = "";
  public data: any;
  activecompany: any;
  ledgerList: any = [];
  itemList: any = [];
  lastdatefind: any[];
  showledger: boolean = false;
  items: any = [{}];
  ledgers: any = [{}];
  purposelist: any = [];
  setvalue: any;
  Userdata: any;
  loader = true;
  currentDate: any = new Date();
  current_periad_startdate: any;
  current_periad_enddate: any;
  corrent_date_valid: any;
  current_book: any;
  taxs: any = [];
  activeuser: any;
  vouchers: any = [];
  banklist: any = [];
  ledgerBankList: any = [];
  bank_ledger: any;
  disableDate: any;
  disableDateUid: any;
  purpose: any = {};
  ledgersaleslist: any = [];
  showbankledger: boolean = false;
  showsalesledger: boolean = false;
  gross_amount: number = 0;
  total_amount: number = 0;
  modalRef: NgbModalRef;
  disablebtn: boolean = true;
  clicked = false;

  subcription_end_date: any;
  server_date: any;

  journalvoucher: any = {
    itemAdd: [],
    invoice_date: '',
    company_id: '',
    purpose_id: '',
    narration: "",
    total_amount: '0',
  };

  constructor(private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public globals: Globals, public ledgerService: LedgerService, public journalvoucherService: JournalvoucherService, public itemsService: ItemsService, public router: Router, config: NgbModalConfig, private modalService: NgbModal, private buyplaneService: BuyplaneService, public route: ActivatedRoute, public dialog: MatDialog) {
    $(document).on('keydown', 'input[pattern]', function (e) {
      var input = $(this);
      var oldVal = input.val();
      var regex = new RegExp(input.attr('pattern'), 'g');

      setTimeout(function () {
        var newVal = input.val();
        if (!regex.test(newVal)) {
          input.val(oldVal);
        }
      }, 0);
    });
  }

  @ViewChild('journalvouchermodal', { static: true }) journalvouchermodal: TemplateRef<any>;

  // -------------------------------------------------------------------------------------------------------
  public openbuyplaneModal() {
    if (this.subcription_end_date < this.server_date || this.subcription_end_date == null) {
      const dialogRef = this.dialog.open(BuyplaneComponent, { width: '800px', disableClose: true, hasBackdrop: true });
      dialogRef.afterClosed().subscribe(result => {
        this.modalService.dismissAll();
      });
    } else {
      //
    }
  }
  // -------------------------------------------------------------------------------------------------------
  //___________________GET SINGLE USER____________________________________________________________________________
  getplandatechanges() {
    this.buyplaneService.getsingleuserinfo({ uid: this.localStorageService.getuserUId() }).subscribe(data => {
      if (data['success'] === true) {
        this.Userdata = data.user;
        this.setvalue = this.localStorageService.getuserinfo();
        this.setvalue.subscription_end_date = data.user.subscription_end_date;
        this.localStorageService.saveUserDetail(this.setvalue);

        // this.subcription_end_date = this.setvalue.subscription_end_date;
        // this.server_date = this.setvalue.serverdate;
      }
    });
  };
  //___________________GET SINGLE USER END____________________________________________________________________________

  addLedger() {
    this.ledgers.push({});
  }

  removeLedger(i, item) {
    if (item.amount !== '0' || item.amount !== 0) {
      this.journalvoucher.total_amount = Number(this.journalvoucher.total_amount) - Number(item.amount)
    }
    this.ledgers.splice(i, 1);
    this.calculateamount(this.ledgers, i, item.amount);
  }

  public openLedgerAddModal() {
    this.localStorageService.saveJournalLedgerData(this.ledgers)
    this.modalService.dismissAll();
    this.router.navigate(['admin/addledger']);

    // const dialogRef = this.dialog.open(AddledgerComponent, {width:'900px',disableClose: true, hasBackdrop:true });
    // dialogRef.afterClosed().subscribe(result =>  {
    //  console.log('iam at here123 result ',result)
    //     this.getledger();
    // });

  }

  // numberOnly(event): boolean {
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   if (charCode > 31 && (charCode < 48 || charCode > 57)) {
  //     return false;
  //   }
  //   return true;
  // }

  done(createinvoice) {
    this.modalService.dismissAll();
    this.modalService.open(createinvoice, { size: 'lg', backdrop: 'static', keyboard: false });
  }
  closeLedgerData() {
    this.localStorageService.removeJournaldata();
  }

  async ngOnInit() {
    let ledgerdata = this.localStorageService.getJournalVoucherdata()
    if (ledgerdata != null) {
      if (ledgerdata.length > 0) {
        this.ledgers = ledgerdata
      }
    }
    this.getplandatechanges();
    this.activeuser = this.localStorageService.getuserinfo();
    this.subcription_end_date = this.activeuser.subscription_end_date;
    this.server_date = this.activeuser.serverdate;
    this.openbuyplaneModal();

    this.imgbaseurl = this.localStorageService.getBaseUrl();
    this.activecompany = this.localStorageService.getCompanyInfo();
    this.route.params.subscribe((params) => {
      if (params.status === "after") {
        this.journalvoucher.is_after = true;
        this.journalvoucher.is_before = false;
        this.journalvoucher.after_id = params.uid === 'none' ? '' : params.uid;
      } else if (params.status === "before") {
        this.journalvoucher.is_before = true;
        this.journalvoucher.is_after = false;
        this.journalvoucher.after_id = params.uid === 'none' ? '' : params.uid;
        this.disableDateUid = params.invoicedate;
      } else {
        this.journalvoucher.is_after = false;
        this.journalvoucher.is_before = false;
        this.journalvoucher.after_id = '';
      }
    })
    this.current_book = new Date(this.activecompany.bookstart_date);
    this.corrent_date_valid = new Date(this.activecompany.current_period_start);
    this.journalvoucher.current_year = new Date(this.activecompany.current_period_start).getFullYear();
    this.journalvoucher.end_year = new Date(this.activecompany.current_period_end).getFullYear();
    this.activecompany.current_period_start = moment(this.activecompany.current_period_start).format('MMM-DD-YYYY');
    this.activecompany.current_period_end = moment(this.activecompany.current_period_end).format('MMM-DD-YYYY');
    this.journalvoucher.description = this.localStorageService.getCompanyTermsInfo();
    this.journalvoucher.company_id = this.localStorageService.getCompanyId();
    this.journalvoucherService.LastDate({ company_id: this.localStorageService.getCompanyId(), current_year: new Date(this.activecompany.current_period_start).getFullYear(), end_year: new Date(this.activecompany.current_period_end).getFullYear() }).subscribe(data => {
      if (data['success'] == true && data.JournalVoucher && data.JournalVoucher.uid) {
        this.lastdatefind = data.JournalVoucher;
        this.disableDate = data.JournalVoucher.invoice_date;
        this.getValidation(data.JournalVoucher.invoice_date);
      } else {
        this.getBeforeValidation();
      }
    });
    this.getPurposelist();
    this.getledger();
  }
  getBeforeValidation() {
    if (this.current_book >= this.corrent_date_valid) {
      this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
      this.current_periad_enddate = new Date(this.activecompany.current_period_end);
      this.journalvoucher.invoice_date = new Date(this.current_periad_startdate);
    } else {
      this.current_periad_startdate = new Date(this.activecompany.current_period_start);
      this.current_periad_enddate = new Date(this.activecompany.current_period_end);
      this.journalvoucher.invoice_date = new Date(this.current_periad_startdate);
    }
    this.modalService.open(this.journalvouchermodal, { size: 'lg', backdrop: 'static', keyboard: false });
  }

  getValidation(disableDate) {
    if (this.journalvoucher.is_before) {
      if (this.current_book >= this.corrent_date_valid) {
        this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
        this.current_periad_enddate = new Date(this.disableDateUid);
        this.journalvoucher.invoice_date = new Date(this.current_periad_startdate);
      } else {
        this.current_periad_startdate = new Date(this.activecompany.current_period_start);
        this.current_periad_enddate = new Date(this.disableDateUid);
        this.journalvoucher.invoice_date = new Date(this.current_periad_startdate);
      }
    } else {
      this.current_periad_startdate = new Date(disableDate);
      this.current_periad_enddate = new Date(this.activecompany.current_period_end);
      this.journalvoucher.invoice_date = new Date(disableDate);
    }
    this.modalService.open(this.journalvouchermodal, { size: 'lg', backdrop: 'static', keyboard: false });
  }

  getPurposelist() {
    this.journalvoucherService.getpurpose({ user_id: this.localStorageService.getuserId(), company_id: this.localStorageService.getCompanyId() }).subscribe(data => {
      this.purposelist = data && data['city'].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    })
  };


  async calculateamount(itemledger, index, status) {
    this.journalvoucher.total_amount = 0;
    let debitAmount = 0;
    let creditAmount = 0;
    await this.ledgers.forEach((element, index) => {
      this.journalvoucher.total_amount = Number(this.journalvoucher.total_amount) + Number(element.amount);
      if (element.type == 'debit') {
        debitAmount = Number(debitAmount) + Number(element.amount)
      } else {
        creditAmount = Number(creditAmount) + Number(element.amount)
      }
      if (index == this.ledgers.length - 1) {
        if (Number(debitAmount.toFixed(2)) !== Number(creditAmount.toFixed(2))) {
          this.disablebtn = false;
          // if (itemledger.type && itemledger.amount) {
          //   this.addLedger();
          // }
        } else {
          this.disablebtn = true;
        }
      } else {
        console.log("index-else", index);
        console.log("length-else", this.ledgers.length);
      }
    });
  }


  getledger() {
    this.ledgerService.getjournalledgerdata({ user_id: this.localStorageService.getuserId(), company_id: this.localStorageService.getCompanyId() }).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        this.ledgerList = data && data.Ledger.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        this.loader = false;
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });

  }

  getpurposeData(item) {
    this.purpose = item;
    this.journalvoucher.purpose_id = item.id;
  }

  async getLedgerData(itemledger, index) {
    if (itemledger !== '') {
      let data = await this.ledgerList.find(data => data.uid === itemledger);
      this.ledgers[index] = await {
        'company_id': this.localStorageService.getCompanyId(),
        'type': data.opening_balance,
        'ledger_id': data.uid,
        'amount': data.amount,
      };
    }
  }

  async genrateVoucher() {
    this.clicked = false;
    this.journalvoucher.itemAdd = this.ledgers;
    this.journalvoucher.invoice_date = moment(this.journalvoucher.invoice_date).format('MM-DD-YYYY');
    this.clicked = true;
    this.journalvoucherService.JournalVoucher(this.journalvoucher).subscribe(data => {
      // let journaluid=data.JournalVoucher.uid;
      // this.localStorageService.saveJournalinfo(journaluid)
      this.localStorageService.removeJournaldata();

      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        this.modalService.dismissAll();
        this.journalvoucher = {};
        this.ledgers = [{}];
        this.router.navigate(['admin/journalvoucher']);
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

}