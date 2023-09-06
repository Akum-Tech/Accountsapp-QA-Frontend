import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder} from '@angular/forms';
import {BuyplaneService} from './../../service/buyplane.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-priceplan-view',
  templateUrl: './priceplan-view.component.html',
  styleUrls: ['./priceplan-view.component.css']
})
export class PriceplanViewComponent implements OnInit {

  viewbuylist: any = [];
  downloadlist: any =[];
  activeuser: any;
  imgbaseurl="";
  loader = true ;
  InvoiceDownload :any;

    constructor( public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService, public buyplaneService:BuyplaneService,private modalService: BsModalService) { }

     
    ngOnInit() {
      this.activeuser = this.localStorageService.getuserinfo();
      this.imgbaseurl=this.localStorageService.getBaseUrl();
      this.getsubscriptiondata();
    }
  
    getsubscriptiondata(){
      this.buyplaneService.viewbuyplandata({id:this.localStorageService.getuserId()}).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.viewbuylist = data.Subscription;
          this.loader = false ;
        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }

     
    Downloadinvoice(data){
      this.buyplaneService.downloadinvoice({id:data}).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          
          this.InvoiceDownload = this.imgbaseurl + data.filepath;
          
          this.goToLink(this.InvoiceDownload);
          
          this.loader = false ;
        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }

    goToLink(url: string){
      window.open(url, "_blank");
    }
}
