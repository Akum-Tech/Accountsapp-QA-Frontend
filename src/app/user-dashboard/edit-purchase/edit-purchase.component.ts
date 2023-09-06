import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LedgerService} from './../../service/ledger.service';
import { LocalStorageService } from './../../service/local-storage.service';
import { PurchaseinvoiceprintService } from './../../service/purchaseinvoiceprint.service';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseinvoiceService } from './../../service/purchaseinvoice.service';
import { AdditemComponent } from '../../component/additem/additem.component';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { AddledgerComponent } from '../../component/addledger/addledger.component';
import { ItemsService} from './../../service/items.service';
import * as moment from 'moment';
import { BuyplaneComponent } from '../../component/buyplane/buyplane.component';
import { BuyplaneService } from 'src/app/service/buyplane.service';
import Utils from './../../utils/utils';

@Component({
  selector: 'app-edit-purchase',
  templateUrl: './edit-purchase.component.html',
  styleUrls: ['./edit-purchase.component.css']
})
export class EditPurchaseComponent implements OnInit {

  
  activecompany : any;
  public data : any;
  currentDate:any = new Date();
  current_periad_startdate : any ;
  current_periad_enddate : any ;
  corrent_date_valid : any ;
  current_book : any ;
  items: any = [{}];
  activeuser:any;
  taxs:any = [];
  vouchers:any = [];
  ledgerList:any = [];
  ledgerfilter:any = [];
  banklist:any = [];
  ledgerBankList:any = [];
  uidvoucherprint : any;
  bank_ledger:any;
  ledgersaleslist:any = [];
  showbankledger:boolean = false;  
  purchasesaller : boolean = false ;
  select_composition : boolean = false;
  inclusivetype : boolean = false ;
  itemList:any = [];
  gross_amount : number =0;
  total_discount: number = 0;
  final_total : number = 0;
  total_amount: number;
  total_quantity:number;
  modalRef: NgbModalRef;
  imgbaseurl="";
  discountledger:any;
  setvalue :any;
  Userdata: any;
  disledger:any = {};
  
  subcription_end_date : any;
  server_date : any;

  deleteItem:any =[];
  taxesamouneadd: Number = 0 ;
  showledger:boolean = false;
  PurchaseVoucher : any = [];
  taxesdata: any = [{}];
  selectedlocal = '';
  selectbank ='';
  select_teamsconditions = '';
  select_narration = '';
  
  ledger:any = {};
  purchasevoucher:any = {
    itemAdd :[],
    invoice_date:new Date(),
    company_id:'',
    invoice_id:'',
    buyer_ledger_id:'',
    shipping_address:"",
    discount_ledger:'',
    description:"",
    is_local: "",
    is_bank: "",
    discount_type:"percentage",
    discount_percentage:"",
    isinclusive:"",
    roundoff_value:"",
    discount:"0",
    narration:""
  };
  
  @ViewChild('purchasevouchermodal', { static: true }) purchasevouchermodal: TemplateRef<any>;

  constructor(private messagePanelService: MessagePanelService,private router: Router,private localStorageService: LocalStorageService, public globals: Globals, public purchaseinvoiceprintService:PurchaseinvoiceprintService,public purchaseinvoiceService:PurchaseinvoiceService, private route: ActivatedRoute,config: NgbModalConfig,private buyplaneService: BuyplaneService, private modalService: NgbModal,public dialog: MatDialog, public ledgerService:LedgerService, public itemsService:ItemsService) { 
    this.activecompany=this.localStorageService.getCompanyInfo();
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

  getImage(image){
    if(image){
      return this.imgbaseurl+image;
    }else{
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  async typeshow(value){  
    await this.items.forEach(async (element, index) => {
      this.items.pop(element.uid);
    });
    this.items = [{}];
    this.taxs = [];
    this.vouchers = [];  
    this.purchasevoucher.total_amount = '';
    this.purchasevoucher.sub_amount = '';
    this.inclusivetype = value;
  }
 
  async show(value){

    await this.items.forEach(async (element, index) => {
      this.deleteItem.push(element.uid);
    });
    this.items = [{}];
    this.taxs = [];
    this.vouchers = [];  
    this.purchasevoucher.total_amount = '';
    this.purchasevoucher.sub_amount = '';
    this.purchasesaller = value;
    // this.activecompany;
    // this.ledgerList;
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
  
   addUser(){
    this.items.push({});
  }
  async removeUser(i, data){
    this.deleteItem.push(data);
    await this.items.pop(i);
    this.taxs = [];
    this.vouchers = [];
    await this.calTaxes(this.items); 
  }
  
  open(purchasevouchermodal) {
    this.modalService.open(purchasevouchermodal , { size: 'lg' });
  }

  
  done(updateinvoice) {
    this.modalService.open(updateinvoice , { size: 'lg' , backdrop : 'static', keyboard : false });
  }

// ---------------------------------------------------------------------------------------------- 
    
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
          
          // this.subcription_end_date = this.setvalue.subscription_end_date;
          // this.server_date = this.setvalue.serverdate;
      }
    });
};
//___________________GET SINGLE USER END____________________________________________________________________________

