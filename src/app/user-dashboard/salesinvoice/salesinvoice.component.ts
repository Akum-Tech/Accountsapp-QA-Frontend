import { Component, OnInit,TemplateRef, ViewChild, ElementRef  } from '@angular/core';
import { LedgerService} from './../../service/ledger.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MessagePanelService } from './../../service/message-panel.service';
import { ItemsService} from './../../service/items.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { SalesVoucherService } from 'src/app/service/sales-voucher.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AddledgerComponent } from '../../component/addledger/addledger.component';
import { AdditemComponent } from '../../component/additem/additem.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NativeDateAdapter,MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { BuyplaneComponent } from '../../component/buyplane/buyplane.component';
import { BuyplaneService } from 'src/app/service/buyplane.service';
import Utils from './../../utils/utils';
// import $ from 'jquery';
// tslint:disable-next-line:no-duplicate-imports


@Component({
  selector: 'app-salesinvoice',
  templateUrl: './salesinvoice.component.html',
  styleUrls: ['./salesinvoice.component.css']
})

export class SalesinvoiceComponent implements OnInit {

  activecompany : any;
  public data : any;     
  currentDate:any = new Date();
  current_periad_startdate :any;
  current_periad_enddate : any;  
  corrent_date_valid : any ;
  current_book : any ;
  datevalidation : any;
  items: any = [{}];
  items_pass: any = [{}];
  taxs:any = [];
  ledgerfilter:any = [];
  vouchers:any = [];
  ledgerList:any = [];
  banklist:any = [];
  ledgerBankList:any = [];
  bank_ledger:any;
  ledgersaleslist:any = [];
  showbankledger:boolean = false;  
  showsalesledger:boolean = false;
  purchasesaller : boolean = false ;
  inclusivetype : boolean = false ;
  select_composition : boolean = false;
  itemList:any = [];
  lastdatefind : any [];
  gross_amount : number = 0;
  total_discount: number = 0;
  setvalue :any;
  Userdata: any;
  final_total : number = 0;
  total_amount: number;
  clicked = false;
  
  subcription_end_date : any;
  server_date : any;
  
  total_quantity:number;
  modalRef: NgbModalRef;
  datecondition : any ;
  disableDate:any;
  disableDateUid:any;
  imgbaseurl="";
  ledger:any = {};
  discountledger:any = [];
  disledger:any = {};
  loader = true ;
  activeuser:any;
  salesVoucher:any = {
    itemAdd :[],
    invoice_date:'',
    company_id:'',
    buyer_ledger_id:'',
    shipping_address:"",
    discount_ledger:'',
    description:"",
    is_local: "yes",
    isinclusive:"false",
    is_bank: "",
    discount_type:"flat",
    discount_percentage:"",
    discount:"0",
    narration:""
  };

