import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as moment from 'moment'; 
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { MessagePanelService } from 'src/app/service/message-panel.service';
import { Globals } from 'src/app/global';
import { Router, ActivatedRoute } from '@angular/router';
import { BuyplaneService } from 'src/app/service/buyplane.service';
import { WindowRefService } from 'src/app/service/window-ref.service';
import { UserinfoModule } from './../../model/userinfo/userinfo.module';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  
  activeuser: any;
  token: string;
  Userdata:any =[];
  buyplanlist: any = [];  
  userId : any;
  subscriptionPlan : any;
  
  id: string;
  type: string;
  vtype: string;

  constructor(private localStorageService: LocalStorageService, 
    private messagePanelService: MessagePanelService, 
    public globals: Globals, 
    private router: Router, 
    private buyplaneService: BuyplaneService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder) { }

  @ViewChild('planexpiremodal', { static: true }) planexpiremodal: TemplateRef<any>;
  @ViewChild('verifymodal', { static: true }) verifymodal: TemplateRef<any>;

  open(verifymodal) {
    this.modalService.open(verifymodal , { size: 'lg' });
  }

  
numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

  otpverifyform = this.formBuilder.group({
    otp: ['', [Validators.required]],  
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['maatoken'] ? params['maatoken'] : null;
    });


    if(this.token){
      this.Userdetaillistshow(this.token);
    }else{
      this.modalService.open(this.planexpiremodal, { size: 'lg', backdrop : 'static', keyboard : false });
    }

  }

  async Userdetaillistshow(token:string){
      await this.buyplaneService.getsingleuserdata({maatoken:token}).subscribe(async(data) => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {

          this.Userdata = data.user;
          this.userId = data.user.uid;
          this.localStorageService.saveuserplanDetail(data.user);
          this.localStorageService.saveplanDetailtoken(this.token);
          
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else if(data['statusCode']==500){
        
          this.modalService.open(this.planexpiremodal, { size: 'lg', backdrop : 'static', keyboard : false });
        
          // this.router.navigate(['/home']); 

      } else {
        this.modalService.open(this.planexpiremodal, { size: 'lg', backdrop : 'static', keyboard : false });
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }
  
  butplanshow(){    
    this.getsubscriptiondata();
  }

  sendotpclick(data){
    this.subscriptionPlan = data.id;
    let obj = {"id":this.userId};
    this.buyplaneService.resendopt(obj).subscribe(data=>{
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later',this.globals.messageCloseTime,this.globals.messageType.error);
        }else if(data['success']==true){
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);

          this.modalService.open(this.verifymodal, { size: 'lg', backdrop : 'static', keyboard : false });

        }else if(data['statusCode']==400){
          this.router.navigate(['/home']); 
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);
      }else{
        this.router.navigate(['/home']); 
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.error);
      }
    });
  }
  
  otpverifydone(){
    let otp = this.otpverifyform.controls['otp'].value;

    if (!otp) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid OTP", this.globals.messageCloseTime, this.globals.messageType.error);
    } else {
      let obj = {"id":this.userId,"otp":otp};
      
      this.buyplaneService.verifyotp(obj).subscribe(data=>{
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later',this.globals.messageCloseTime,this.globals.messageType.error);
        }else if(data['success']==true){
          
          this.modalService.dismissAll();
          if(this.userId) {
            this.router.navigate(['admin/planorder'], { queryParams: { subscriptionId: btoa(this.subscriptionPlan) }});      
          } else {
            this.messagePanelService.ShowPopupMessageWithLocalization("Please Verify Your OTP..", this.globals.messageCloseTime, this.globals.messageType.error)
            this.router.navigate(['/home'], { queryParams: { subscriptionId: btoa(this.subscriptionPlan) }}); 
          }
          // this.getsubscriptiondata();

        }else if(data['statusCode']==400){
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);
      }else{
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.error);
      }
    });
    }
  }

  
  resendotpverifydone(){    
    let obj = {"id":this.userId};
    this.buyplaneService.resendopt(obj).subscribe(data=>{
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later',this.globals.messageCloseTime,this.globals.messageType.error);
        }else if(data['success']==true){
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);

          // this.modalService.open(this.verifymodal, { size: 'lg', backdrop : 'static', keyboard : false });

        }else if(data['statusCode']==400){
          this.router.navigate(['/home']); 
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.success);
      }else{
        this.router.navigate(['/home']); 
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'],this.globals.messageCloseTime,this.globals.messageType.error);
      }
    });
  }

  getsubscriptiondata(){
    this.buyplaneService.getbuyplanData().subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] === true) {
        if(data.Subscription.length>0){
          this.buyplanlist = data.Subscription;
        }else{
          this.buyplanlist = data.Subscription;
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        }
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

// getDate(date){
//   let data = date.split('T');
//   if(data.length===1){
//     date = date.replaceAll('-', '/');
//   }
//   return moment(new Date(date)).format('DD-MMM-YYYY')
// }

}
