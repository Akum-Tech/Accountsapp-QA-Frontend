import { Component, OnInit } from '@angular/core';
import { AdminServicesService } from './../../service/admin-services.service';
import { Router } from '@angular/router';
import { MessagePanelService } from 'src/app/service/message-panel.service';
import { Globals } from 'src/app/global';
import { LocalStorageService } from 'src/app/service/local-storage.service';

@Component({
  selector: 'app-usersdetail-admin',
  templateUrl: './usersdetail-admin.component.html',
  styleUrls: ['./usersdetail-admin.component.css']
})
export class UsersdetailAdminComponent implements OnInit {

  userlist: any=[];
  loader = true ;
  // public data : any;
  dataNotFount = true ;

  title = 'angulardatatables';
  dtOptions: DataTables.Settings = {};

  constructor(public adminServicesService:AdminServicesService,private messagePanelService: MessagePanelService,private router:Router,public globals:Globals, private localStorageService: LocalStorageService){ }


  ngOnInit() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };

    this.getuserlist();
  }

  getuserlist(){
    this.adminServicesService.getuser().subscribe(data => {
      if (data === null || data === undefined){
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] === true) {
        if(data.user.length>0){
          this.userlist = data.user;
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
}
