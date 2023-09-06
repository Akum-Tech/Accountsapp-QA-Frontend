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
  selector: 'app-userdetail-view',
  templateUrl: './userdetail-view.component.html',
  styleUrls: ['./userdetail-view.component.css']
})
export class UserdetailViewComponent implements OnInit {

  
  modalRef: BsModalRef;
  public data : any;
  Userdata: any = {}; 
  companylistshow: any=[];
  uid:String = '';  
  subscription_start_date : any ;
  subscription_old_date_set : any;
  loader = true ;
  dataNotFount = true ;
  
  viewbuylist: any = [];
  downloadlist: any =[];
  activeuser: any;
  imgbaseurl="";
  InvoiceDownload :any;

  constructor(private localStorageService: LocalStorageService, 
    private messagePanelService: MessagePanelService, 
    public globals: Globals, 
    private router: Router, 
    private route:ActivatedRoute,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private adminServicesService : AdminServicesService) {}

    
  dateform = this.formBuilder.group({
    subscription_old_date: ['', Validators.required],
    subscription_end_date: ['', Validators.required],
  }); 


  ngOnInit() {
    this.imgbaseurl=this.localStorageService.getBaseUrl();
    this.Userdetaillistshow();    
    this.getsubscriptiondata();
  }

  getsubscriptiondata(){
    this.loader = true;
    this.route.params.subscribe(async(params) => {
        await this.adminServicesService.viewbuyplandata({id:params.uid}).subscribe(async(data) => {
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

  Userdetaillistshow(){
    this.loader = true;
    this.route.params.subscribe(async(params) => {
      await this.adminServicesService.getsingleuser({uid:params.uid}).subscribe(async(data) => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {

          this.Userdata = data.user;
          this.companylistshow = data.user.companyList;

          this.subscription_start_date = new Date(this.Userdata.subscription_end_date);
          if(this.Userdata.subscription_end_date == null){
            this.subscription_old_date_set = "1990-04-01";
          }else{
            this.subscription_old_date_set = moment(this.Userdata.subscription_end_date).format('YYYY-MM-DD');
          }          

          this.loader = false;
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
  });
  }

  opendateEditModal(Edittemplate: TemplateRef<any>, item) {
    this.dateform = this.formBuilder.group({
      id: [item.uid],
      subscription_end_date: [item.subscription_end_date, Validators.required],
    });

    this.modalRef = this.modalService.show(Edittemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  async editsubscriptiondate(){

    let id = this.dateform.controls['id'].value;
    let subscription_end_date = this.dateform.controls['subscription_end_date'].value? this.dateform.controls['subscription_end_date'].value:'';
 
    if (!subscription_end_date) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Select Subscription End Date", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }
    else{

      
      subscription_end_date = moment(subscription_end_date).format('YYYY-MM-DD');
      let obj = {"subscription_end_date":subscription_end_date,"subscription_old_date":this.subscription_old_date_set};

      this.adminServicesService.putuserplan(id,obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.modalRef.hide();
          this.dateform.reset();

          setTimeout(()=>{ 
            this.Userdetaillistshow();
          }, 1000);

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }


}
