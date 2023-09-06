import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators} from '@angular/forms';
import {BuyplaneService} from './../../service/buyplane.service';
import { UserinfoModule } from './../../model/userinfo/userinfo.module';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-priceplanetwo',
  templateUrl: './priceplanetwo.component.html',
  styleUrls: ['./priceplanetwo.component.css']
})
export class PriceplanetwoComponent implements OnInit {

  buylist: any = [];
  activeuser: any;

    constructor( public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public buyplaneService:BuyplaneService,private modalService: BsModalService) { }
    

    ngOnInit() {
      this.activeuser = this.localStorageService.getuserinfo();
      this.getsubscriptiondata();
    }
  
    getsubscriptiondata(){
      this.buyplaneService.getbuyData().subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] === true) {
          if(data.Subscription.length>0){
            this.buylist = data.Subscription;
          }else{
            this.buylist = data.Subscription;
            this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
          }
        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  
    buyplanget(subscriptionPlan) {
      if(this.localStorageService.getuserId()) {
        this.router.navigate(['admin/order'], { queryParams: { subscriptionId: btoa(subscriptionPlan.id) }});      
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization("Please Login..", this.globals.messageCloseTime, this.globals.messageType.error)
        this.router.navigate(['/login'], { queryParams: { subscriptionId: btoa(subscriptionPlan.id) }}); 
      }
    } 
    
    logout(){
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  

}
