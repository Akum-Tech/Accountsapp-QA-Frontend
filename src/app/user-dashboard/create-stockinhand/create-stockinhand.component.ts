import { Component, OnInit,TemplateRef, ViewChild, ElementRef  } from '@angular/core';
import { LedgerService} from './../../service/ledger.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MessagePanelService } from './../../service/message-panel.service';
import { ItemsService} from './../../service/items.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { JournalvoucherService } from 'src/app/service/journalvoucher.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BuyplaneComponent } from '../../component/buyplane/buyplane.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BuyplaneService } from 'src/app/service/buyplane.service';
import { AdditemComponent } from '../../component/additem/additem.component';
import Utils from './../../utils/utils';

@Component({
  selector: 'app-create-stockinhand',
  templateUrl: './create-stockinhand.component.html',
  styleUrls: ['./create-stockinhand.component.css']
})
export class CreateStockinhandComponent implements OnInit {

  imgbaseurl="";
  public data : any;  
  activeuser:any;
  activecompany : any;
  stockledger:any = [];
  itemList:any = [];
  items: any = [{}];
  ledgers: any = [{}];
  clicked = false;
  ledger:any = {};
  select_composition : boolean = false;
  stocktypeselect : boolean = false ;
  current_periad_startdate : any ;
  current_periad_enddate : any ; 
  corrent_date_valid : any ;
  current_book : any ;
  ledgerfilter:any = [];
  lastdatefind : any [];
  disableDate:any;
  disableDateUid:any;
  setvalue :any;
  Userdata: any;
  
  subcription_end_date : any;
  server_date : any;
  
  stockinhand:any = {
    itemAdd  :[],
    invoice_date:'',
    company_id:'',
    type:"credit",
    purpose_id:'7',
    ledger_id:'',
    voucher_type:"stockJournalVoucher",
    narration:"",
    total_amount:'0',
  };

  constructor(private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public globals: Globals, public ledgerService:LedgerService, public itemsService:ItemsService, public journalvoucherService:JournalvoucherService, public router:Router,config: NgbModalConfig, private modalService: NgbModal,private buyplaneService: BuyplaneService, public route:ActivatedRoute,public dialog: MatDialog){
    $(document).on('keydown', 'input[pattern]', function(e){
      var input = $(this);
      var oldVal = input.val();
      var regex = new RegExp(input.attr('pattern'), 'g');
    
      setTimeout(function(){
        var newVal = input.val();
        if(!regex.test(newVal)){
          input.val(oldVal); 
        }
      }, 0);
    });
  }

// -----------------------------------------------------------------------------------------------------------------------
  public openbuyplaneModal(){
    if(this.subcription_end_date < this.server_date || this.subcription_end_date == null ){
      const dialogRef = this.dialog.open(BuyplaneComponent, { width: '800px', disableClose: true, hasBackdrop:true});
      dialogRef.afterClosed().subscribe(result =>  {
        this.modalService.dismissAll();
      });
    }else{
      //
    } 
  } 
    
