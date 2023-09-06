import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AdminServicesService } from './../../service/admin-services.service'
import { FormBuilder, Validators } from '@angular/forms';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-state-add',
  templateUrl: './state-add.component.html',
  styleUrls: ['./state-add.component.css']
})
export class StateAddComponent implements OnInit {

  modalRef: BsModalRef;
  public data : any;
  loader=true;
  clicked = false;
  statelist: any = [];
  totalAmount :number = 0;  
  deleteData:any = {};
  dataNotFount = true ;
  
  title = 'angulardatatables';
  dtOptions: DataTables.Settings = {};

    constructor(public adminServicesService:AdminServicesService,private modalService: BsModalService,public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService,public dialog: MatDialog) { }

    
  addstateform = this.formBuilder.group({
    name: ['', Validators.required],
    gst_code: ['', Validators.required]
  });

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
    
    this.GetStateAlldata();
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  async addstate() {
    this.clicked = false;
    let name = this.addstateform.controls['name'].value;
    let gst_code = this.addstateform.controls['gst_code'].value;
    
    if (!name) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter State Name", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else if(!gst_code) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter GST Code", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else {

      let obj = {"name": name, "gst_code": gst_code,"efactive_date": ""};

      this.clicked = true;
      this.adminServicesService.addstate(obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) { 
         this.modalRef.hide();
          this.addstateform.reset();

          setTimeout(()=>{ 
            this.GetStateAlldata();           
          }, 1000);

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }

  GetStateAlldata(){
    this.adminServicesService.getstate().subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] === true) {
        if(data.state.length>0){
          this.statelist = data.state;
          this.loader = false;
        }else{
          this.statelist = data.state;
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
  
  openAddState(addtemplate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(addtemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  openStateEditModal(Edittemplate: TemplateRef<any>,item) {
    // this.addPlanform = this.formBuilder.group({
    //   id: [item.id],
    //   months: [item.months, Validators.required],
    //   basic: [item.basic, Validators.required],
    //   gst: [item.gst, Validators.required],
    //   total: [item.total, Validators.required],
    // });
    // this.totalAmount = item.total;

    this.modalRef = this.modalService.show(Edittemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  openStateDeleteModal(deletetemplate: TemplateRef<any>, item) {
    // this.deleteData = item?item:{};
    this.modalRef = this.modalService.show(deletetemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

 calculate(data){
    // let basic = this.addPlanform.controls['basic'].value;
    // let gst = this.addPlanform.controls['gst'].value;
    // let total = Number(basic) + Number(gst);
    // this.totalAmount = total;
  }

}
