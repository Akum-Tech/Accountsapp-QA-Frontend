import { Component, OnInit, TemplateRef} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators } from '@angular/forms';
import { SubStockGroupService} from './../../service/sub-stock-group.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { Router } from '@angular/router';
import { UserinfoModule } from 'src/app/model/userinfo/userinfo.module';
import { BuyplaneService } from 'src/app/service/buyplane.service';
import { AddstockgroupComponent } from '../../component/addstockgroup/addstockgroup.component';
import { BuyplaneComponent } from '../../component/buyplane/buyplane.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-sub-stock-group',
  templateUrl: './sub-stock-group.component.html',
  styleUrls: ['./sub-stock-group.component.css']
})
export class SubStockGroupComponent implements OnInit {

  modalRef: BsModalRef;
  deleteData:any = {};
  setvalue :any;
  Userdata: any;
  loader = true ;
  substockgrouplist: any =[];
  clicked = false;
  activeuser:any;
  stocklist:any =[];
  data: any;
  
  dataNotFount = true ;
  subcription_end_date : any;
  server_date : any;


  constructor(public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService,public subStockGroupService:SubStockGroupService, private buyplaneService: BuyplaneService,private localStorageService: LocalStorageService,private modalService: BsModalService,public dialog: MatDialog) { }

    
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


  substockgroupform = this.formBuilder.group({
    sub_stock_name: ['', Validators.required],
    sub_stock_group: ['', Validators.required],
  });

  validation_messages={
    'sub_stock_name':[
    { type:'required', message:'Please Enter Sub Stock Name'}
    ],
    'sub_stock_group':[
      { type:'required', message:'Please Enter Sub Stock Group'}
      ],
  }

// ----------------------------------------------------------------------------------------------

  public openStockAddModal(){
    this.modalRef.hide();
    this.router.navigate(['admin/addstockgroup']);
  }
// ---------------------------------------------------------------------------------------------- 

addsubstockgroup() {    
    this.clicked = false;
    let sub_stock_name = this.substockgroupform.controls['sub_stock_name'].value;
    let sub_stock_group = this.substockgroupform.controls['sub_stock_group'].value;
    if (!sub_stock_name) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Stock Name", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else if(!sub_stock_group) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter stock_group", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else{
      let obj = {"uid":this.localStorageService.getuserId(),"company_id":this.localStorageService.getCompanyId(),"stock_name": sub_stock_name,"stock_id":sub_stock_group};
      this.clicked = true;
      this.subStockGroupService.substockgroup(obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.modalRef.hide();
          this.substockgroupform.reset();

          setTimeout(()=>{ 
            this.getSubStockGroupList();
           
       }, 1000);

        } else if (data['statusCode'] == 400) {
          this.clicked = false;
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.clicked = false;
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }
  
  getSubStockGroupList(){
    this.subStockGroupService.getsubstockgroup({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        if(data.StockSubGroup.length>0){
          this.substockgrouplist = data.StockSubGroup;
          this.loader = false;
          this.dataNotFount = false;
        }else{
          this.substockgrouplist = data.StockSubGroup;
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
      this.getSubStockGroupList();
    }else{
      this.messagePanelService.ShowPopupMessageWithLocalization("Invalid URL Please Try Again Later",this.globals.messageCloseTime,this.globals.messageType.error)
      this.router.navigate(['/login']);
    }
  }

 async editsubstockgroup(){
    let id = this.substockgroupform.controls['id'].value;
    let sub_stock_name = this.substockgroupform.controls['sub_stock_name'].value;
    let sub_stock_group = this.substockgroupform.controls['sub_stock_group'].value;
    
    if (!sub_stock_name) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Name", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else if(!sub_stock_group) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter stock_group", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else{

      let obj = {"stock_name": sub_stock_name,"stock_id":sub_stock_group};

      this.subStockGroupService.putsubstockgroup(id,obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.modalRef.hide();
          this.substockgroupform.reset();

          setTimeout(()=>{ 
            this.getSubStockGroupList();
        }, 1000);

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }
  
  deletesubstock(data) {
    this.subStockGroupService.deletesubStockGroup(data).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) { 
        //modal close event
        this.deleteData = {};
        this.modalRef.hide();
        setTimeout(()=>{ 
          this.getSubStockGroupList();
        }, 1000);
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }
  openSubStockAddModal(addsubstocktemplate: TemplateRef<any>) {
    this.clicked = false;
    this.getstocklist();
    this.modalRef = this.modalService.show(addsubstocktemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }
  openSubStockEditModal(Edittemplate: TemplateRef<any>,stockgroup) {
    this.getstocklist();
    this.substockgroupform = this.formBuilder.group({
      id: [stockgroup.uid],
      sub_stock_name: [stockgroup.stock_name, Validators.required],
      
      sub_stock_group: [stockgroup.stock_group.uid, Validators.required]
    });

    this.modalRef = this.modalService.show(Edittemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }
  openSubStockDeleteModal(Deleteemplate: TemplateRef<any>, item) {
    this.deleteData = item?item:{};
    this.modalRef = this.modalService.show(Deleteemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  getstocklist(){
    this.subStockGroupService.getstockgroup({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
      this.stocklist = data && data['stockGroup'].sort((a, b) => a.stock_name.toLowerCase().localeCompare(b.stock_name.toLowerCase()));
    })
  };
}