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
  selector: 'app-admin-taxes',
  templateUrl: './admin-taxes.component.html',
  styleUrls: ['./admin-taxes.component.css']
})
export class AdminTaxesComponent implements OnInit {

  modalRef: BsModalRef;
  public data : any;
  taxeslist: any=[];
  deleteData:any = {};
  Userdata: UserinfoModule;
  activeuser:any;
  clicked = false;
  loader=true;
  dataNotFount = true ;
  
  title = 'angulardatatables';
  dtOptions: DataTables.Settings = {};

  subcription_end_date : any;
  server_date : any;


  constructor(public adminServicesService:AdminServicesService,private modalService: BsModalService,public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService,public dialog: MatDialog) { }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  addtaxform = this.formBuilder.group({
    state_type: [''],
    type: [''],
    tax: ['', Validators.required],
    title: ['',Validators.required]
  });

  async addtax() {
   
    let state_type = this.addtaxform.controls['state_type'].value;
    let type = this.addtaxform.controls['type'].value;
    let tax = this.addtaxform.controls['tax'].value;
    let title = this.addtaxform.controls['title'].value;
    
    if(!title) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Title", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else if(!tax) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Tax Number", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else {

      let obj = {"state_type": state_type, "type": type,"title":title, "tax": tax};
      this.clicked = true;
      this.adminServicesService.addtax(obj).subscribe(data => {
        if (data === null || data === undefined) {
           this.clicked = false;
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) { 
           this.clicked = false;
         this.modalRef.hide();
          this.addtaxform.reset();

          setTimeout(()=>{ 
            this.getTaxList();
           
       }, 1000);

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

  async edittax(){
    let state_type = this.addtaxform.controls['state_type'].value;
    let id  = this.addtaxform.controls['id'].value;
    let type = this.addtaxform.controls['type'].value;
    let tax = this.addtaxform.controls['tax'].value;
    let title = this.addtaxform.controls['title'].value;


   if(!title) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Title", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else if(!tax) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Tax Number", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else {

      let obj = {id:id,"state_type": state_type, "type": type,"title":title, "tax": tax};

      this.adminServicesService.putaddtax(obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) { 
          //modal close event
          this.modalRef.hide();
          this.addtaxform.reset();

          setTimeout(()=>{ 
            this.getTaxList();
            
          }, 1000);

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }


  deletetax(data) {
    this.adminServicesService.deletetax(data.id).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) { 
        this.deleteData = {};
        this.modalRef.hide();
        setTimeout(()=>{ 
          this.getTaxList();
        }, 1000);
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
    
    this.activeuser = this.localStorageService.getuserinfo();
    if(this.localStorageService.getuserId()){
      this.getTaxList();
    }else{
      this.messagePanelService.ShowPopupMessageWithLocalization("Invalid URL Please Try Again Later",this.globals.messageCloseTime,this.globals.messageType.error)
      this.router.navigate(['/login']);
    }
    this.adminServicesService.gettaxes().subscribe(data => {
      this.taxeslist = data["taxes"];
    })
  }

  openAddTax(addtemplate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(addtemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  openTaxEditModal(Edittemplate: TemplateRef<any>,item) {

    this.addtaxform = this.formBuilder.group({
      id: [item.id],
      state_type: [item.state_type],
      type: [item.type],
      tax: [item.tax, Validators.required],
      title: [item.title, Validators.required],
    });

    this.modalRef = this.modalService.show(Edittemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  openTaxDeleteModal(Deleteemplate: TemplateRef<any>, item) {
    this.deleteData = item?item:{};
    this.modalRef = this.modalService.show(Deleteemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }
}