  constructor(private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public globals: Globals, public ledgerService:LedgerService, public itemsService:ItemsService, public salesVoucherService:SalesVoucherService, public router:Router,config: NgbModalConfig, private modalService: NgbModal,private buyplaneService: BuyplaneService, public route:ActivatedRoute,public dialog: MatDialog){
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

  @ViewChild('salesvouchermodal', { static: true }) salesvouchermodal: TemplateRef<any>;

  // getDate(date){
  //   let data = date.split('T');
  //   if(data.length===1){
  //     date = date.replaceAll('-', '/');
  //   }
  //   return moment(new Date(date)).format('DD-MMM-YYYY')
  // }
// -----------------------------------------------------------------------------------------------------------------------
public openbuyplaneModal(){
  if(this.subcription_end_date < this.server_date || this.subcription_end_date == null ){
    
    const dialogRef = this.dialog.open(BuyplaneComponent, { width: '800px', disableClose: true, hasBackdrop:true});
    dialogRef.afterClosed().subscribe(result =>  {
     this.modalService.dismissAll();
    });
  }else{
  } 
}  

public openLedgerAddModal(){ 
  this.modalService.dismissAll();
  this.router.navigate(['admin/addledger']);
}

public openItemAddModal(){
  // this.router.navigate(['/additem']);
  const dialogRef = this.dialog.open(AdditemComponent, { width: '800px', disableClose: true, hasBackdrop:true ,data:{}});
  dialogRef.afterClosed().subscribe(result =>  {
      this.getItems();
  });

}

// ---------------------------------------------------------------------------------------------- 


//___________________GET SINGLE USER____________________________________________________________________________
getplandatechanges(){
  this.buyplaneService.getsingleuserinfo({uid:this.localStorageService.getuserUId()}).subscribe(data => {
    if (data['success'] === true) {
          this.Userdata=data.user;
          this.setvalue = this.localStorageService.getuserinfo();
          this.setvalue.subscription_end_date = data.user.subscription_end_date ;
          this.localStorageService.saveUserDetail(this.setvalue);
      }
    });
};
//___________________GET SINGLE USER END____________________________________________________________________________

async typeshow(value){  
  await this.items.forEach(async (element, index) => {
    this.items.pop(element.uid);
  });
  this.items = [{}];
  this.taxs = [];
  this.vouchers = [];  
  this.salesVoucher.total_amount = '';
  this.salesVoucher.sub_amount = '';
  this.inclusivetype = value;
}

async show(value){
  await this.items.forEach(async (element, index) => {
    this.items.pop(element.uid);
    this.ledger = '';
    this.salesVoucher.shipping_address = '';
  });
  this.items = [{}];
  this.taxs = [];
  this.vouchers = [];  
  this.salesVoucher.total_amount = '';
  this.salesVoucher.sub_amount = '';
    this.purchasesaller = value;
    this.activecompany;
    this.ledgerList;
    this.ledgerfilter = [];
    if(this.purchasesaller == true){
      if(this.ledgerList.length>0){
        this.ledgerList.map((ledgerfilter)=>{
          if(this.activecompany.state_id === ledgerfilter.state_id || ledgerfilter.name === "Cash" ){
            this.ledgerfilter.push(ledgerfilter);
          }else{
            return 0;
          }
        });
      }
    }else{    
      if(this.ledgerList.length>0){
        this.ledgerList.map((ledgerfilter)=>{
          if(this.activecompany.state_id != ledgerfilter.state_id){
            this.ledgerfilter.push(ledgerfilter);
          }else{
            return 0;
          }
        });
      }
    }
  }

  getImage(image){
    if(image){
      return this.imgbaseurl+image;
    }else{
    }
  }

  
  
   addUser(){
    this.items.push({});
  }
  async removeUser(i){
    await this.items.pop(i);
    this.taxs = [];
    this.vouchers = [];
    await this.calTaxes(this.items); 
  }
  
  open(salesvouchermodal) {
    this.modalService.open(salesvouchermodal , { size: 'lg' });
  }

  done(createinvoice) {
    this.modalService.open(createinvoice , { size: 'lg' , backdrop : 'static', keyboard : false });
  }

  async ngOnInit() { 
    this.getplandatechanges(); 
    this.activeuser = this.localStorageService.getuserinfo(); 
    this.subcription_end_date = this.activeuser.subscription_end_date;
    this.server_date = this.activeuser.serverdate;
    this.imgbaseurl= this.localStorageService.getBaseUrl();
    this.activecompany= this.localStorageService.getCompanyInfo();
    this.route.params.subscribe((params) => {
     if(params.status==="after"){
        this.salesVoucher.is_after=true;
        this.salesVoucher.is_before=false;
        this.salesVoucher.after_id=params.uid==='none'?'':params.uid;
      }else if(params.status==="before"){
        this.salesVoucher.is_before=true;
        this.salesVoucher.is_after=false;
        this.salesVoucher.after_id=params.uid==='none'?'':params.uid;
        this.disableDateUid = params.invoicedate;
      }else{
        this.salesVoucher.is_after=false;
        this.salesVoucher.is_before=false;
        this.salesVoucher.after_id='';
      }
    })
    

    this.current_book = new Date(this.activecompany.bookstart_date);
    this.corrent_date_valid = new Date(this.activecompany.current_period_start);
    this.salesVoucher.current_year = new Date(this.activecompany.current_period_start).getFullYear();
    this.salesVoucher.end_year = new Date(this.activecompany.current_period_end).getFullYear();
    this.activecompany.current_period_start = moment(this.activecompany.current_period_start).format('MMM-DD-YYYY');
    this.activecompany.current_period_end = moment(this.activecompany.current_period_end).format('MMM-DD-YYYY');
    this.salesVoucher.description = this.localStorageService.getCompanyTermsInfo();
    this.salesVoucher.company_id = this.localStorageService.getCompanyId();
    this.select_composition =  this.activecompany.composition_dealer;

    this.salesVoucherService.LastDate({company_id:this.localStorageService.getCompanyId(),current_year:new Date(this.activecompany.current_period_start).getFullYear(),end_year:new Date(this.activecompany.current_period_end).getFullYear()}).subscribe(data => {
      this.lastdatefind = data.Item;
      if (data['success'] == true && data.SaleVoucher  && data.SaleVoucher.uid) {
        this.lastdatefind = data.SaleVoucher;
        this.disableDate = data.SaleVoucher.invoice_date;
        this.getValidation(data.SaleVoucher.invoice_date);
      } else {
        this.getBeforeValidation();
      }  
    });
    this.getItems();
    this.getisbankyes();
    this.getledgerdataaccount();
    this.getdiscount();
    this.openbuyplaneModal();
  }
  

  getBeforeValidation(){
    if(this.current_book >= this.corrent_date_valid){
      this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
      this.current_periad_enddate = new Date(this.activecompany.current_period_end);
      this.salesVoucher.invoice_date =  new Date(this.current_periad_startdate);
    }else{
      this.current_periad_startdate = new Date(this.activecompany.current_period_start);
      this.current_periad_enddate = new Date(this.activecompany.current_period_end);
      this.salesVoucher.invoice_date =  new Date(this.current_periad_startdate);
    }
    this.modalService.open(this.salesvouchermodal, { size: 'lg', backdrop : 'static', keyboard : false });
  }

  getValidation(disableDate){
    if(this.salesVoucher.is_before){
      if(this.current_book >= this.corrent_date_valid){
        this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
        this.current_periad_enddate = new Date(this.disableDateUid);
        this.salesVoucher.invoice_date =  new Date(this.current_periad_startdate);
      }else{
        this.current_periad_startdate = new Date(this.activecompany.current_period_start);
        this.current_periad_enddate = new Date(this.disableDateUid);
        this.salesVoucher.invoice_date =  new Date(this.current_periad_startdate);
      }
    }else{
      this.current_periad_startdate = new Date(disableDate);
      this.current_periad_enddate = new Date(this.activecompany.current_period_end);
      this.salesVoucher.invoice_date = new Date(disableDate); 
    }
    this.modalService.open(this.salesvouchermodal, { size: 'lg', backdrop : 'static', keyboard : false });
  }

  customSearchFn(term: string, item) {
    item.name = item.name.replace(",", "");
    term = term.toLocaleLowerCase();
    return item.name.toLocaleLowerCase().indexOf(term) == 0;
  }

  getItems(){
    this.itemsService.getitems({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
      if (data === null || data === undefined){
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true){
        this.itemList = data && data.Item.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      } else if (data['statusCode'] == 400){
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  getledgerdataaccount(){
    this.ledgerService.getsalespurchaseVouchers({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true){
        this.ledgerList = data && data.Ledger.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        this.loader = false;
        this.show(true);
      } else if (data['statusCode'] == 400){
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  getdiscount(){
    this.ledgerService.getdiscountledgershow({company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        this.discountledger = data && data.Ledger.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }
  
  async getdiscountLedgerData(item){
    let finddiscount = await this.discountledger.find(el=>el.uid===item);
    this.disledger = finddiscount;
    this.salesVoucher.discount_ledger = this.disledger.uid;
  }


  async getisbankyes(){
    await this.ledgerService.getisbank({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(async(data) => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        if(data.Ledger && data.Ledger.uid){
          this.banklist =await data.Ledger;
          this.salesVoucher.is_bank = 'yes';
        }else{
          this.salesVoucher.is_bank = 'no';
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        }
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  getLedgerData(item){
    this.ledger = item;
    this.salesVoucher.buyer_ledger_id = item.uid;
    
      let street = item.street?item.street:'';
      let city = item.city && item.city.name?' '+item.city.name:'';
      let state = item.city && item.city.state && item.city.state.name?', '+item.city.state.name:'';
      this.salesVoucher.shipping_address = street+city+state;
  }

  getbankLedgerData(item){
    this.bank_ledger = item;
    this.salesVoucher.bank_ledger_id = item.uid;
    this.showbankledger = true;
  }
  
  async itemadded(item, index){
    if(item!==''){
      let data = await this.itemList.find(data=>data.uid===item);
      this.items[index] = await {
        'type':'Sales',
        'item_id':data.uid,
        'quantity':'',
        'name':data.name,
        'select':true,
        'description':'',
        'hsn_code':data.hsn_code,
        'unit':data.unit && data.unit.uqc?data.unit.uqc:'',
        'price':data.rate,
        'discount':0,
        'amount':Number(0*Number(data.rate)),
        'discount_type':'percentage',
        'total_amount':Number(0*Number(data.rate)),
        'igst_tax':data.tax.tax,
        'sgst':data.tax && data.tax.tax?Number(data.tax.tax)/2:0,
        'cgst':data.tax && data.tax.tax?Number(data.tax.tax)/2:0,
      };
      
      this.calTaxes(this.items);
    }
  }

  
  async calTaxes(data){
    if(data.length>0){
       data.map(async(item)=>{
       if(this.salesVoucher.is_local=='no' || this.salesVoucher.is_local=='No'){
         if(this.taxs.length>0){
           let find = await this.taxs.findIndex((tax)=>tax.tax_percentage===item.igst_tax);
           if(find>=0){
             var amount =await data.map(calAmount=>{
               if(calAmount.igst_tax===this.taxs[find].tax_percentage){
                 return calAmount.total_amount;
               }else{
                 return 0;
               }
               });
             this.taxs[find].amount =await Number(amount.reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2);
             this.taxs[find].tax_amount = Number(Number(Number(this.taxs[find].amount)*Number(this.taxs[find].tax_percentage))/100).toFixed(2);
           }else{
             this.taxs.push({
                 "amount":Number(1*Number(item.total_amount)).toFixed(2),
                 "tax_percentage":item.igst_tax,
                 "tax_name":"IGST",
                 'type':'Sales',
                 "tax_amount": Number(Number(Number(1*Number(item.total_amount))*Number(item.igst_tax))/100).toFixed(2),
               })
           }
         }else{
           this.taxs.push({
             "amount":Number(1*Number(item.total_amount)).toFixed(2),
             "tax_percentage":item.igst_tax,
             "tax_name":"IGST",
             'type':'Sales',
             "tax_amount": Number(Number(Number(1*Number(item.total_amount))*Number(item.igst_tax))/100).toFixed(2),  //(pEarned/pPos) * 100,
           })
         }
       }else{
         if(this.taxs.length>0){
           let find = await this.taxs.filter((tax)=>tax.igst_tax===item.igst_tax);
           if(find.length>0){
             find.map(async(item)=>{
               if(item.tax_name === "SGST"){
                 let amount =await data.map(calAmount=> {
                   if(Number(calAmount.sgst)===Number(item.tax_percentage)){
                     return calAmount.total_amount;
                   }else{
                     return 0;
                   }
                 });
                 item.amount = await Number(amount.reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2);
                 item.tax_amount =Number(Number(Number(item.amount)*Number(item.tax_percentage))/100).toFixed(2);
               }else{
                 let amount =await data.map(calAmount=> {
                   if(Number(calAmount.cgst)===Number(item.tax_percentage)){
                     return calAmount.total_amount;
                   }else{
                     return 0;
                   }
                 });
                 item.amount =await Number(amount.reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2);
                 item.tax_amount = Number(Number(Number(item.amount)*Number(item.tax_percentage))/100).toFixed(2);
               }
             })
           }else{
             this.taxs.push({
               "amount":Number(1*Number(item.total_amount)).toFixed(2),
               "tax_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
               "tax_amount": Number(Number(Number(1*Number(item.total_amount))*Number(Number(item.igst_tax)/2))/100).toFixed(2),
               "tax_name":"SGST",
               'type':'Sales',
               'igst_tax':item.igst_tax,
             },{
               "amount":Number(1*Number(item.total_amount)).toFixed(2),
               "tax_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
               "tax_amount": Number(Number(Number(1*Number(item.total_amount))*Number(Number(item.igst_tax)/2))/100).toFixed(2),
               "tax_name":"CGST",
               'type':'Sales',
               'igst_tax':item.igst_tax,
             });
            
           }
         }else{
           this.taxs.push({
             "amount":Number(1*Number(item.total_amount)).toFixed(2),
             "tax_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
             "tax_amount": Number(Number(Number(1*Number(item.total_amount))*Number(Number(item.igst_tax)/2))/100).toFixed(2),
             "tax_name":"SGST",
             'type':'Sales',
             'igst_tax':item.igst_tax,
           },{
             "amount":Number(1*Number(item.total_amount)).toFixed(2),
               "tax_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
               "tax_amount": Number(Number(Number(1*Number(item.total_amount))*Number(Number(item.igst_tax)/2))/100).toFixed(2),
               "tax_name":"CGST",
               'type':'Sales',
               'igst_tax':item.igst_tax,
           });
           
         }
       }
       if(this.salesVoucher.is_local=='no' || this.salesVoucher.is_local=='No'){
         if(this.vouchers.length>0){
           let find = await this.vouchers.findIndex((tax)=>tax.sale_percentage===item.igst_tax);
           if(find>=0){
             var amount =await data.map(calAmount=> {
               if(calAmount.igst_tax===this.taxs[find].tax_percentage){
                 return calAmount.total_amount;
               }else{
                 return 0;
               }
             });
             this.vouchers[find].amount =await amount.reduce((a, b) => Number(a) + Number(b), 0);
             this.vouchers[find].sale_percentage =await item.igst_tax;
           }else{
             await this.vouchers.push({
               "amount":Number(1*Number(item.total_amount)).toFixed(2),
               "sale_percentage":item.igst_tax,
               "sale_type":'outer-state',
               "percentage":item.igst_tax?item.igst_tax:0,
               'type':'Sales',
               "tax_name":"IGST",
             })
           }
         }else{
           await this.vouchers.push({
             "amount":Number(1*Number(item.total_amount)).toFixed(2),
             "sale_percentage":item.igst_tax,
             "percentage":item.igst_tax?item.igst_tax:0,
             "sale_type":'outer-state',
             'type':'Sales',
             "tax_name":"IGST",
           })
         }
       }else{
         if(this.vouchers.length>0){
           let find = await this.vouchers.filter((tax)=>tax.percentage===item.igst_tax);
           if(find.length>0){
               find.map(async(item)=>{
                 if(item.tax_name === "SGST"){
                   let amount =await data.map(calAmount=> {
                     if(calAmount.sgst===item.sale_percentage){
                       return calAmount.total_amount;
                     }else{
                       return 0;
                     }
                   });
                   item.amount =await Number(amount.reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2);
                 }else{
                   let amount =await data.map(calAmount=> {
                     if(calAmount.cgst===item.sale_percentage){
                       return calAmount.total_amount;
                     }else{
                       return 0;
                     }
                   });
                   item.amount =await Number(amount.reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2);
                 }
               })
           }else{
             this.vouchers.push({
               "amount":Number(1*Number(item.total_amount)).toFixed(2),
               "sale_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
               "sale_type":'local',
               "percentage":item.igst_tax?item.igst_tax:0,
               "tax_name":"SGST",
               'type':'Sales',
             },{
                 "amount":Number(1*Number(item.total_amount)).toFixed(2),
                 "sale_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
                 "sale_type":'local',
                 "percentage":item.igst_tax?item.igst_tax:0,
                 "tax_name":"CGST",
                 'type':'Sales',
             });
           }
         }else{
           this.vouchers.push({
             "amount":Number(1*Number(item.total_amount)).toFixed(2),
             "sale_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
             "percentage":item.igst_tax?item.igst_tax:0,
             "sale_type":'local',
             "tax_name":"SGST",
             'type':'Sales',
           },{
               "amount":Number(1*Number(item.total_amount)).toFixed(2),
               "sale_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
               "percentage":item.igst_tax?item.igst_tax:0,
               "sale_type":'local',
               "tax_name":"CGST",
               'type':'Sales',
           });
         }
       }
     });
     await this.totaltax(this.taxs ,this.items);
    }else{
     this.items = [{}];
     this.taxs = [];
     this.vouchers = [];
    }
   }
 
 

 async totaltax(taxes ,data){  
  let taxamountadd;
  let subamountadd;
  let totalamountadd;
  if(this.select_composition == false){
    var amount =await data.map(calAmount=> {
        return calAmount.total_amount;
    });
    subamountadd = await amount.reduce((a, b) => Number(a) + Number(b), 0);
    totalamountadd = await amount.reduce((a, b) => Number(a) + Number(b), 0);

    var tax_amountadd =await taxes.map(callTaxes=> {
        return callTaxes.tax_amount;
    });
    taxamountadd = await tax_amountadd.reduce((a, b) => Number(a) + Number(b), 0);
    this.salesVoucher.sub_amount = Number(Number(Number(subamountadd) + Number(taxamountadd))).toFixed(2);
    let total_amount = Number(Number(totalamountadd) + Number(taxamountadd)).toFixed(2);
    // this.salesVoucher.total_amount = total_amount.toLocaleString('en-IN');
    this.salesVoucher.total_amount = total_amount;
  }else{
    var amount =await data.map(calAmount=> {
      return calAmount.total_amount;
    });
    this.salesVoucher.sub_amount = await Number(amount.reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2);
    let total_amount = await Number(amount.reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2);
    // this.salesVoucher.total_amount = total_amount.toLocaleString('en-IN');
    this.salesVoucher.total_amount = total_amount;
  }
  this.totalPrice(this.salesVoucher.discount);
}

  async totalPrice(data){
    if(this.salesVoucher.discount_type){
      if(this.salesVoucher.discount_type==="percentage"){
        let discountAmount =  Number(Number(Number(this.salesVoucher.sub_amount)*Number(data))/100).toFixed(2);
        this.salesVoucher.discount_percentage = discountAmount;
        let total_amount = Number(this.salesVoucher.sub_amount)+Number(discountAmount);
        // this.salesVoucher.total_amount = total_amount.toLocaleString('en-IN');
        this.salesVoucher.total_amount = Number(total_amount).toFixed(2);
      }else{
        let total_amount = Number(this.salesVoucher.sub_amount)+Number(data);
        // this.salesVoucher.total_amount = total_amount.toLocaleString('en-IN');
        this.salesVoucher.total_amount = Number(total_amount).toFixed(2);
      }
    }else{
      alert("Select discount type!");
    }
  }
  
  
  async genrateVoucher(){
    this.clicked = false;
    this.salesVoucher.itemAdd = this.items;
    this.salesVoucher.taxAdd = this.taxs;
    this.salesVoucher.voucherAdd = this.vouchers;
    this.salesVoucher.invoice_date = moment(this.salesVoucher.invoice_date).format('MM-DD-YYYY');
    this.clicked = true;
    this.salesVoucherService.salesVoucher(this.salesVoucher).subscribe(data => {
    if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {   
       this.modalService.dismissAll();
       this.salesVoucher = {};
       this.items = [{}];
       this.taxs = [];
       this.vouchers = [];
       this.router.navigate(['admin/viewsalesinvoice']);
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  async calculate(item, index){
    if(this.inclusivetype == true){
      let gstamount = Number(Number(item.price) * Number(item.igst_tax))/Number(Number(100)+Number(item.igst_tax));
      let total_amount = Number(item.price) - Number(gstamount);
      let total_price = Number(Number(item.quantity)*Number(item.price)).toFixed(2);

      if(item.discount_type === "percentage"){      
        let total = Number(Number(item.quantity)*Number(total_amount)*Number(item.discount))/100;
        this.items[index].total_amount =  Number(Number(Number(item.quantity)*Number(total_amount))-Number(total)).toFixed(2);
       }else{
        this.items[index].total_amount =  Number(Number(Number(item.quantity)*Number(total_amount))-Number(item.discount)).toFixed(2);
      }
      this.items[index].amount =  Number(total_price);
      this.calTaxes(this.items);
    }else{
      let total_price = Number(Number(item.quantity)*Number(item.price)).toFixed(2);
      if(item.discount_type === "percentage"){      
        let total = Number(Number(item.quantity)*Number(item.price)*Number(item.discount))/100;
        this.items[index].total_amount =  Number(Number(Number(item.quantity)*Number(item.price))-Number(total)).toFixed(2);
       }else{
        this.items[index].total_amount =  Number(Number(Number(item.quantity)*Number(item.price))-Number(item.discount)).toFixed(2);
      }
      this.items[index].amount =  Number(total_price);
      this.calTaxes(this.items);
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
}

 
