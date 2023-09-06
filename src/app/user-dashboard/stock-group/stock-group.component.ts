import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators} from '@angular/forms';
import { StockGroupService} from './../../service/stock-group.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { Router } from '@angular/router';
import { UserinfoModule } from 'src/app/model/userinfo/userinfo.module';
import { BuyplaneComponent } from '../../component/buyplane/buyplane.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BuyplaneService } from 'src/app/service/buyplane.service';

@Component({
  selector: 'app-stock-group',
  templateUrl: './stock-group.component.html',
  styleUrls: ['./stock-group.component.css']
})
export class StockGroupComponent implements OnInit {

  modalRef: BsModalRef;
  public data : any;
  stockgrouplist: any =[];
  deleteData:any = {};
  loader = true ;
  stocklist:any =[];
  setvalue :any;
  Userdata: any;
  activeuser:any;
  dataNotFount = true ;
  
  subcription_end_date : any;
  server_date : any;

  clicked = false;
  constructor(public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService,private buyplaneService: BuyplaneService, public stockGroupService:StockGroupService,private modalService: BsModalService,public dialog: MatDialog) { 
  }

    
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


  stockgroupform = this.formBuilder.group({
    stock_name: ['', Validators.required]
  });

  validation_messages={
    'stock_name':[
    { type:'required', message:'Please Enter Stock Name'}
    ],
  }

  async addstockgroup() {
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
          this.modalRef.hide();
          this.stockgroupform.reset();

          setTimeout(()=>{ 
            this.getStockGroupList();
           
       }, 1000);

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }

  getStockGroupList(){
    this.stockGroupService.getstockgroup({user_id:this.localStorageService.getuserId(),company_id:this.localStorageService.getCompanyId()}).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        if(data.stockGroup.length>0){
          this.stockgrouplist = data.stockGroup;
          this.loader = false;
          this.dataNotFount = false;
        }else{
          this.stockgrouplist = data.stockGroup;
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

  async editstockgroup(){
    let id = this.stockgroupform.controls['id'].value;
    let stock_name = this.stockgroupform.controls['stock_name'].value;
    

    
    if (!stock_name) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Name", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else{

      let obj = {"stock_name": stock_name};

      this.stockGroupService.putstockgroup(id,obj).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) {
          this.modalRef.hide();
          this.stockgroupform.reset();

          setTimeout(()=>{ 
            this.getStockGroupList();
        }, 1000);

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }

  deletestock(data) {
    this.stockGroupService.deleteStockGroup(data).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) {
        this.deleteData = {};
        this.modalRef.hide();
        setTimeout(()=>{ 
          this.getStockGroupList();
        }, 1000);
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
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
      this.getStockGroupList();
    }else{
      this.messagePanelService.ShowPopupMessageWithLocalization("Invalid URL Please Try Again Later",this.globals.messageCloseTime,this.globals.messageType.error)
      this.router.navigate(['/login']);
    }
  }

  openStockAddModal(addstocktemplate: TemplateRef<any>) {
    this.clicked = false;
    this.stockgroupform.reset();
    this.modalRef = this.modalService.show(addstocktemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }
  openStockEditModal(Edittemplate: TemplateRef<any>,stock) {
    this.stockgroupform = this.formBuilder.group({
      id: [stock.uid],
      stock_name: [stock.stock_name, Validators.required]
    });
    this.modalRef = this.modalService.show(Edittemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  openStockDeleteModal(Deleteemplate: TemplateRef<any>, stock) {
    this.deleteData = stock?stock:{};
    this.modalRef = this.modalService.show(Deleteemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }


}
