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
import { AdditemComponent } from '../../component/additem/additem.component';
import { BuyplaneService } from 'src/app/service/buyplane.service';
import Utils from './../../utils/utils';

@Component({
  selector: 'app-edit-stockinhand',
  templateUrl: './edit-stockinhand.component.html',
  styleUrls: ['./edit-stockinhand.component.css']
})
export class EditStockinhandComponent implements OnInit {

  
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
  setvalue :any;
  Userdata: any;
  select_composition : boolean = false;
  current_periad_startdate : any ;
  current_periad_enddate : any ; 
  corrent_date_valid : any ;
  current_book : any ;
  uidvoucherprint : any;
  ledgerfilter:any = [];
  // stocktypeselect : boolean = false ;
  
  subcription_end_date : any;
  server_date : any;


  stockinhand:any = {
    itemAdd  :[],
    invoice_date:'',
    company_id:'',
    purpose_id:'7',
    ledger_id:'',
    voucher_type:"stockJournalVoucher",
    narration:"",
    type:"",
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


  // @ViewChild('stockinhandmodal', { static: true }) stockinhandmodal: TemplateRef<any>;

  // open(stockinhandmodal) {
  //   this.modalService.open(stockinhandmodal , { size: 'lg' });
  // }
  
  done(updateinvoice) {
    this.modalService.open(updateinvoice , { size: 'lg' , backdrop : 'static', keyboard : false });
  }

  // show(value){
  //   this.stocktypeselect = value;
  // }


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
    // this.subcription_end_date = this.activeuser.subscription_end_date;
    // this.server_date = this.activeuser.serverdate;
    this.subcription_end_date = this.activeuser.subscription_end_date;
    this.server_date = this.activeuser.serverdate;
    this.imgbaseurl= this.localStorageService.getBaseUrl();
    this.activecompany= this.localStorageService.getCompanyInfo();
    
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
    
    if(this.current_book >= this.corrent_date_valid){
      this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
      this.stockinhand.invoice_date =  new Date(this.current_periad_startdate);
    }else{
      this.current_periad_startdate = new Date(this.activecompany.current_period_start);
      this.stockinhand.invoice_date =  new Date(this.current_periad_startdate);
    }

    // this.getstockinhand();
    this.getItems();
    this.openbuyplaneModal();
    
    this.route.params.subscribe(async(params) => {
      await this.journalvoucherService.getstockinhand({voucher_id:params.uid}).subscribe(async(data) => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {

          if(data.ItemStockVoucher.item_stock_voucher_entries != '' && data.ItemStockVoucher.item_stock_voucher_entries != null){
            this.stockinhand = data.ItemStockVoucher;
            this.uidvoucherprint =this.stockinhand.uid;          
            this.items =await data.ItemStockVoucher.item_stock_voucher_entries && data.ItemStockVoucher.item_stock_voucher_entries.length>0?data.ItemStockVoucher.item_stock_voucher_entries:[];
            
            if(data.ItemStockVoucher && data.ItemStockVoucher.item_stock_voucher_entries && data.ItemStockVoucher.item_stock_voucher_entries.length>0){
            
              await data.ItemStockVoucher.item_stock_voucher_entries.map(ele =>{
                ele.price= Number(Number(ele.quantity*Number(ele.price)).toFixed(2));
                ele.amount= Number(Number(ele.quantity*Number(ele.price)).toFixed(2));
              })
              this.items = await data.ItemStockVoucher.item_stock_voucher_entries;
            }
          }else{
            this.stockinhand = data.ItemStockVoucher;           
            this.uidvoucherprint =this.stockinhand.uid;
            this.stockinhand.invoice_date = data.ItemStockVoucher.invoice_date;
            this.stockinhand.purpose_id = '7';
          }


          this.stockinhand = data.ItemStockVoucher;
          this.uidvoucherprint =this.stockinhand.uid;          
          this.items =await data.ItemStockVoucher.item_stock_voucher_entries && data.ItemStockVoucher.item_stock_voucher_entries.length>0?data.ItemStockVoucher.item_stock_voucher_entries:[];
          
          if(data.ItemStockVoucher && data.ItemStockVoucher.item_stock_voucher_entries && data.ItemStockVoucher.item_stock_voucher_entries.length>0){
           
            await data.ItemStockVoucher.item_stock_voucher_entries.map(ele =>{
              ele.price= Number(Number(ele.quantity*Number(ele.price)).toFixed(2));
              ele.amount= Number(Number(ele.quantity*Number(ele.price)).toFixed(2));
            })
            this.items = await data.ItemStockVoucher.item_stock_voucher_entries;
          }

          // this.show(data.JournalVoucher.is_local);

          // await this.getstockinhand();
          // this.getPurposelist();
          } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
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

  async getledgerData(item){
  let findpurpose = await this.stockledger.find(el=>el.uid===item);
    this.ledger = findpurpose;
    this.stockinhand.ledger_id = item.uid;
  }

  async itemadded(item, index){
    if(item!==''){
      let data = await this.itemList.find(data=>data.uid===item);
      this.items[index] = await {
        'type':'Debit',
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


Update(){
  this.stockinhand.itemAdd  = this.items;
  this.stockinhand.invoice_date = moment(this.stockinhand.invoice_date).format('MM-DD-YYYY');
  this.journalvoucherService.editstockinhandVoucher(this.stockinhand).subscribe(data => {
    this.router.navigate(['admin/viewsalesinvoice']);
  if (data === null || data === undefined) {
      this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
    } else if (data['success'] == true) {
    this.modalService.dismissAll();
    this.stockinhand = {};
    this.items = [{}];
     this.router.navigate(['admin/printstockvoucher', this.uidvoucherprint]);
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
