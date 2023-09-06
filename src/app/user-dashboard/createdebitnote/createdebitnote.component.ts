import { Component, OnInit,TemplateRef, ViewChild, ElementRef  } from '@angular/core';
import { LedgerService} from './../../service/ledger.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { ItemsService} from './../../service/items.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { DebitnoteService } from 'src/app/service/debitnote.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AddledgerComponent } from '../../component/addledger/addledger.component';
import { AdditemComponent } from '../../component/additem/additem.component';
import {MatDialog} from '@angular/material/dialog';
import { BuyplaneComponent } from '../../component/buyplane/buyplane.component';
import { BuyplaneService } from 'src/app/service/buyplane.service';
import Utils from './../../utils/utils';

@Component({
  selector: 'app-createdebitnote',
  templateUrl: './createdebitnote.component.html',
  styleUrls: ['./createdebitnote.component.css']
})

export class CreatedebitnoteComponent implements OnInit {
  activecompany : any;
  public data : any;
  activeuser:any;
  currentDate:any = new Date();
  current_periad_startdate : any ;
  current_periad_enddate : any;
  corrent_date_valid : any ;
  current_book : any ;
  items: any = [{}];
  taxs:any = [];
  vouchers:any = [];
  ledgerList:any = [];
  loader = true ;
  purposelist:any = [];
  banklist:any = [];
  ledgerBankList:any = [];
  bank_ledger:any;
  ledgersaleslist:any = [];
  showledger:boolean = false;
  showbankledger:boolean = false ;  
  showsalesledger:boolean = false ;
  purchasesaller : boolean = false ;
  select_composition : boolean = false;
  inclusivetype : boolean = false ;
  itemList:any = [];
  lastdatefind : any [];
  gross_amount : number =0;
  total_discount: number = 0;
  final_total : number = 0;
  total_amount: number;
  total_quantity:number;
  modalRef: NgbModalRef;
  imgbaseurl="";
  disableDate:any;
  disableDateUid:any;
  discountledger:any;
  disledger:any = {};
  ledger:any = {};
  purpose:any = {};
  clicked = false;
  ledgerfilter:any = [];
  
  subcription_end_date : any;
  server_date : any;
  setvalue :any;
  Userdata: any;
  
  debitVoucher:any = {
    itemAdd :[],
    invoice_date:'',
    company_id:'',
    buyer_ledger_id:'',
    purpose_id:'',
    shipping_address:"",
    discount_ledger:'',
    description:"",
    is_local: "yes",
    is_bank: "no",
    discount_type:"flat",
    isinclusive:"false",
    discount_percentage:"",
    discount:"0",
    narration:""
  };
  purpose_id: any;