  public openItemAddModal(){
    // this.router.navigate(['/additem']);
    const dialogRef = this.dialog.open(AdditemComponent, { width: '800px', disableClose: true, hasBackdrop:true ,data:{}});
    dialogRef.afterClosed().subscribe(result =>  {
     console.log('iam at here123')
        this.getItems();
    });
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


  done(createinvoice) {
    this.modalService.open(createinvoice , { size: 'lg' , backdrop : 'static', keyboard : false });
  }

  addUser(){
    this.items.push({});
  }
  async removeUser(i){
    await this.items.pop(i);
    await this.calAmount(this.items); 
  }

  ngOnInit() {
    this.getplandatechanges(); 
    this.activeuser = this.localStorageService.getuserinfo(); 
    this.subcription_end_date = this.activeuser.subscription_end_date;
    this.server_date = this.activeuser.serverdate;
    this.imgbaseurl= this.localStorageService.getBaseUrl();
    this.activecompany= this.localStorageService.getCompanyInfo();
    
       
    this.imgbaseurl= this.localStorageService.getBaseUrl();
    this.activecompany= this.localStorageService.getCompanyInfo();
    this.route.params.subscribe((params) => {
     if(params.status==="after"){
        this.stockinhand.is_after=true;
        this.stockinhand.is_before=false;
        this.stockinhand.after_id=params.uid==='none'?'':params.uid;
      }else if(params.status==="before"){
        this.stockinhand.is_before=true;
        this.stockinhand.is_after=false;
        this.stockinhand.after_id=params.uid==='none'?'':params.uid;
        this.disableDateUid = params.invoicedate;
      }else{
        this.stockinhand.is_after=false;
        this.stockinhand.is_before=false;
        this.stockinhand.after_id='';
      }
    })

    this.current_book = new Date(this.activecompany.bookstart_date);
    this.corrent_date_valid = new Date(this.activecompany.current_period_start);
    this.stockinhand.current_year = new Date(this.activecompany.current_period_start).getFullYear();
    this.stockinhand.end_year = new Date(this.activecompany.current_period_end).getFullYear();
    this.activecompany.current_period_start = moment(this.activecompany.current_period_start).format('MMM-DD-YYYY');
    this.activecompany.current_period_end = moment(this.activecompany.current_period_end).format('MMM-DD-YYYY');
    this.stockinhand.description = this.localStorageService.getCompanyTermsInfo();
    this.stockinhand.company_id = this.localStorageService.getCompanyId();
    this.select_composition =  this.activecompany.composition_dealer;
    this.current_periad_enddate = new Date(this.activecompany.current_period_end);
    
    this.journalvoucherService.LastDatestock({company_id:this.localStorageService.getCompanyId(),current_year:new Date(this.activecompany.current_period_start).getFullYear(),end_year:new Date(this.activecompany.current_period_end).getFullYear()}).subscribe(data => {
      if (data['success'] == true && data.ItemStockVoucher  && data.ItemStockVoucher.uid) {
        this.lastdatefind = data.ItemStockVoucher;
        this.disableDate = data.ItemStockVoucher.invoice_date;
        this.getValidation(data.ItemStockVoucher.invoice_date);
      } else {
        this.getBeforeValidation();
      }
    });

    this.getItems();
  }

  getBeforeValidation(){
    if(this.current_book >= this.corrent_date_valid){
      this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
      this.current_periad_enddate = new Date(this.activecompany.current_period_end);
      this.stockinhand.invoice_date =  new Date(this.current_periad_startdate);
    }else{
      this.current_periad_startdate = new Date(this.activecompany.current_period_start);
      this.current_periad_enddate = new Date(this.activecompany.current_period_end);
      this.stockinhand.invoice_date =  new Date(this.current_periad_startdate);
    }
  }

  getValidation(disableDate){
    if(this.stockinhand.is_before){
      if(this.current_book >= this.corrent_date_valid){
        this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
        this.current_periad_enddate = new Date(this.disableDateUid);
        this.stockinhand.invoice_date =  new Date(this.current_periad_startdate);
      }else{
        this.current_periad_startdate = new Date(this.activecompany.current_period_start);
        this.current_periad_enddate = new Date(this.disableDateUid);
        this.stockinhand.invoice_date =  new Date(this.current_periad_startdate);
      }
    }else{
      this.current_periad_startdate = new Date(disableDate);
      this.current_periad_enddate = new Date(this.activecompany.current_period_end);
      this.stockinhand.invoice_date = new Date(disableDate); 
    }
    // this.modalService.open(this.stockinhandmodal, { size: 'lg', backdrop : 'static', keyboard : false });
  }

  getItems(){
    console.log('iam here------>')
    this.itemsService.getitems({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
      if (data === null || data === undefined){
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true){
        this.itemList = data.Item.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      } else if (data['statusCode'] == 400){
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  getledgerData(item){
    this.ledger = item;
    this.stockinhand.ledger_id = item.uid;
  }

  async itemadded(item, index){
    if(item!==''){
      let data = await this.itemList.find(data=>data.uid===item);
      this.items[index] = await {
        'type':'debit',
        'item_id':data.uid,
        'quantity':'',
        'name':data.name,
        'select':true,
        'description':'',
        'hsn_code':data.hsn_code,
        'unit':data.unit && data.unit.uqc?data.unit.uqc:'',
        'price':0,
        'discount':0,
        'amount':0,
        'discount_type':'percentage',
        'total_amount':0,
        'igst_tax':data.tax.tax,
        'sgst':data.tax && data.tax.tax?Number(data.tax.tax)/2:0,
        'cgst':data.tax && data.tax.tax?Number(data.tax.tax)/2:0,
      };
      this.calAmount(this.items);
    }
  }

  
  async calAmount(data){
      var amount =await data.map(calAmount=> {
        return calAmount.total_amount;
      });
      let total_amount = await Number(amount.reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2);
      this.stockinhand.total_amount = total_amount;
      // this.stockinhand.total_amount = total_amount.toLocaleString('en-IN');
  }

async calculate(item, index){
  let total_price = Number(Number(item.quantity)*Number(item.price)).toFixed(2);

  if(item.discount_type === "percentage"){      
    let total = Number(Number(item.quantity)*Number(item.price)*Number(item.discount))/100;
    this.items[index].total_amount =  Number(Number(Number(item.quantity)*Number(item.price))-Number(total)).toFixed(2);
   }else{
    this.items[index].total_amount =  Number(Number(Number(item.quantity)*Number(item.price))-Number(item.discount)).toFixed(2);
  }

  this.items[index].amount =  Number(total_price);
  this.calAmount(this.items);
}

  async genrateVoucher(){ 
    this.stockinhand.itemAdd  = this.items;
    this.stockinhand.invoice_date = moment(this.stockinhand.invoice_date).format('MM-DD-YYYY');
    this.clicked = true;
    this.journalvoucherService.stockinhand(this.stockinhand).subscribe(data => {
    if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) { 
       this.modalService.dismissAll();
       this.stockinhand = {};
       this.items = [{}];
       this.router.navigate(['admin/stock_report']);
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success); 
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
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
