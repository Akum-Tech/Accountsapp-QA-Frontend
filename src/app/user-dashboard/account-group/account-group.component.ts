import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AccountGroupService} from './../../service/account-group.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserinfoModule } from 'src/app/model/userinfo/userinfo.module';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BuyplaneComponent } from '../../component/buyplane/buyplane.component';
import { BuyplaneService } from 'src/app/service/buyplane.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// import { type } from 'os';

@Component({
  selector: 'app-account-group',
  templateUrl: './account-group.component.html',
  styleUrls: ['./account-group.component.css']
})
export class AccountGroupComponent implements OnInit {

  modalRef: BsModalRef;
  public data : any;
  deleteData:any = {};
  loader = true ;
  accountgrouplist: any =[];
  accountlist:any =[];
  Userdata: UserinfoModule;
  accountType:string="";
  activeuser:any;
  clicked = false;
  subcription_end_date : any;
  server_date : any;
  setvalue :any;
  dataNotFount = true ;

  constructor(public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService,private buyplaneService: BuyplaneService, public accountGroupService:AccountGroupService,private modalService: BsModalService,config: NgbModalConfig,public route:ActivatedRoute,public dialog: MatDialog)  { }

  accountgroupform = this.formBuilder.group({
    name: ['', Validators.required],
    account_group_id: ['', Validators.required],
  });
  
  
// -----------------------------------------------------------------------------------------------------------------------
public openbuyplaneModal(){
  if(this.subcription_end_date < this.server_date || this.subcription_end_date == null ){
    this.modalRef.hide();
    const dialogRef = this.dialog.open(BuyplaneComponent, { width: '800px', disableClose: true, hasBackdrop:true});
    dialogRef.afterClosed().subscribe(result =>  {
    });
  }else{
    //
  } 
}  
// -----------------------------------------------------------------------------------------------------------------------
//___________________GET SINGLE USER____________________________________________________________________________
getplandatechanges(){
  this.buyplaneService.getsingleuserinfo({uid:this.localStorageService.getuserUId()}).subscribe(data => {
    if (data['success'] === true) {
          this.Userdata=data.user;
          this.setvalue = this.localStorageService.getuserinfo();
          this.setvalue.subscription_end_date = data.user.subscription_end_date ;
          this.localStorageService.saveUserDetail(this.setvalue);
          
          this.subcription_end_date = this.setvalue.subscription_end_date;
          this.server_date = this.setvalue.serverdate;
      }
    });
};
//___________________GET SINGLE USER END____________________________________________________________________________

  
  validation_messages={
    'name':[
    { type:'required', message:'Please Enter Name'}
    ],
    'account_group_id':[
    { type:'required', message:'Please Enter Account Group'}
    ],
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
         this.modalRef.hide();
          this.accountgroupform.reset();

          setTimeout(()=>{ 
            this.getaccountgrouplist();
           
       }, 1000);

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }
  getaccountgrouplist(){
    this.accountGroupService.getaccountgroup(this.localStorageService.getCompanyId()).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] === true) {
        if(data.subAccountGroup.length>0){
          this.accountgrouplist = data.subAccountGroup;
          this.loader = false;
        }else{
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

  ngOnInit() {
    this.getplandatechanges(); 
    this.activeuser = this.localStorageService.getuserinfo();
    // this.subcription_end_date = this.activeuser.subscription_end_date;
    // this.server_date = this.activeuser.serverdate;
    
    if(this.localStorageService.getuserId()){
      this.getaccountgrouplist();
      this.getdefaultaccountgroupList();
    }else{
      this.messagePanelService.ShowPopupMessageWithLocalization("Invalid URL Please Try Again Later",this.globals.messageCloseTime,this.globals.messageType.error)
      this.router.navigate(['/login']);
    }
  }
  openAccountAddModal(addtemplate: TemplateRef<any>) {
    this.clicked = false;
    this.accountgroupform.reset();
    this.modalRef = this.modalService.show(addtemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }


  
  async editaccount(){
    let id = this.accountgroupform.controls['id'].value;
    let name = this.accountgroupform.controls['name'].value;
    let account_group_id = this.accountgroupform.controls['account_group_id'].value;
    if (!name) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Stock Name", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else if(!account_group_id) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Account Group", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else{

      let obj = {"company_id":this.localStorageService.getCompanyId(),"name": name,"account_group_id":account_group_id,};

      this.accountGroupService.putaccountGroup(id,obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.modalRef.hide();
          this.accountgroupform.reset();

          setTimeout(()=>{ 
            this.getaccountgrouplist();
        }, 1000);

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }


  openAccountEditModal(Edittemplate: TemplateRef<any>, item) {
    this.accountgroupform = this.formBuilder.group({
      id: [item.uid],
      name: [item.name, Validators.required],
      account_group_id: [item.account_group_id, Validators.required],
    });
    this.modalRef = this.modalService.show(Edittemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  openAccountdeleteModal(Deleteemplate: TemplateRef<any>, item) {
    this.deleteData = item?item:{};
    this.modalRef = this.modalService.show(Deleteemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  deletesubaccountgroup(data) {
    this.accountGroupService.deleteaccountgroup(data).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) { 
        this.deleteData = {};
        this.modalRef.hide();
        setTimeout(()=>{ 
          this.getaccountgrouplist();
        }, 1000);
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
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
}
