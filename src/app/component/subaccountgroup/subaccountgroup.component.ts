import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AccountGroupService} from './../../service/account-group.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LedgerComponent } from '../../user-dashboard/ledger/ledger.component';
import { Location } from '@angular/common';


@Component({
  selector: 'app-subaccountgroup',
  templateUrl: './subaccountgroup.component.html',
  styleUrls: ['./subaccountgroup.component.css']
})
export class SubaccountgroupComponent implements OnInit {
 
  modalRef: BsModalRef;
  public data : any;
  deleteData:any = {};
  accountgrouplist: any =[];
  accountlist:any =[];
  accountType:string="";
  activeuser:any;
  clicked = false;

  constructor(public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService,public accountGroupService:AccountGroupService, private localStorageService: LocalStorageService,private modalService: BsModalService,private location: Location)  { }

  accountgroupform = this.formBuilder.group({
    name: ['', Validators.required],
    account_group_id: ['', Validators.required],
  });

  validation_messages={
    'name':[
    { type:'required', message:'Please Enter Name'}
    ],
    'account_group_id':[
    { type:'required', message:'Please Enter Account Group'}
    ],
  }

  ngOnInit() {
    this.getdefaultaccountgroupList();
  }

  async addaccountgroup() {
    this.clicked = false;
    let name = this.accountgroupform.controls['name'].value;
    let account_group_id = this.accountgroupform.controls['account_group_id'].value;
    if (!name) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Stock Name", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else if(!account_group_id) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Account Group", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else{

      let obj = {"company_id":this.localStorageService.getCompanyId(),"type":this.accountType,"name": name,"account_group_id":account_group_id,};
      this.clicked = true;
      this.accountGroupService.accountgroup(obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {

          this.location.back();
          this.accountgroupform.reset();

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }

  getdefaultaccountgroupList(){
    this.accountGroupService.getaccount().subscribe(data => {
      this.accountlist = data && data['AccountGroup'].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    })
  };

  accounytype(data){
    let dataId = data;
    this.accountlist.forEach(obj => {
      if(obj.uid==dataId){
       this.accountType=obj.type;
      }
    })
  }

 
  closeledger(){
    this.location.back();
  }
}
