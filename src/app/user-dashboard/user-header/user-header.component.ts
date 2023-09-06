import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './../../service/local-storage.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { FormBuilder, Validators} from '@angular/forms';
import {CompanyService} from './../../service/company.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import * as moment from "moment";
import { BuyplaneService } from 'src/app/service/buyplane.service';
import { BuyplaneComponent } from '../../component/buyplane/buyplane.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {

  IsHidden= false;
  modalRef: BsModalRef;
  activecompany : any;
  currentDate:any = new Date();
  current_periad_startdate : any ;
  corrent_date_valid : any ;
  datecondition : any ;
  imgbaseurl="";
  activeuser: any;
  setvalue :any;
  Userdata: any;
  
  companyList:any =[];

  changeperiodform:any;

  constructor( private router: Router , private localStorageService: LocalStorageService,private modalService: BsModalService,public globals: Globals, private formBuilder: FormBuilder,private buyplaneService: BuyplaneService, private messagePanelService: MessagePanelService, public companyService:CompanyService,public dialog: MatDialog) { 

    
    this.activecompany=this.localStorageService.getCompanyInfo();
    
    //  ------------ FLIP ICON -------------------------- //

    $(document).ready(function(){
      // Add minus icon for collapse element which is open by default
      $(".collapse.in").each(function(){
        $(this).siblings(".panel-heading").find(".glyphicon").addClass("rotate");
      });
      
      // Toggle plus minus icon on show hide of collapse element
      $(".collapse").on('show.bs.collapse', function(){
        $(this).parent().find(".glyphicon").addClass("rotate");
      }).on('hide.bs.collapse', function(){
        $(this).parent().find(".glyphicon").removeClass("rotate");
      });
    });

  // ------------ END FLIP ICON -----------------------//

    $(document).ready(function () {
      $('ul.nav > li').click(function (e) {
          e.preventDefault();
          $('ul.nav > li').removeClass('active');
          $(this).addClass('active');                
      });            
    });

    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
          $('#sidebar').toggleClass('active');
      });
    });

    $(document).ready(function(){
      $("#mainSidebar").click(function(){
        $("#content-wrapper").toggleClass('padding-left-remove');
      });
    });

  }

//  ------------ LOGOUT -------------------------- //

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  
  getImage(image){
    if(image){
      return this.imgbaseurl+image;
    }else{
      // return "assets/images/logo.png";
    }
  }

//___________________GET SINGLE USER____________________________________________________________________________
getplandatechanges(){
  this.buyplaneService.getsingleuserinfo({uid:this.localStorageService.getuserUId()}).subscribe(data => {
    if (data['success'] === true) {
          this.Userdata=data.user;
          this.setvalue = this.localStorageService.getuserinfo();
          this.setvalue.subscription_end_date = data.user.subscription_end_date ;
          this.localStorageService.saveUserDetail(this.setvalue);
      }
    });
};
//___________________GET SINGLE USER END____________________________________________________________________________
 
  // getDate(date){
  //   let data = date.split('T');
  //   if(data.length===1){
  //     date = date.replaceAll('-', '/');
  //   }
  //   return moment(new Date(date)).format('DD-MMM-YYYY')
  // }
  
  
// getplandatechanges(){
//   this.buyplaneService.getsubscriptionplancheck().subscribe(data => {
//     if (data['Subscription'] == false) {
//         console.log("PLAN Changes ___",data)
//         this.dialog.open(BuyplaneComponent, { width: '800px', disableClose: true, hasBackdrop:true});
//       }
//     });
// };

  gotoDashBoard(obj){
    this.localStorageService.saveCompanyinfo(obj);
    this.router.navigate(['admin/dashboard']);
  }

  ngOnInit(){ 
    this.getplandatechanges();
    this.activeuser=this.localStorageService.getuserinfo();
    this.imgbaseurl=this.localStorageService.getBaseUrl();
    // this.activecompany=this.localStorageService.getCompanyInfo();
    // if(this.activecompany.current_period_start){
    //   this.activecompany.current_period_start = this.activecompany.current_period_start.replaceAll('-', '/');
    // }
    // if(this.activecompany.current_period_end){
    //   this.activecompany.current_period_end = this.activecompany.current_period_end.replaceAll('-', '/');
    // }
    this.changeperiodform = this.formBuilder.group({
      user_id: [this.activecompany.user_id, Validators.required],
      uid: [this.activecompany.uid, Validators.required],

      current_period_start: [this.activecompany.current_period_start, Validators.required],
      current_period_end: [this.activecompany.current_period_end, Validators.required],
      book_start_date: [this.activecompany.bookstart_date],

      financial_start: [this.activecompany.financial_year, Validators.required],
      financial_end: [this.activecompany.financial_end, Validators.required],
    });
      
    this.activecompany.current_period_start =  new Date(this.activecompany.current_period_start);


    if(this.localStorageService.getuserId()){
    }else{
      this.messagePanelService.ShowPopupMessageWithLocalization("Invalid URL Please Try Again Later",this.globals.messageCloseTime,this.globals.messageType.error)
      this.router.navigate(['/login']);
    }
  }

  openChangeperiod(template: TemplateRef<any> ,activecompany) {
    this.current_periad_startdate = new Date(this.activecompany.bookstart_date);
    this.corrent_date_valid = new Date(this.activecompany.current_period_start);

    if(this.current_periad_startdate >= this.corrent_date_valid){
      this.datecondition = this.activecompany.bookstart_date;
    }else{
      this.datecondition = this.activecompany.current_period_start;
    }
    
    this.changeperiodform = this.formBuilder.group({
      uid: [activecompany.uid],
      id: [activecompany.id],
      current_period_start: [new Date(this.datecondition), ''],
    });
    this.modalRef = this.modalService.show(template, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  async changeperiod(){
    let uid = this.changeperiodform.controls['uid'].value;
    let current_period_start = this.changeperiodform.controls['current_period_start'].value?this.changeperiodform.controls['current_period_start'].value:'';
    
    if (!current_period_start) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Current Period Start", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }else {

      current_period_start = moment(current_period_start).format('MM-DD-YYYY');
      

      let obj = {"uid":this.activecompany.uid,"current_period_start":current_period_start, "book_start_date":this.activecompany.bookstart_date ,"financial_start":this.activecompany.financial_year};

      
      this.companyService.putchangeperiod(uid,obj).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) { 
        //modal close event
        this.localStorageService.saveCompanyinfo(data.company);
        this.activecompany = data.company;
        this.modalRef.hide();
        this.changeperiodform.reset();
        this.router.navigate(['admin/dashboard']);

      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
    }
  }

  menuHide(){
    this.IsHidden= !this.IsHidden;
   }

}