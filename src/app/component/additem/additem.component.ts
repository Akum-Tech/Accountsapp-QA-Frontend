import { Component, OnInit, TemplateRef, Inject } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ItemsService} from './../../service/items.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { Router } from '@angular/router';
import { UserinfoModule } from 'src/app/model/userinfo/userinfo.module';
// import { Location } from '@angular/common';
import Utils from './../../utils/utils';
import { SalesinvoiceComponent } from '../../user-dashboard/salesinvoice/salesinvoice.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.css']
})
export class AdditemComponent implements OnInit {

  
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
  stock_group_id_new : string='';
  stock_sub_group_id : string='';
  Userdata: UserinfoModule;
  cessblock : boolean =false;
  activecompany : any;
  period_start:any;
  period_end:any;
  clicked = false;

  // constructor(public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public itemsService:ItemsService,private location: Location){ 
  constructor(public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public itemsService:ItemsService,private modalService: BsModalService,public dialog: MatDialog, public dialogRef: MatDialogRef<SalesinvoiceComponent>, @Inject(MAT_DIALOG_DATA) public otherdata: any){ 
   

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
  
    // ----------------------------------------------------------------------------------------------

    // public openStockAddModal(){
    //   this.dialogRef.close();
    //   this.router.navigate(['/addstockgroup']);
    // }
  
  //  ----------------------------------------------------------------------------------------------

  
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

  closeledger(){
    // this.location.back();
    this.dialogRef.close();
  }

  ngOnInit() {
    if(this.localStorageService.getuserId()){
      // this.getitemsList();
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

  additems(){
    this.clicked = false;
    let name = this.itemsform.controls['name'].value? this.itemsform.controls['name'].value:'';
    let unit = this.itemsform.controls['unit'].value?this.itemsform.controls['unit'].value:'';
    let stock_group_id = this.itemsform.controls['stock_group_id'].value?this.itemsform.controls['stock_group_id'].value:'';
    let hsn_code = this.itemsform.controls['hsn_code'].value?this.itemsform.controls['hsn_code'].value:'';
    let quantity = this.itemsform.controls['quantity'].value?this.itemsform.controls['quantity'].value:'0';
    let rate = this.itemsform.controls['rate'].value?this.itemsform.controls['rate'].value:'0';
    let total_value = this.itemsform.controls['total_value'].value?this.itemsform.controls['total_value'].value:'';
    let taxes_slab_id = this.itemsform.controls['taxes_slab_id'].value?this.itemsform.controls['taxes_slab_id'].value:'';
    let cess_tax = this.itemsform.controls['cess_tax'].value?this.itemsform.controls['cess_tax'].value:'';
    let cess = this.itemsform.controls['cess'].value?this.itemsform.controls['cess'].value==='no'?false:true:false;
    let isgst_applicable = this.itemsform.controls['isgst_applicable'].value?this.itemsform.controls['isgst_applicable'].value:false;
    

    if (!name) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Name", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else if(!stock_group_id) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Stock Group", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else if(!unit) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Unit", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else if(!taxes_slab_id) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter IGST Tax", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }
    else{

      let obj = {"company_id":this.localStorageService.getCompanyId(),"name": name,"unit_id": unit,"stock_group_id": this.stock_group_id_new,"stock_sub_group_id":this.stock_sub_group_id,"hsn_code": hsn_code,"quantity":quantity.toString(),"rate": rate.toString(),"total_value": this.totalVal.toString(),"taxes_slab_id":taxes_slab_id,"cess_tax":cess_tax,"cess":cess,"isgst_applicable": isgst_applicable,"period_start": this.period_start=this.activecompany.current_period_start,"period_end": this.period_end=this.activecompany.current_period_end};

      this.clicked = true;
      this.itemsService.items(obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) { 
          //modal close event  
          this.dialogRef.close(data.Item);
          // this.location.back();
          this.itemsform.reset();
        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });

    }
  }

  getunitslist(){
    this.itemsService.getunits().subscribe(data => {
      this.unitlist = data && data['Units'].sort((a, b) => a.uqc.toLowerCase().localeCompare(b.uqc.toLowerCase()));
    })
  };

  
  getdefaultstockgroupList(){
    this.itemsService.getstockgroup(this.localStorageService.getCompanyId()).subscribe(data => {
      if(data["success"]){
        this.stocklist =  data && data['StockGroup'].sort((a, b) => a.stock_name.toLowerCase().localeCompare(b.stock_name.toLowerCase()));
      }else{
        this.stocklist = [];
      }
    })
  };

  gettaxeslist(){
    this.itemsService.gettaxes().subscribe(data => {
      this.taxelist = data["taxes"];   
    })
  };

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

  calculate(data){
    let rate = this.itemsform.controls['rate'].value;
    let quantity = this.itemsform.controls['quantity'].value;
    let total = (quantity*rate).toFixed(2);
    this.totalVal = total;
  }

}