  async itemadded(item, index){
    if(item!==''){
      let data = await this.itemList.find(data=>data.uid===item);
      let exist = await this.deleteItem.findIndex(itm=>itm===item);
      if(exist>=0){
        await this.deleteItem.pop(exist);
      }
      this.items[index] = await {
        'type':'Purchase',
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
       if(this.purchasevoucher.is_local=='no' || this.purchasevoucher.is_local=='No'){
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
                 'type':'Purchase',
                 "tax_amount": Number(Number(Number(1*Number(item.total_amount))*Number(item.igst_tax))/100).toFixed(2),
               })
           }
         }else{
           this.taxs.push({
             "amount":Number(1*Number(item.total_amount)).toFixed(2),
             "tax_percentage":item.igst_tax,
             "tax_name":"IGST",
             'type':'Purchase',
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
               'type':'Purchase',
               'igst_tax':item.igst_tax,
             },{
               "amount":Number(1*Number(item.total_amount)).toFixed(2),
               "tax_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
               "tax_amount": Number(Number(Number(1*Number(item.total_amount))*Number(Number(item.igst_tax)/2))/100).toFixed(2),
               "tax_name":"CGST",
               'type':'Purchase',
               'igst_tax':item.igst_tax,
             });
            
           }
         }else{
           this.taxs.push({
             "amount":Number(1*Number(item.total_amount)).toFixed(2),
             "tax_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
             "tax_amount": Number(Number(Number(1*Number(item.total_amount))*Number(Number(item.igst_tax)/2))/100).toFixed(2),
             "tax_name":"SGST",
             'type':'Purchase',
             'igst_tax':item.igst_tax,
           },{
             "amount":Number(1*Number(item.total_amount)).toFixed(2),
               "tax_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
               "tax_amount": Number(Number(Number(1*Number(item.total_amount))*Number(Number(item.igst_tax)/2))/100).toFixed(2),
               "tax_name":"CGST",
               'type':'Purchase',
               'igst_tax':item.igst_tax,
           });
           
         }
       }
       if(this.purchasevoucher.is_local=='no' || this.purchasevoucher.is_local=='No'){
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
               'type':'Purchase',
               "tax_name":"IGST",
             })
           }
         }else{
           await this.vouchers.push({
             "amount":Number(1*Number(item.total_amount)).toFixed(2),
             "sale_percentage":item.igst_tax,
             "percentage":item.igst_tax?item.igst_tax:0,
             "sale_type":'outer-state',
             'type':'Purchase',
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
               'type':'Purchase',
             },{
                 "amount":Number(1*Number(item.total_amount)).toFixed(2),
                 "sale_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
                 "sale_type":'local',
                 "percentage":item.igst_tax?item.igst_tax:0,
                 "tax_name":"CGST",
                 'type':'Purchase',
             });
           }
         }else{
           this.vouchers.push({
             "amount":Number(1*Number(item.total_amount)).toFixed(2),
             "sale_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
             "percentage":item.igst_tax?item.igst_tax:0,
             "sale_type":'local',
             "tax_name":"SGST",
             'type':'Purchase',
           },{
               "amount":Number(1*Number(item.total_amount)).toFixed(2),
               "sale_percentage":item.igst_tax?Number(item.igst_tax)/2:0,
               "percentage":item.igst_tax?item.igst_tax:0,
               "sale_type":'local',
               "tax_name":"CGST",
               'type':'Purchase',
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
    this.purchasevoucher.sub_amount = Number(Number(Number(subamountadd) + Number(taxamountadd))).toFixed(2);
    let total_amount = Number(Number(totalamountadd) + Number(taxamountadd)).toFixed(2);
    // this.purchasevoucher.total_amount = total_amount.toLocaleString('en-IN');
    this.purchasevoucher.total_amount = total_amount;
  }else{
    var amount =await data.map(calAmount=> {
      return calAmount.total_amount;
    });
    this.purchasevoucher.sub_amount = await Number(amount.reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2);
    let total_amount = await Number(amount.reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2);
    // this.purchasevoucher.total_amount = total_amount.toLocaleString('en-IN');
    this.purchasevoucher.total_amount = total_amount;
  }
  this.totalPrice(this.purchasevoucher.discount);
}

async totalPrice(data){
  if(this.purchasevoucher.discount_type){
    if(this.purchasevoucher.discount_type==="percentage"){
      let discountAmount =  Number(Number(Number(this.purchasevoucher.sub_amount)*Number(data))/100).toFixed(2);
      this.purchasevoucher.discount_percentage = discountAmount;
      let total_amount = Number(this.purchasevoucher.sub_amount)+Number(discountAmount);
      // this.salesVoucher.total_amount = total_amount.toLocaleString('en-IN');
      this.purchasevoucher.total_amount = Number(total_amount).toFixed(2);
    }else{
      let total_amount = Number(this.purchasevoucher.sub_amount)+Number(data);
      // this.salesVoucher.total_amount = total_amount.toLocaleString('en-IN');
      this.purchasevoucher.total_amount = Number(total_amount).toFixed(2);
    }
  }else{
    alert("Select discount type!");
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

  async ngOnInit(){ 
    this.getledgerdataaccount();
    this.getplandatechanges();   
    this.activeuser = this.localStorageService.getuserinfo(); 
    this.subcription_end_date = this.activeuser.subscription_end_date;
    this.server_date = this.activeuser.serverdate;
    this.imgbaseurl=this.localStorageService.getBaseUrl();

    this.openbuyplaneModal();
    this.current_book = new Date(this.activecompany.bookstart_date);
    this.corrent_date_valid = new Date(this.activecompany.current_period_start);

    if(this.current_book >= this.corrent_date_valid){
      this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
      this.purchasevoucher.invoice_date =  new Date(this.current_periad_startdate);
    }else{
      this.current_periad_startdate = new Date(this.activecompany.current_period_start);
      this.purchasevoucher.invoice_date =  new Date(this.current_periad_startdate);
    }

    this.PurchaseVoucher.invoice_date = moment(this.PurchaseVoucher.invoice_date).format('MM-DD-YYYY');
    this.purchasevoucher.current_year =new Date(this.activecompany.current_period_start).getFullYear();
    this.purchasevoucher.end_year =new Date(this.activecompany.current_period_end).getFullYear();
    this.activecompany.current_period_start = moment(this.activecompany.current_period_start).format('MM-DD-YYYY');
    this.activecompany.current_period_end = moment(this.activecompany.current_period_end).format('MM-DD-YYYY');
    this.current_periad_enddate = new Date(this.activecompany.current_period_end);
    this.select_composition =  this.activecompany.composition_dealer;
     await this.route.params.subscribe(async(params) => {
       await this.purchaseinvoiceprintService.getpurchasevoucher({voucher_id:params.uid}).subscribe(async(data) => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {

          
          if(data.PurchaseVoucher.PurchaseLedger != '' && data.PurchaseVoucher.PurchaseLedger != null){
            this.purchasevoucher = data.PurchaseVoucher;
            this.uidvoucherprint =this.purchasevoucher.uid;
            this.ledger= data.PurchaseVoucher.PurchaseLedger;
              this.showledger = true;
              this.showbankledger = true;
              this.inclusivetype = data.PurchaseVoucher.isinclusive;
              
            this.purchasevoucher.isinclusive = data.PurchaseVoucher.isinclusive.toString();
              this.show(data.PurchaseVoucher.is_local);
              
              if(data.PurchaseVoucher && data.PurchaseVoucher.item_entries && data.PurchaseVoucher.item_entries.length>0){
    
                await data.PurchaseVoucher.item_entries.map(ele =>{
                    if(data.PurchaseVoucher.is_local==='yes' && ele.igst_tax){
                        ele.sgst = Number(ele.igst_tax)/2;
                        ele.cgst = Number(ele.igst_tax)/2;
                    }
                    
                  ele.amount= Number(Number(ele.quantity*Number(ele.price)).toFixed(2))
                })
                this.items = await data.PurchaseVoucher.item_entries;
              }
              await this.calTaxes(this.items); 
              this.taxesdata.forEach((element, index) => {
                this.taxesamouneadd = Number(this.taxesamouneadd) + Number(element.amount);
              });
      
              await this.getItems();
              this.selectedlocal = data.PurchaseVoucher.is_local;
              this.selectbank =  data.PurchaseVoucher.is_bank;
              this.select_teamsconditions = data.PurchaseVoucher.description;
              this.select_narration = data.PurchaseVoucher.narration;
    
              await this.totalPrice(data.PurchaseVoucher.discount);  
          }else{
            this.modalService.open(this.purchasevouchermodal, { size: 'lg', backdrop : 'static', keyboard : false });
            this.purchasevoucher = data.PurchaseVoucher;            
            this.uidvoucherprint =this.purchasevoucher.uid;
            this.purchasevoucher.invoice_date = data.PurchaseVoucher.invoice_date;
            this.purchasevoucher.discount_type = 'flat';
            this.purchasevoucher.is_local = 'yes';
            this.purchasevoucher.isinclusive = 'false';
            this.show(true);
            await this.getItems();
          }
         } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
      });
   
      this.getdiscount();
    }
  
    getledgerdataaccount(){
      this.ledgerService.getsalespurchaseVouchers({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true){
          this.ledgerList = data && data.Ledger.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        } else if (data['statusCode'] == 400){
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
    getItems(){
      this.itemsService.getitems({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
        if (data === null || data === undefined){
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true){
          this.itemList = data && data.Item.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
          this.items.map((item) =>{
            let finddata = this.itemList.find(el=>el.uid==item.item_id);
            if(finddata){
              item.name= finddata.name;
            }
          })
        } else if (data['statusCode'] == 400){
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }

    async getLedgerData(item){
      let findObj = await this.ledgerfilter.find(el=>el.uid===item);
      this.ledger = findObj;
      this.purchasevoucher.buyer_ledger_id = this.ledger.uid;
      let street = item.street?item.street:'';
      let city = item.city && item.city.name?'  '+item.city.name:'';
      let state = item.city && item.city.state && item.city.state.name?', '+item.city.state.name:'';
      this.purchasevoucher.shipping_address = street+city+state;
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
      this.purchasevoucher.discount_ledger = this.disledger.uid;
    }

    Update(){
      this.purchasevoucher.itemAdd = this.items;
      this.purchasevoucher.taxAdd = this.taxs;
      this.purchasevoucher.voucherAdd = this.vouchers;
      this.purchasevoucher.deleteItem = this.deleteItem;
      this.purchasevoucher.invoice_date = moment(this.purchasevoucher.invoice_date).format('MM-DD-YYYY');
      this.purchaseinvoiceService.editpuchaseVoucher(this.purchasevoucher).subscribe(data => {
        this.router.navigate(['admin/viewpurchasevoucher']);
      if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.modalService.dismissAll();
         this.purchasevoucher = {};
         this.items = [{}];
         this.taxs = [];
         this.vouchers = [];
         this.router.navigate(['admin/purchaseinvoiceprint', this.uidvoucherprint]);
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

















