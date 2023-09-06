import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { ViewPurchasevoucherService } from './../../service/view-purchasevoucher.service';
import { PurchaseinvoiceService } from './../../service/purchaseinvoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyplaneComponent } from '../../component/buyplane/buyplane.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BuyplaneService } from 'src/app/service/buyplane.service';
import Utils from './../../utils/utils';
@Component({
  selector: 'app-view-purchasevoucher',
  templateUrl: './view-purchasevoucher.component.html',
  styleUrls: ['./view-purchasevoucher.component.css']
})

export class ViewPurchasevoucherComponent implements OnInit {

  public data : any;
  users: any = [{}];
  modalRef: BsModalRef;
  deleteData:any = {};
  cancelData : any = {};
  activecompany : any;
  loader = true ;
  lastDate:any = '';
  PurchaseVoucher : any = [];
  purchaseinvoicelist:any = [];
  showpurchasevoucher:boolean = false;
  financial_year_start : any;
  financial_year_end : any;
  activeuser:any;
  config: any;
  setvalue :any;
  Userdata: any;
  dataNotFount = true ;
  
  subcription_end_date : any;
  server_date : any;

  purchasevoucher:any = {
    itemAdd :[],
    status:1,
    invoice_date:'',
    company_id:'',
    ledger_id:'',
    bank_ledger_id:'',
    shipping_address:"",
    description:"",
  };

  constructor(private messagePanelService: MessagePanelService,private modalService: BsModalService,private router:Router, private localStorageService: LocalStorageService, public globals: Globals, public viewPurchasevoucherService:ViewPurchasevoucherService,private buyplaneService: BuyplaneService,public purchaseinvoiceService:PurchaseinvoiceService, public route:ActivatedRoute,public dialog: MatDialog) {
    this.config = {
      currentPage: 1,
      itemsPerPage: this.globals.itemsPerPageset,
      totalItems: 0,
      pager: []
    };
    
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
    this.activecompany=this.localStorageService.getCompanyInfo();
    this.purchasevoucher.financial_year_start = new Date(this.activecompany.current_period_start).getFullYear();
    this.purchasevoucher.financial_year_end = new Date(this.activecompany.current_period_end).getFullYear(); 
    this.getVoucherAll();
  }

  getVoucherAll() {
    
    this.loader = true;
    let offsetdata = this.config.itemsPerPage *(this.config.currentPage - 1);
    let limitdata = this.config.itemsPerPage;

    this.purchaseinvoiceService.getpurchasevoucher({company_id:this.localStorageService.getCompanyId(),end_year:this.purchasevoucher.financial_year_end,current_year:this.purchasevoucher.financial_year_start, offset: offsetdata, limit: limitdata}).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] === true) {
        if(data.PurchaseVoucher.length>0){
          this.purchaseinvoicelist = data.PurchaseVoucher;
          this.loader = false;          
          this.config.totalItems = data.Count;
          this.config.pager = [];
          let forloop = Math.ceil(this.config.totalItems / this.config.itemsPerPage);
          for (let i = 1; i <= forloop; i++) {
            this.config.pager.push(i);
          }
        }else{
          this.purchaseinvoicelist = data.PurchaseVoucher;
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

  getLedgerData(item){
    this.PurchaseVoucher = item;
    this.purchasevoucher = item.uid;
    this.showpurchasevoucher = true;
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
    this.purchaseinvoiceService.cancelVoucher(data).subscribe(data => {
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
    this.purchaseinvoiceService.deleteVoucher(data).subscribe(data => {
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
