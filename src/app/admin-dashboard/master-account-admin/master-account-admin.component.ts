import { Component, OnInit } from '@angular/core';
import { AdminServicesService} from './../../service/admin-services.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-master-account-admin',
  templateUrl: './master-account-admin.component.html',
  styleUrls: ['./master-account-admin.component.css']
})
export class MasterAccountAdminComponent implements OnInit {

 
  accountlist: any=[];
  loader=true;
  dataNotFount = true ;
  
  title = 'angulardatatables';
  dtOptions: DataTables.Settings = {};

  constructor(public adminServicesService:AdminServicesService,public globals: Globals, private router: Router,private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService,) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
    
    this.adminServicesService.getaccount().subscribe(data => {
      this.accountlist = data["AccountGroup"];
      this.loader = false;
    })
  }

}
