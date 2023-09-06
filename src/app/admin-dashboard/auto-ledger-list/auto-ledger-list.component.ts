import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AdminServicesService } from './../../service/admin-services.service'
import { FormBuilder, Validators } from '@angular/forms';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import {MatDialog} from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-auto-ledger-list',
  templateUrl: './auto-ledger-list.component.html',
  styleUrls: ['./auto-ledger-list.component.css']
})
export class AutoLedgerListComponent implements OnInit {

  modalRef: BsModalRef;
  public data : any;
  loader=true;
  clicked = false;
  ledgerlist: any = [];
  totalAmount :number = 0;  
  deleteData:any = {};
  title = 'angulardatatables';
  dtOptions: DataTables.Settings = {};

    constructor(public adminServicesService:AdminServicesService,private modalService: BsModalService,public globals: Globals, private router: Router, private formBuilder: FormBuilder,private route:ActivatedRoute,private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService,public dialog: MatDialog) { }

   
  
    ngOnInit() {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        processing: true
      };
      
      this.GetautoLedgerdata();
    }
  
    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }

  GetautoLedgerdata(){
    this.loader = true;
    this.route.params.subscribe(async(params) => {
      await this.adminServicesService.getautoledgerlist({comapny_id:params.uid}).subscribe(async(data) => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        if(data.state.length>0){
          this.ledgerlist = data.state;
          this.loader = false;
        }else{
          this.ledgerlist = data.state;
          this.loader = false;
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        }
        } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  });
  }


}
