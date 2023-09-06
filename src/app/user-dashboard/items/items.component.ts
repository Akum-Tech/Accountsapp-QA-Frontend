import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ItemsService} from './../../service/items.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { Router } from '@angular/router';
import { UserinfoModule } from 'src/app/model/userinfo/userinfo.module';
import { AddstockgroupComponent } from '../../component/addstockgroup/addstockgroup.component';
import { BuyplaneComponent } from '../../component/buyplane/buyplane.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BuyplaneService } from 'src/app/service/buyplane.service';
import Utils from './../../utils/utils';
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {


  deleteData:any = {};
  modalRef: BsModalRef;
  public data : any;
  unitlist:any =[];
  stocklist:any =[];
  qualitylist:any =[];
  descriptionlist:any =[];
  itemslist: any =[];
  totalVal :any;
  taxelist:any =[];
  loader = true ;
  setvalue :any;
  Userdata: any;
  currentDate:any = new Date();
  dataNotFount = true ;
  
  subcription_end_date : any;
  server_date : any;

  stock_group_id_new : string='';
  // sub_stock_group_id : string='';.
  clicked = false;
  stock_sub_group_id : string='';
  cessblock : boolean =false;
  activecompany : any;
  period_start:any;
  period_end:any;
  activeuser:any;
  selectedType = '';


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  show(value){
    this.cessblock = value;
  }

  itemsform = this.formBuilder.group({
    name: ['', Validators.required],
    unit: ['', Validators.required],
    stock_group_id: ['', Validators.required],
    stock_sub_group_id: [''],
    hsn_code: [''],
    quantity: [''],
    rate: [''],
    total_value: [''],
    taxes_slab_id: ['', Validators.required],
    cess_tax: [''],
    cess: ['no'],
    isgst_applicable: [false],
    taxes_slab_value:[''],
		effective_date:['']
  }); 

  validation_messages={
    'name':[
    { type:'required', message:'Please Enter Name'}
    ],
    'unit':[
    { type:'required', message:'Please Enter Unit'}
    ],
    'stock_group_id':[
    { type:'required', message:'Please Enter Stock Group'}
    ],
    'taxes_slab_id':[
      { type:'required', message:'Please Enter IGST Tax'}
      ],
  }

  constructor(public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, private buyplaneService: BuyplaneService,public itemsService:ItemsService,private modalService: BsModalService,public dialog: MatDialog){ 
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

  // ----------------------------------------------------------------------------------------------

  public openStockAddModal(){
    this.modalRef.hide();
    this.router.navigate(['admin/addstockgroup']);
  }

// -----------------------------------------------------------------------------------------------------------------------
public openbuyplaneModal(){
  if(this.subcription_end_date < this.server_date || this.subcription_end_date == null ){
    this.modalRef.hide();
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
 

  additems(){
    this.clicked = false;
    let name = this.itemsform.controls['name'].value? this.itemsform.controls['name'].value:'';
    let unit = this.itemsform.controls['unit'].value?this.itemsform.controls['unit'].value:'';
    let stock_group_id = this.itemsform.controls['stock_group_id'].value?this.itemsform.controls['stock_group_id'].value:'';
    // let stock_sub_group_id = this.itemsform.controls['stock_sub_group_id'].value?this.itemsform.controls['stock_sub_group_id'].value:'';
    let hsn_code = this.itemsform.controls['hsn_code'].value?this.itemsform.controls['hsn_code'].value:'';
    let quantity = this.itemsform.controls['quantity'].value?this.itemsform.controls['quantity'].value:'0';
    let rate = this.itemsform.controls['rate'].value?this.itemsform.controls['rate'].value:'0';
    let total_value = this.itemsform.controls['total_value'].value?this.itemsform.controls['total_value'].value:'';
    let taxes_slab_id = this.itemsform.controls['taxes_slab_id'].value?this.itemsform.controls['taxes_slab_id'].value:'';
    let cess_tax = this.itemsform.controls['cess_tax'].value?this.itemsform.controls['cess_tax'].value:'';
    let cess = this.itemsform.controls['cess'].value?this.itemsform.controls['cess'].value==='no'?false:true:false;
    let isgst_applicable = this.itemsform.controls['isgst_applicable'].value?this.itemsform.controls['isgst_applicable'].value:false;
    let taxes_slab_value=this.getTaxexValue(taxes_slab_id);
    if (!name) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Name", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }
    // else if(!stock_group_id) {
    //   this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Stock Group", this.globals.messageCloseTime, this.globals.messageType.error);
    //   return false;
    // }
    else if(!unit) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Unit", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }
    else if(!taxes_slab_id) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter IGST Tax", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }
    else{

      let obj = {"company_id":this.localStorageService.getCompanyId(),"name": name,"unit_id": unit,"stock_group_id": this.stock_group_id_new,"stock_sub_group_id":this.stock_sub_group_id,"hsn_code": hsn_code,"quantity":quantity.toString(),"rate": rate.toString(),"total_value": this.totalVal.toString(),"taxes_slab_id":taxes_slab_id,"cess_tax":cess_tax,"cess":cess,"isgst_applicable": isgst_applicable,"period_start": this.period_start=this.activecompany.current_period_start,"period_end": this.period_end=this.activecompany.current_period_end,"taxes_slab_value":taxes_slab_value,"effective_date":this.currentDate};

      this.clicked = true;
      this.itemsService.items(obj).subscribe(data => {        
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) { 
          this.modalRef.hide();
          this.itemsform.reset();
          setTimeout(()=>{ 
            this.getitemsList();
           }, 1000);

           this.clicked = false;
        } else if (data['statusCode'] == 400) {
          this.clicked = false;
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.clicked = false;
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });

    }
  }

  
  ngOnInit() {    
    this.getplandatechanges(); 
    this.activeuser = this.localStorageService.getuserinfo();
    // this.subcription_end_date = this.activeuser.subscription_end_date;
    // this.server_date = this.activeuser.serverdate;
    if(this.localStorageService.getuserId()){
      this.getitemsList();
      this.getunitslist();
      this.getdefaultstockgroupList();
      this.gettaxeslist();
    } 
    else{
      this.messagePanelService.ShowPopupMessageWithLocalization("Invalid URL Please Try Again Later",this.globals.messageCloseTime,this.globals.messageType.error)
      this.router.navigate(['/login']);
    }
    this.activecompany=this.localStorageService.getCompanyInfo();
    this.period_start=this.activecompany.current_period_start;
    this.period_end=this.activecompany.current_period_end;
  }



  getitemsList(){
    this.itemsService.getitems({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] === true) {
        if(data.Item.length>0){
          this.itemslist = data && data.Item.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
          this.loader = false;
          this.dataNotFount = false;
        }else{
          this.itemslist = data.Item;
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


  openItemAddModal(addtemplate: TemplateRef<any>) {
    this.clicked = false;
    this.totalVal = 0;
    this.itemsform.reset();
    // if(this.stocklist== 0){
    //  //
    // }else{
    //   this.itemsform.controls['stock_group_id'].setValue(this.stocklist[0].uid);
    //   if(this.stocklist[0].stock_group_id == null){
    //     this.stock_group_id_new = this.stocklist[0].uid;
    //     this.sub_stock_group_id = '';
    //   }else{
    //     this.stock_group_id_new = this.stocklist[0].stock_group_id;
    //     this.sub_stock_group_id = this.stocklist[0].uid;
    //   }
    // }
    this.modalRef = this.modalService.show(addtemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }


  async edititems(){
    let id = this.itemsform.controls['id'].value;
    let name = this.itemsform.controls['name'].value? this.itemsform.controls['name'].value:'';
    let unit = this.itemsform.controls['unit'].value?this.itemsform.controls['unit'].value:'';

    // this.sub_stock_group_id = this.itemsform.controls['stock_sub_group_id'].value?this.itemsform.controls['stock_sub_group_id'].value:'';
    this.stock_group_id_new = this.itemsform.controls['stock_group_id'].value?this.itemsform.controls['stock_group_id'].value:'';
    let stock_group_id = this.itemsform.controls['stock_group_id'].value?this.itemsform.controls['stock_group_id'].value:'';
    let stock_sub_group_id = this.itemsform.controls['stock_sub_group_id'].value?this.itemsform.controls['stock_sub_group_id'].value:'';
    
    let hsn_code = this.itemsform.controls['hsn_code'].value?this.itemsform.controls['hsn_code'].value:'';
    let quantity = this.itemsform.controls['quantity'].value?this.itemsform.controls['quantity'].value:'';
    let rate = this.itemsform.controls['rate'].value?this.itemsform.controls['rate'].value:'';
    let total_value = this.itemsform.controls['total_value'].value?this.itemsform.controls['total_value'].value:'';
    let taxes_slab_id = this.itemsform.controls['taxes_slab_id'].value?this.itemsform.controls['taxes_slab_id'].value:'';
    let cess_tax = this.itemsform.controls['cess_tax'].value?this.itemsform.controls['cess_tax'].value:'';
    let cess = this.itemsform.controls['cess'].value?this.itemsform.controls['cess'].value==='no'?false:true:false;
    let company_id = this.itemsform.controls['company_id'].value;
    let isgst_applicable = this.itemsform.controls['isgst_applicable'].value?this.itemsform.controls['isgst_applicable'].value:false;
  let taxes_slab_value=this.getTaxexValue(taxes_slab_id);
    
    if (!name) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Name", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }
    // else if(!stock_group_id) {
    //   this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Stock Group", this.globals.messageCloseTime, this.globals.messageType.error);
    //   return false;
    // }
    else if(!unit) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Unit", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }
    else if(!taxes_slab_id) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter IGST Tax", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }
    else{

      let obj = {"company_id":this.localStorageService.getCompanyId(),"name": name,"unit_id": unit,"stock_group_id": this.stock_group_id_new,"stock_sub_group_id":this.stock_sub_group_id,"hsn_code": hsn_code,"quantity":quantity.toString(),"rate": rate.toString(),"total_value": this.totalVal.toString(),"taxes_slab_id":taxes_slab_id,"cess_tax":cess_tax,"cess":cess,"isgst_applicable": isgst_applicable,"period_start": this.period_start=this.activecompany.current_period_start,"period_end": this.period_end=this.activecompany.current_period_end,"taxes_slab_value":taxes_slab_value,"effective_date":this.currentDate};

      this.itemsService.putitems(id,obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.modalRef.hide();
          this.itemsform.reset();

          setTimeout(()=>{ 
            this.getitemsList();
        }, 1000);

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }

  
openItemEditModal(Edittemplate: TemplateRef<any>, item) {
    if(item.cess){
      this.cessblock = true;
    }else{
      this.cessblock = false;
    }
    // this.selectedType = item.stock_group.stock_name;
    this.itemsform = this.formBuilder.group({
      id: [item.uid],
      name: [item.name, Validators.required],
      unit: [item.unit_id, Validators.required],
      stock_group_id: [item.stock_group_id, Validators.required],
      stock_sub_group_id: [item.stock_sub_group_id],
      hsn_code: [item.hsn_code],
      quantity: [item.quantity],
      rate: [item.rate],
      total_value: [item.total_value],
      taxes_slab_id: [item.taxes_slab_id, Validators.required],
      cess_tax: [item.cess_tax],
      cess: [item.cess],
      isgst_applicable: [false],
      company_id: [this.localStorageService.getCompanyId()],
    });

    this.totalVal = item.total_value;

    this.modalRef = this.modalService.show(Edittemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  deleteadditems(data) {
    this.itemsService.deleteitems(data).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) { 
        this.deleteData = {};
        this.modalRef.hide();
        setTimeout(()=>{ 
          this.getitemsList();
        }, 1000);
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  openItemDeleteModal(Deleteemplate: TemplateRef<any>, item) {
    this.deleteData = item?item:{};
    this.modalRef = this.modalService.show(Deleteemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  getunitslist(){
    this.itemsService.getunits().subscribe(data => {
      this.unitlist = data && data["Units"].sort((a, b) => a.uqc.toLowerCase().localeCompare(b.uqc.toLowerCase()));
    })
  };

  getdefaultstockgroupList(){
    this.itemsService.getstockgroup(this.localStorageService.getCompanyId()).subscribe(data => {
      if(data["success"]){
        this.stocklist = data && data["StockGroup"].sort((a, b) => a.stock_name.toLowerCase().localeCompare(b.stock_name.toLowerCase()));
      }else{
        this.stocklist = [];
      }
    })
  };

   getTaxexValue(id){
   let taxvalue= this.taxelist.find(item=>item.id==id);
   if(taxvalue){
    return taxvalue.tax;
      }else{
    return "";
      }
  }
  getStockGroupid(data){
    this.stocklist.forEach(obj => {
      if(obj.uid==data){
        if(obj.stock_id == null){
          this.stock_group_id_new = obj.uid;
           this.stock_sub_group_id = '';
        }else{
          this.stock_group_id_new = obj.stock_id;
           this.stock_sub_group_id = obj.uid;
        }
      }
    })
  }
  
  taxvalue(taxes){
  }
  
  gettaxeslist(){
    this.itemsService.gettaxes().subscribe(data => {
      this.taxelist = data["taxes"];   
    })
  };

  calculate(data){
    let rate = this.itemsform.controls['rate'].value;
    let quantity = this.itemsform.controls['quantity'].value;
    let total = (quantity*rate).toFixed(2);
    this.totalVal = total;
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

  // =================================================================================================
}