  constructor(private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public globals: Globals, public ledgerService:LedgerService, public itemsService:ItemsService, public debitnoteService:DebitnoteService, public router:Router,config: NgbModalConfig, private modalService: NgbModal,private buyplaneService: BuyplaneService, public route:ActivatedRoute,public dialog: MatDialog){
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

  @ViewChild('debitnotemodal', { static: true }) debitnotemodal: TemplateRef<any>;

// ==============================================================================================================================
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
//___________________GET SINGLE USER____________________________________________________________________________
getplandatechanges(){
  this.buyplaneService.getsingleuserinfo({uid:this.localStorageService.getuserUId()}).subscribe(data => {
    if (data['success'] === true) {
          this.Userdata=data.user;
          this.setvalue = this.localStorageService.getuserinfo();
          this.setvalue.subscription_end_date = data.user.subscription_end_date ;
          this.localStorageService.saveUserDetail(this.setvalue);
          
          // this.subcription_end_date = this.setvalue.subscription_end_date;
          // this.server_date = this.setvalue.serverdate;
      }
    });
};
//___________________GET SINGLE USER END____________________________________________________________________________

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

// ==============================================================================================================================

async typeshow(value){  
  
  await this.items.forEach(async (element, index) => {
    this.items.pop(element.uid);
  });
  this.items = [{}];
  this.taxs = [];
  this.vouchers = [];  
  this.debitVoucher.total_amount = '';
  this.debitVoucher.sub_amount = '';
  this.inclusivetype = value;
}

async show(value){

  await this.items.forEach(async (element, index) => {
    this.items.pop(element.uid);
    this.ledger = '';
  });
  this.items = [{}];
  this.taxs = [];
  this.vouchers = [];  
  this.debitVoucher.total_amount = '';
  this.debitVoucher.sub_amount = '';
  
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
open(debitnotemodal) {
  this.modalService.open(debitnotemodal , { size: 'lg' });
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
  this.openbuyplaneModal();
  this.activecompany= this.localStorageService.getCompanyInfo();
  this.route.params.subscribe((params) => {
   if(params.status==="after"){
      this.debitVoucher.is_after=true;
      this.debitVoucher.is_before=false;
      this.debitVoucher.after_id=params.uid==='none'?'':params.uid;
    }else if(params.status==="before"){
      this.debitVoucher.is_before=true;
      this.debitVoucher.is_after=false;
      this.debitVoucher.after_id=params.uid==='none'?'':params.uid;
      this.disableDateUid = params.invoicedate;
    }else{
      this.debitVoucher.is_after=false;
      this.debitVoucher.is_before=false;
      this.debitVoucher.after_id='';
    }
  })
  this.current_book = new Date(this.activecompany.bookstart_date);
  this.corrent_date_valid = new Date(this.activecompany.current_period_start);
  this.debitVoucher.current_year = new Date(this.activecompany.current_period_start).getFullYear();
  this.debitVoucher.end_year = new Date(this.activecompany.current_period_end).getFullYear();
  this.activecompany.current_period_start = moment(this.activecompany.current_period_start).format('MMM-DD-YYYY');
  this.activecompany.current_period_end = moment(this.activecompany.current_period_end).format('MMM-DD-YYYY');
  this.debitVoucher.description = this.localStorageService.getCompanyTermsInfo();
  this.debitVoucher.company_id = this.localStorageService.getCompanyId();
  this.select_composition =  this.activecompany.composition_dealer;
  this.debitnoteService.LastDate({company_id:this.localStorageService.getCompanyId(),current_year:new Date(this.activecompany.current_period_start).getFullYear(),end_year:new Date(this.activecompany.current_period_end).getFullYear()}).subscribe(data => {
    if (data['success'] == true && data.DebitVoucher  && data.DebitVoucher.uid) {
      this.lastdatefind = data.DebitVoucher;
      this.disableDate = data.DebitVoucher.invoice_date;
      this.getValidation(data.DebitVoucher.invoice_date);
    } else {
      this.getBeforeValidation();
    }
  });
  this.getItems();
  this.getisbankyes(); 
  this.getledger();
  this.getPurposelist();
  this.getdiscount();
}

getBeforeValidation(){
  if(this.current_book >= this.corrent_date_valid){
    this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
    this.current_periad_enddate = new Date(this.activecompany.current_period_end);
    this.debitVoucher.invoice_date =  new Date(this.current_periad_startdate);
  }else{
    this.current_periad_startdate = new Date(this.activecompany.current_period_start);
    this.current_periad_enddate = new Date(this.activecompany.current_period_end);
    this.debitVoucher.invoice_date =  new Date(this.current_periad_startdate);
  }
  this.modalService.open(this.debitnotemodal, { size: 'lg', backdrop : 'static', keyboard : false });
}

getValidation(disableDate){
  if(this.debitVoucher.is_before){
    if(this.current_book >= this.corrent_date_valid){
      this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
      this.current_periad_enddate = new Date(this.disableDateUid);
      this.debitVoucher.invoice_date =  new Date(this.current_periad_startdate);
    }else{
      this.current_periad_startdate = new Date(this.activecompany.current_period_start);
      this.current_periad_enddate = new Date(this.disableDateUid);
      this.debitVoucher.invoice_date =  new Date(this.current_periad_startdate);
    }
  }else{
    this.current_periad_startdate = new Date(disableDate);
    this.current_periad_enddate = new Date(this.activecompany.current_period_end);
    this.debitVoucher.invoice_date = new Date(disableDate); 
  }
  this.modalService.open(this.debitnotemodal, { size: 'lg', backdrop : 'static', keyboard : false });
}


  getledger(){
    console.log('companyid in debit---------------->',this.localStorageService.getCompanyId())
    this.ledgerService.getledgerfilter({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
      console.log('data in debit------->',data)
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true){
        this.ledgerList = data && data.Ledger.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        console.log('ledgerList in create debit note------------>',this.ledgerList)
        this.loader = false;
        this.show(true);
      } else if (data['statusCode'] == 400){
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }
  
  
  getPurposelist(){
    this.debitnoteService.getPurpose({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
      this.purposelist =  data && data['city'].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    })
  };

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
  
  async getisbankyes(){
    await this.ledgerService.getisbank({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(async(data) => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        if(data.Ledger && data.Ledger.uid){
          this.banklist =await data.Ledger;
          this.debitVoucher.is_bank = 'yes';
        }else{
          this.debitVoucher.is_bank = 'no';
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        }
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  getpurposeData(item){
    this.purpose = item;
    this.debitVoucher.purpose_id = item.id;
  }

  getbankLedgerData(item){
    this.bank_ledger = item;
    this.debitVoucher.bank_ledger_id = item.uid;
    this.showbankledger = true;
  }
  
  getLedgerData(item){
    this.ledger = item;
    this.debitVoucher.buyer_ledger_id = item.uid;
      let street = item.street?item.street:'';
      let area = item.area?', '+item.area:'';
      let city = item.city && item.city.name?'  '+item.city.name:'';
      let state = item.city && item.city.state && item.city.state.name?', '+item.city.state.name:'';
      this.debitVoucher.shipping_address =street+area+city+state;
      this.showledger = true;
  }

  async itemadded(item, index){
    if(item!==''){
      let data = await this.itemList.find(data=>data.uid===item);
      this.items[index] = await {
        'type':'Credit',
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
       if(this.debitVoucher.is_local=='no' || this.debitVoucher.is_local=='No'){
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
                 'type':'Credit',
                 "tax_amount": Number(Number(Number(1*Number(item.total_amount))*Number(item.igst_tax))/100).toFixed(2),
               })
           }
         }else{
           this.taxs.push({
             "amount":Number(1*Number(item.total_amount)).toFixed(2),
             "tax_percentage":item.igst_tax,
             "tax_name":"IGST",
             'type':'Credit',
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
               'type':'Credit',
               'igst_tax':item.igst_tax,
             },{
               "amount":Number(1*Number(item.total_amount)).toFixed(2),
               "tax_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
               "tax_amount": Number(Number(Number(1*Number(item.total_amount))*Number(Number(item.igst_tax)/2))/100).toFixed(2),
               "tax_name":"CGST",
               'type':'Credit',
               'igst_tax':item.igst_tax,
             });
            
           }
         }else{
           this.taxs.push({
             "amount":Number(1*Number(item.total_amount)).toFixed(2),
             "tax_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
             "tax_amount": Number(Number(Number(1*Number(item.total_amount))*Number(Number(item.igst_tax)/2))/100).toFixed(2),
             "tax_name":"SGST",
             'type':'Credit',
             'igst_tax':item.igst_tax,
           },{
             "amount":Number(1*Number(item.total_amount)).toFixed(2),
               "tax_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
               "tax_amount": Number(Number(Number(1*Number(item.total_amount))*Number(Number(item.igst_tax)/2))/100).toFixed(2),
               "tax_name":"CGST",
               'type':'Credit',
               'igst_tax':item.igst_tax,
           });
           
         }
       }
       if(this.debitVoucher.is_local=='no' || this.debitVoucher.is_local=='No'){
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
               'type':'Credit',
               "tax_name":"IGST",
             })
           }
         }else{
           await this.vouchers.push({
             "amount":Number(1*Number(item.total_amount)).toFixed(2),
             "sale_percentage":item.igst_tax,
             "percentage":item.igst_tax?item.igst_tax:0,
             "sale_type":'outer-state',
             'type':'Credit',
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
               'type':'Credit',
             },{
                 "amount":Number(1*Number(item.total_amount)).toFixed(2),
                 "sale_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
                 "sale_type":'local',
                 "percentage":item.igst_tax?item.igst_tax:0,
                 "tax_name":"CGST",
                 'type':'Credit',
             });
           }
         }else{
           this.vouchers.push({
             "amount":Number(1*Number(item.total_amount)).toFixed(2),
             "sale_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
             "percentage":item.igst_tax?item.igst_tax:0,
             "sale_type":'local',
             "tax_name":"SGST",
             'type':'Credit',
           },{
               "amount":Number(1*Number(item.total_amount)).toFixed(2),
               "sale_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
               "percentage":item.igst_tax?item.igst_tax:0,
               "sale_type":'local',
               "tax_name":"CGST",
               'type':'Credit',
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
    this.debitVoucher.discount_ledger = this.disledger.uid;
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
      this.debitVoucher.sub_amount = Number(Number(Number(subamountadd) + Number(taxamountadd))).toFixed(2);
      let total_amount = Number(Number(totalamountadd) + Number(taxamountadd)).toFixed(2);
      // this.debitVoucher.total_amount = total_amount.toLocaleString('en-IN');
      this.debitVoucher.total_amount = total_amount;
    }else{
      var amount =await data.map(calAmount=> {
        return calAmount.total_amount;
      });
      this.debitVoucher.sub_amount = await Number(amount.reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2);
      let total_amount = await Number(amount.reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2);
      // this.debitVoucher.total_amount = total_amount.toLocaleString('en-IN');
      this.debitVoucher.total_amount = total_amount;
    }
    this.totalPrice(this.debitVoucher.discount);
  }

async totalPrice(data){
  if(this.debitVoucher.discount_type){
    if(this.debitVoucher.discount_type==="percentage"){
      let discountAmount =  Number(Number(Number(this.debitVoucher.sub_amount)*Number(data))/100).toFixed(2);
      this.debitVoucher.discount_percentage = discountAmount;
      let total_amount = Number(this.debitVoucher.sub_amount)+Number(discountAmount);
      // this.salesVoucher.total_amount = total_amount.toLocaleString('en-IN');
      this.debitVoucher.total_amount = Number(total_amount).toFixed(2);
    }else{
      let total_amount = Number(this.debitVoucher.sub_amount)+Number(data);
      // this.salesVoucher.total_amount = total_amount.toLocaleString('en-IN');
      this.debitVoucher.total_amount = Number(total_amount).toFixed(2);
    }
  }else{
    alert("Select discount type!");
  }
}
  
  async genrateVoucher(){
    this.clicked = false;
    this.debitVoucher.itemAdd = this.items;
    this.debitVoucher.taxAdd = this.taxs;
    this.debitVoucher.voucherAdd = this.vouchers;
    
    this.debitVoucher.invoice_date = moment(this.debitVoucher.invoice_date).format('MM-DD-YYYY');
    this.clicked = true;
    this.debitnoteService.DebitVoucher(this.debitVoucher).subscribe(data => {
      console.log('data------------->',data)
    if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        this.modalService.dismissAll();
       this.debitVoucher = {};
       this.items = [{}];
       this.taxs = [];
       this.vouchers = [];
       this.router.navigate(['admin/debitnote']);
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
}