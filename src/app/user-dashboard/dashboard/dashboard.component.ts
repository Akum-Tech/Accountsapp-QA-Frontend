import { Component, OnInit, TemplateRef } from '@angular/core';
import { LocalStorageService } from './../../service/local-storage.service'
import { Router } from '@angular/router';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {CompanyService} from './../../service/company.service';
import * as moment from "moment";
import { FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  modalRef: BsModalRef;
  public data : any;
  ledgerList:any =[];
  activecompany : any;


  constructor(private router: Router, public globals: Globals, private localStorageService: LocalStorageService, private messagePanelService: MessagePanelService,private modalService: BsModalService,private formBuilder: FormBuilder,public companyService:CompanyService) { }

  

  ngOnInit() {
    
    if(this.localStorageService.getuserId()){
    }else{
      this.messagePanelService.ShowPopupMessageWithLocalization("Invalid URL Please Try Again Later",this.globals.messageCloseTime,this.globals.messageType.error)
      this.router.navigate(['/login']);
    }
    this.activecompany=this.localStorageService.getCompanyInfo();
   }

}
