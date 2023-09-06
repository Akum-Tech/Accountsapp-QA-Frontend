import { Component, OnInit, TemplateRef } from '@angular/core';
import { AdminServicesService } from 'src/app/service/admin-services.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { MessagePanelService } from 'src/app/service/message-panel.service';
import { Globals } from 'src/app/global';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as moment from 'moment'; 


@Component({
  selector: 'app-plan-detail-show',
  templateUrl: './plan-detail-show.component.html',
  styleUrls: ['./plan-detail-show.component.css']
})
export class PlanDetailShowComponent implements OnInit {

  modalRef: BsModalRef;
  public data : any;
  uid:String = '';  
  loader = true ;

  viewbuylist: any = [];
  downloadlist: any =[];
  activeuser: any;
  imgbaseurl="";
  InvoiceDownload :any;
  dataNotFount = true ;

  title = 'angulardatatables';
  dtOptions: DataTables.Settings = {};

  constructor(private localStorageService: LocalStorageService, 
    private messagePanelService: MessagePanelService, 
    public globals: Globals, 
    private router: Router, 
    private route:ActivatedRoute,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private adminServicesService : AdminServicesService) {}

    
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };

    this.imgbaseurl=this.localStorageService.getBaseUrl();
    this.Getviewplan();
  }

  
  Getviewplan(){
    this.adminServicesService.Invoicelist().subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] === true) {
        if(data.data.length>0){
          this.viewbuylist = data.data;
          this.loader = false;
        }else{
          this.viewbuylist = data.data;
          this.loader = false;
          this.dataNotFount = false;
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

  Downloadinvoice(data){
    this.adminServicesService.downloadinvoice({id:data}).subscribe(data => {
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
