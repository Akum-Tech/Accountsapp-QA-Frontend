import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LedgerService} from './../../service/ledger.service';
import { LocalStorageService } from './../../service/local-storage.service';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DebitnoteService } from './../../service/debitnote.service';
import { AdditemComponent } from '../../component/additem/additem.component';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PrintdebitnoteService } from './../../service/printdebitnote.service';
import { AddledgerComponent } from '../../component/addledger/addledger.component';
import { ItemsService} from './../../service/items.service';
import * as moment from 'moment';
import { BuyplaneComponent } from '../../component/buyplane/buyplane.component';
import { BuyplaneService } from 'src/app/service/buyplane.service';
import Utils from './../../utils/utils';

@Component({
  selector: 'app-edit-debitnote',
  templateUrl: './edit-debitnote.component.html',
  styleUrls: ['./edit-debitnote.component.css']
})
export class EditDebitnoteComponent implements OnInit {

 
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
  uidvoucherprint : any;
  vouchers:any = [];
  ledgerList:any = [];
  banklist:any = [];
  ledgerBankList:any = [];
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
  setvalue :any;
  Userdata: any;
  modalRef: NgbModalRef;
  imgbaseurl="";
  discountledger:any;
  disledger:any = {};
  ledgerfilter:any = [];
  
  subcription_end_date : any;
  server_date : any;

  deleteItem:any =[];
  taxesamouneadd: Number = 0 ;
  showledger:boolean = false;
  DebitVoucher : any = [];
  taxesdata: any = [{}];
  selectedlocal = '';
  selectbank ='';
  select_teamsconditions = '';
  select_narration = '';
  purpose_id: any;
  buyer_ledger_id:any;
  purposelist:any = [];
  purpose:any = {};  
  ledger:any = {};

  debitVoucher:any = {
    itemAdd :[],
    invoice_date:new Date(),
    company_id:'',
    buyer_ledger_id:'',
    purpose_id:'',
    shipping_address:"",
    discount_ledger:'',
    description:"",
    is_local: "",
    is_bank: "",
    discount_type:"percentage",
    discount_percentage:"",
    isinclusive:"",
    discount:"0",
    narration:""
  };

  
  @ViewChild('debitnotemodal', { static: true }) debitnotemodal: TemplateRef<any>;

