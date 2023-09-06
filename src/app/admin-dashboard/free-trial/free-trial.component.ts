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
  selector: 'app-free-trial',
  templateUrl: './free-trial.component.html',
  styleUrls: ['./free-trial.component.css']
})
export class FreeTrialComponent implements OnInit {

  modalRef: BsModalRef;
  public data : any;
  loader=true;
  clicked = false;
  traillist: any = [];
  dataNotFount = true ;
  // deleteData:any = {};

  constructor(public adminServicesService:AdminServicesService,private modalService: BsModalService,public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService,public dialog: MatDialog) { }


  edittrailform = this.formBuilder.group({
    value_days: ['', Validators.required]
  });


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ngOnInit() {
    this.GetStateAlldata();
  }
  

  async editfreetailvalue(){
    let id  = this.edittrailform.controls['id'].value;
    let value_days = this.edittrailform.controls['value_days'].value;


    if (!value_days) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Free Trail Days Value", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else {

      let obj = {id:id,"value_days": value_days};
      this.clicked = true;
      this.adminServicesService.editfreetrail(obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) { 
          this.modalRef.hide();
          this.edittrailform.reset();

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
    this.adminServicesService.getfreetrail().subscribe(data => {
      if (data === null || data === undefined){
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] === true) {
        if(data.Subscription.length>0){
          this.traillist = data.Subscription;
          this.loader = false;
        }else{
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
          this.loader = false;
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


  // openAddTrail(addtemplate: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(addtemplate, {
  //     class:'modal-lg',
  //     keyboard: false,
  //     backdrop:'static'
  //   });
  // }

  openTrailEditModal(Edittemplate: TemplateRef<any>,item) {
    this.clicked = false;
    this.edittrailform = this.formBuilder.group({
      id: [item.id],
      value_days: [item.value_days, Validators.required],
    });

    this.modalRef = this.modalService.show(Edittemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  // openTrailDeleteModal(deletetemplate: TemplateRef<any>, item) {
  //   // this.deleteData = item?item:{};
  //   this.modalRef = this.modalService.show(deletetemplate, {
  //     class:'modal-lg',
  //     keyboard: false,
  //     backdrop:'static'
  //   });
  // }

}
