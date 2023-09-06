import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AdminServicesService } from './../../service/admin-services.service'
import { UserinfoModule } from './../../model/userinfo/userinfo.module';
import { FormBuilder, Validators } from '@angular/forms';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-plan-changes',
  templateUrl: './plan-changes.component.html',
  styleUrls: ['./plan-changes.component.css']
})
export class PlanChangesComponent implements OnInit {

  modalRef: BsModalRef;
  public data : any;
  loader=true;
  clicked = false;
  buyplanlist: any = [];
  taxeslist: any=[];
  BasicAmount :any = 0;  
  gstAmount : any =0;
  deleteData:any = {};
  dataNotFount = true ;
  
  
  title = 'angulardatatables';
  dtOptions: DataTables.Settings = {};

  taxidpass: any;
  taxcalculate:any;

  constructor(public adminServicesService:AdminServicesService,private modalService: BsModalService,public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService,public dialog: MatDialog) { 
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

  addPlanform = this.formBuilder.group({
    months: ['', Validators.required],
    basic: ['', Validators.required],
    gst: ['', Validators.required],
    total: ['', Validators.required],
    status: ['1', Validators.required],
    taxid: ['', Validators.required],
    title: [''],
    description: ['']
  });

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
    
    this.getsubscriptiondata();
    this.getTaxList();
  }

  getTaxList(){
    this.adminServicesService.gettaxes().subscribe(data => {
      if (data === null || data === undefined){
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] === true) {
        if(data.taxes.length>0){
          this.taxeslist = data.taxes;
          this.loader = false;
        }else{
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        }
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  async addsubscriptionPlan() {
    this.clicked = false;
    let months = this.addPlanform.controls['months'].value;
    let basic = this.addPlanform.controls['basic'].value;
    let gst = this.addPlanform.controls['gst'].value;
    let total = this.addPlanform.controls['total'].value;
    let taxid = this.addPlanform.controls['taxid'].value;
    let title = this.addPlanform.controls['title'].value;
    let description = this.addPlanform.controls['description'].value;
    let status = this.addPlanform.controls['status'].value?this.addPlanform.controls['status'].value:'1';
    
    if (!months) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Months", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else if(!status) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Select Status", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else if(!taxid) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Select Tax ID", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else if(!total) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Total Amount", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else {

      let obj = {"months": months, "basic": this.BasicAmount.toString(), "gst": this.gstAmount.toString(),"tax_id":this.taxidpass,"status":status, "title":title,"description":description,"total": total};


      this.clicked = true;
      this.adminServicesService.addsubscriptionplan(obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) { 
         this.modalRef.hide();
          this.addPlanform.reset();

          setTimeout(()=>{ 
            this.getsubscriptiondata();           
          }, 1000);

        } else if (data['statusCode'] == 400) {
          this.clicked = false;
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {          
          this.clicked = false;
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
        this.clicked = false;
      });
    }
  }

  async editsubscriptionPlan(){
    let id  = this.addPlanform.controls['id'].value;
    let months = this.addPlanform.controls['months'].value;
    let basic = this.addPlanform.controls['basic'].value;
    let gst = this.addPlanform.controls['gst'].value;
    let total = this.addPlanform.controls['total'].value;
    
    let taxid = this.addPlanform.controls['taxid'].value?this.addPlanform.controls['taxid'].value:'';
    let title = this.addPlanform.controls['title'].value;
    let description = this.addPlanform.controls['description'].value;
    let status = this.addPlanform.controls['status'].value?this.addPlanform.controls['status'].value:'';


    if (!months) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Months", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else if(!status) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Select Status", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else if(!taxid) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Select Tax ID", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else if(!total) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Total Amount", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else {

      let obj = {"id":id,"months": months, "basic": this.BasicAmount.toString(), "gst": this.gstAmount.toString(),"tax_id":this.taxidpass,"status":status, "title":title,"description":description,"total": total};
         // this.clicked = true;
      this.adminServicesService.editplan(obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) { 
          this.modalRef.hide();
          this.addPlanform.reset();

          setTimeout(()=>{ 
            this.getsubscriptiondata();
          }, 1000);

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.clicked = false;
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
        this.clicked = false;
      });
    }
  }

  taxesset(data){
    this.taxidpass = data.id;
    this.taxcalculate = data.tax;
    this.calculate();
  }

  calculate(){
    this.taxidpass;
    this.taxcalculate;
    let total = this.addPlanform.controls['total'].value;
    // let taxid = this.addPlanform.controls['taxidpass'].value;

    let basicamount = Number(Number(total) * Number(this.taxcalculate))/Number(Number(100)+Number(this.taxcalculate));
    this.gstAmount = Number(basicamount).toFixed(2);
    let gstamount =  Number(total) - Number(basicamount);
    this.BasicAmount = Number(gstamount).toFixed(2);
  }


  getsubscriptiondata(){
    this.adminServicesService.getbuyData().subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] === true) {
        if(data.Subscription.length>0){
          this.buyplanlist = data.Subscription;
          this.loader = false;
        }else{
          this.buyplanlist = data.Subscription;
          this.loader = false;
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

  deleteplan(data) {
    this.adminServicesService.deleteplan(data.id).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) { 
        this.deleteData = {};
        this.modalRef.hide();
        setTimeout(()=>{ 
          this.getsubscriptiondata();
        }, 1000);
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  openAddBuyplan(addtemplate: TemplateRef<any>) {
    this.addPlanform.reset();
    this.BasicAmount = 0;
    this.gstAmount = 0;
    this.clicked = false;
    this.modalRef = this.modalService.show(addtemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  openPlanEditModal(Edittemplate: TemplateRef<any>,item) {
    this.clicked = false;
    this.addPlanform = this.formBuilder.group({
      id: [item.id],
      months: [item.months, Validators.required],
      basic: [item.basic],
      gst: [item.gst],
      total: [item.total, Validators.required],

      status: [item.status.toString(), Validators.required],
      taxid: [item.tax.title, Validators.required],
      title: [item.title],
      description: [item.description]
    });
    
    this.gstAmount = item.gst;
    this.BasicAmount = item.basic;
    this.taxcalculate = item.tax.tax;

    this.modalRef = this.modalService.show(Edittemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  openPlanDeleteModal(deletetemplate: TemplateRef<any>, item) {
    this.deleteData = item?item:{};
    this.modalRef = this.modalService.show(deletetemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }
}