  constructor(private messagePanelService: MessagePanelService,private router: Router,private localStorageService: LocalStorageService, public globals: Globals,public printdebitnoteService:PrintdebitnoteService,public debitnoteService:DebitnoteService, private route: ActivatedRoute,config: NgbModalConfig, private modalService: NgbModal,private buyplaneService: BuyplaneService,public dialog: MatDialog, public ledgerService:LedgerService, public itemsService:ItemsService) { 
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
      this.deleteItem.push(element.uid);
    });
    this.items = [{}];
    this.taxs = [];
    this.vouchers = [];  
    this.debitVoucher.total_amount = '';
    this.debitVoucher.sub_amount = '';
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
  
  open(debitnotemodal) {
    this.modalService.open(debitnotemodal , { size: 'lg' });
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

getPurposelist(){
  this.debitnoteService.getPurpose({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
    this.purposelist = data && data['city'].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  })
};


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
    this.getdiscount();   
    this.activeuser = this.localStorageService.getuserinfo(); 
    this.subcription_end_date = this.activeuser.subscription_end_date;
    this.server_date = this.activeuser.serverdate;
    this.imgbaseurl=this.localStorageService.getBaseUrl();
    this.openbuyplaneModal();
    this.current_book = new Date(this.activecompany.bookstart_date);
    this.corrent_date_valid = new Date(this.activecompany.current_period_start);

    if(this.current_book >= this.corrent_date_valid){
      this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
    }else{
      this.current_periad_startdate = new Date(this.activecompany.current_period_start);
    }

    this.DebitVoucher.invoice_date = moment(this.DebitVoucher.invoice_date).format('MM-DD-YYYY');
    this.debitVoucher.current_year =new Date(this.activecompany.current_period_start).getFullYear();
    this.debitVoucher.end_year =new Date(this.activecompany.current_period_end).getFullYear();
    this.activecompany.current_period_start = moment(this.activecompany.current_period_start).format('MM-DD-YYYY');
    this.activecompany.current_period_end = moment(this.activecompany.current_period_end).format('MM-DD-YYYY');
    // this.current_periad_startdate = new Date(this.activecompany.current_period_start);
    this.current_periad_enddate = new Date(this.activecompany.current_period_end);
    this.select_composition =  this.activecompany.composition_dealer;
     await this.route.params.subscribe(async(params) => {
       await this.printdebitnoteService.getDebitnoteVoucher({voucher_id:params.uid}).subscribe(async(data) => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {

          
          if(data.DebitVoucher.DebitBuyer != '' && data.DebitVoucher.DebitBuyer != null){
            this.debitVoucher = data.DebitVoucher;
            this.uidvoucherprint =this.debitVoucher.uid;
            
            this.inclusivetype = data.DebitVoucher.isinclusive;
            
            this.debitVoucher.isinclusive = data.DebitVoucher.isinclusive.toString();
            this.purpose = data.DebitVoucher.purpose_voucher;
            this.ledger= data.DebitVoucher.DebitBuyer;
              this.show(data.DebitVoucher.is_local);
              
    
              this.showledger = true;
              this.showbankledger = true;
              if(data.DebitVoucher && data.DebitVoucher.item_entries && data.DebitVoucher.item_entries.length>0){
               
                await data.DebitVoucher.item_entries.map(ele =>{
                    if(data.DebitVoucher.is_local==='yes' && ele.igst_tax){
                        ele.sgst = Number(ele.igst_tax)/2;
                        ele.cgst = Number(ele.igst_tax)/2;
                    }
                    ele.amount= Number(Number(ele.quantity*Number(ele.price)).toFixed(2))
                })
                this.items = await data.DebitVoucher.item_entries;
              }
              
              await this.calTaxes(this.items); 
              this.taxesdata.forEach((element, index) => {
                this.taxesamouneadd = Number(this.taxesamouneadd) + Number(element.amount);
              });
      
              await this.getItems();
              this.getPurposelist();
              this.selectedlocal = data.DebitVoucher.is_local;
              this.selectbank =  data.DebitVoucher.is_bank;
              this.select_teamsconditions = data.DebitVoucher.description;
              this.select_narration = data.DebitVoucher.narration;
              
              await this.totalPrice(data.DebitVoucher.discount);  
          }else{
            this.modalService.open(this.debitnotemodal, { size: 'lg', backdrop : 'static', keyboard : false });
            this.debitVoucher = data.DebitVoucher;            
            this.uidvoucherprint =this.debitVoucher.uid;
            this.debitVoucher.invoice_date = data.DebitVoucher.invoice_date;
            this.debitVoucher.discount_type = 'flat';
            this.debitVoucher.is_local = 'yes';
            this.debitVoucher.isinclusive = 'false';
            this.show(true);
            await this.getItems();
            this.getPurposelist();
          }
         


       
          } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
      });
    }
  
    getledgerdataaccount(){
      this.ledgerService.getledgerfilter({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
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

    async getpurposeData(item){
      let findpurpose = await this.purposelist.find(el=>el.id===item);
      this.purpose = findpurpose;
      this.debitVoucher.purpose_id = this.purpose.id;
      }

    async getLedgerData(item){
      let findObj = await this.ledgerfilter.find(el=>el.uid===item);
      this.ledger = findObj;
      this.debitVoucher.buyer_ledger_id = this.ledger.uid;
        let street = this.ledger.street?this.ledger.street:'';
        let area = this.ledger.area?', '+this.ledger.area:'';
        let city = this.ledger.city && this.ledger.city.name?'  '+this.ledger.city.name:'';
        let state = this.ledger.city && this.ledger.city.state && this.ledger.city.state.name?', '+this.ledger.city.state.name:'';
        this.debitVoucher.shipping_address =street+area+city+state;
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


    Update(){
      this.debitVoucher.itemAdd = this.items;
      this.debitVoucher.taxAdd = this.taxs;
      this.debitVoucher.voucherAdd = this.vouchers;
      this.debitVoucher.deleteItem = this.deleteItem;
    
      this.debitVoucher.invoice_date = moment(this.debitVoucher.invoice_date).format('MM-DD-YYYY');
      this.debitnoteService.editdebitVoucher(this.debitVoucher).subscribe(data => {
        this.router.navigate(['admin/debitnote']);
      if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.modalService.dismissAll();
         this.debitVoucher = {};
         this.items = [{}];
         this.taxs = [];
         this.vouchers = [];
         this.router.navigate(['admin/printdebitnote', this.uidvoucherprint]);
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
