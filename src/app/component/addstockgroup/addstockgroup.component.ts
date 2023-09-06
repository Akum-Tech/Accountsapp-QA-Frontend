import { Component, OnInit, TemplateRef, Inject } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ItemsService} from './../../service/items.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { Router } from '@angular/router';
import { UserinfoModule } from 'src/app/model/userinfo/userinfo.module';
import { StockGroupService} from './../../service/stock-group.service';
import { Location } from '@angular/common';
import Utils from './../../utils/utils';

@Component({
  selector: 'app-addstockgroup',
  templateUrl: './addstockgroup.component.html',
  styleUrls: ['./addstockgroup.component.css']
})
export class AddstockgroupComponent implements OnInit {

  modalRef: BsModalRef;
  public data : any;
  stockgrouplist: any =[];
  deleteData:any = {};
  stocklist:any =[];
  Userdata: UserinfoModule;
  clicked = false;

  constructor(public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public stockGroupService:StockGroupService,private location: Location) { 
  }
  
  ngOnInit() {
    if(this.localStorageService.getuserId()){
      // this.getStockGroupList();
    }else{
      this.messagePanelService.ShowPopupMessageWithLocalization("Invalid URL Please Try Again Later",this.globals.messageCloseTime,this.globals.messageType.error)
      this.router.navigate(['/login']);
    }    
  }

  stockgroupform = this.formBuilder.group({
    stock_name: ['', Validators.required]
  });


  closeledger(){
    this.location.back();
  }

 addstockgroup() {
  this.clicked = false;
    let stock_name = this.stockgroupform.controls['stock_name'].value;
    if (!stock_name) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Stock Name", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else{
      let obj = {"user_id":this.localStorageService.getuserId(),"stock_name": stock_name,"company_id":this.localStorageService.getCompanyId()};

      this.clicked = true;
      this.stockGroupService.stockgroup(obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          
          this.location.back();
          this.stockgroupform.reset();

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }
}
