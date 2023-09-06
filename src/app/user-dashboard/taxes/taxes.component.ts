
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AdminServicesService } from './../../service/admin-services.service'
import { UserinfoModule } from './../../model/userinfo/userinfo.module';
import { FormBuilder, Validators } from '@angular/forms';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { Router } from '@angular/router';
import { BuyplaneComponent } from '../../component/buyplane/buyplane.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.css']
})
export class TaxesComponent implements OnInit {

  modalRef: BsModalRef;
  public data : any;
  taxeslist: any=[];
  deleteData:any = {};
  Userdata: UserinfoModule;
  activeuser:any;
  clicked = false;
  loader=true;
  
  subcription_end_date : any;
  server_date : any;


  constructor(public adminServicesService:AdminServicesService,private modalService: BsModalService,public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService,public dialog: MatDialog) { }
 
  


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

  ngOnInit() {
    this.activeuser = this.localStorageService.getuserinfo();
    if(this.localStorageService.getuserId()){
      this.getTaxList();
    }else{
      this.messagePanelService.ShowPopupMessageWithLocalization("Invalid URL Please Try Again Later",this.globals.messageCloseTime,this.globals.messageType.error)
      this.router.navigate(['/login']);
    }
  }
  

}
