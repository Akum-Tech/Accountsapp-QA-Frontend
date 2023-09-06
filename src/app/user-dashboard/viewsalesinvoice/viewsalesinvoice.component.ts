import { Component, OnInit, TemplateRef } from '@angular/core';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { ViewSalesVoucherService } from './../../service/view-sales-voucher.service';
import { SalesVoucherService } from './../../service/sales-voucher.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyplaneComponent } from '../../component/buyplane/buyplane.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BuyplaneService } from 'src/app/service/buyplane.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment'; 
import Utils from './../../utils/utils';

@Component({
  selector: 'app-viewsalesinvoice',
  templateUrl: './viewsalesinvoice.component.html',
  styleUrls: ['./viewsalesinvoice.component.css']
})
export class ViewsalesinvoiceComponent implements OnInit {

  public data: any;
  users: any = [{}];
  activecompany: any;
  SaleVoucher: any = [];
  salesinvoiselist: any = [];
  showsalesvoucher: boolean = false;
  createinvoicedate: any;
  financial_year_start: any;
  loader = true;
  financial_year_end: any;
  activeuser: any;
  lastDate: any = '';
  config: any;
  setvalue :any;
  Userdata: any;
  modalRef: BsModalRef;
  deleteData:any = {};
  cancelData : any = {};
  dataNotFount = true ;
  
  subcription_end_date : any;
  server_date : any;

  
  salesVoucher: any = {
    itemAdd: [],
    status: 1,
    invoice_date: '',
    company_id: '',
    ledger_id: '',
    bank_ledger_id: '',
    shipping_address: "",
    description: "",
  };

  constructor(private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public globals: Globals, public viewSalesVoucherService: ViewSalesVoucherService, private buyplaneService: BuyplaneService,private router: Router, public salesVoucherService: SalesVoucherService, public route: ActivatedRoute,private modalService: BsModalService, public dialog: MatDialog) {

   this.config = {
      currentPage: 1,
      itemsPerPage: this.globals.itemsPerPageset,
      totalItems: 0,
      pager: []
    };

  //   $(document).ready(function() {
  //     $('#example').DataTable();
  // } );
  }

  getDate(date){
    let data = date.split('T');
    if(data.length===1){
      date = date.replaceAll('-', '/');
    }
    return moment(new Date(date)).format('DD-MMM-YYYY')
  }
  pageChange(newPage: number) {
    this.config.currentPage=newPage;
    this.getVoucherAll()
  }

  // -----------------------------------------------------------------------------------------------------------------------
    public openbuyplaneModal(){
      if(this.subcription_end_date < this.server_date || this.subcription_end_date == null ){
        const dialogRef = this.dialog.open(BuyplaneComponent, { width: '800px', disableClose: true, hasBackdrop:true});
        dialogRef.afterClosed().subscribe(result =>  {
        });
      }else{
        //
      } 
    }  
  // -----------------------------------------------------------------------------------------------------------------------


//___________________GET SINGLE USER____________________________________________________________________________

getplandatechanges(){
  this.buyplaneService.getsingleuserinfo({uid:this.localStorageService.getuserUId()}).subscribe(data => {
    if (data['success'] === true) {
        this.Userdata=data.user;
        this.setvalue = this.localStorageService.getuserinfo();
        this.setvalue.subscription_end_date = data.user.subscription_end_date ;
        this.localStorageService.saveUserDetail(this.setvalue);
        
        this.subcription_end_date = this.setvalue.subscription_end_date;
        this.server_date = this.setvalue.serverdate;
      }
    });
};

//___________________GET SINGLE USER END____________________________________________________________________________

async ngOnInit() {
  this.getplandatechanges(); 
  this.activeuser = this.localStorageService.getuserinfo();
  // this.subcription_end_date = this.activeuser.subscription_end_date;
  // this.server_date = this.activeuser.serverdate;
  this.activecompany = this.localStorageService.getCompanyInfo();
  this.salesVoucher.financial_year_start = new Date(this.activecompany.current_period_start).getFullYear();
  this.salesVoucher.financial_year_end = new Date(this.activecompany.current_period_end).getFullYear();
  this.getVoucherAll();
}

getVoucherAll() {
  this.loader = true;
  let offsetdata = this.config.itemsPerPage *(this.config.currentPage - 1);
  let limitdata = this.config.itemsPerPage;

  this.salesVoucherService.getSalesVoucher({ end_year: this.salesVoucher.financial_year_end, current_year: this.salesVoucher.financial_year_start, company_id: this.localStorageService.getCompanyId(), offset: offsetdata, limit: limitdata }).subscribe(data => {
    if (data === null || data === undefined) {
      this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
    } else if (data['success'] === true) {
      if (data.SaleVoucher.length > 0) {
        this.salesinvoiselist = data.SaleVoucher;
        this.loader = false;
        this.config.totalItems = data.Count;
        this.config.pager = [];
        let forloop = Math.ceil(this.config.totalItems / this.config.itemsPerPage);
        for (let i = 1; i <= forloop; i++) {
          this.config.pager.push(i);
        }
      } else {
        this.salesinvoiselist = data.SaleVoucher;
        this.loader = false;
        this.dataNotFount = false;
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      }
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

getLedgerData(item) {
  this.SaleVoucher = item;
  this.salesVoucher = item.uid;
  this.showsalesvoucher = true;
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

gotoCancel(data){
  this.salesVoucherService.cancelsalesVoucher(data).subscribe(data => {
    if (data === null || data === undefined) {
      this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
    } else if (data['success'] === true) {
      this.cancelData = {};
      this.modalRef.hide();
      setTimeout(()=>{ 
        this.getVoucherAll();
      }, 1000);
    } else if (data['statusCode'] == 400) {
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
    } else {
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
    }
  });
}

gotodDelete(data){
  this.salesVoucherService.deletesalesVoucher(data).subscribe(data => {
    if (data === null || data === undefined) {
      this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
    } else if (data['success'] === true) {
      this.deleteData = {};
      this.modalRef.hide();
      setTimeout(()=>{ 
        this.getVoucherAll();
      }, 1000);
    } else if (data['statusCode'] == 400) {
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
    } else {
      this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
    }
  });
}

openvoucherCancelModal(cancelinvoice: TemplateRef<any>, item) {
  this.cancelData = item?item:{};
  this.modalRef = this.modalService.show(cancelinvoice, {
    class:'modal-lg',
    keyboard: false,
    backdrop:'static'
  });
}

openvoucherDeleteModal(deleteinvoice: TemplateRef<any>, item) {
  this.deleteData = item?item:{};
    this.modalRef = this.modalService.show(deleteinvoice, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }
}
