import { Component, OnInit } from '@angular/core';
import { AdminServicesService} from './../../service/admin-services.service';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-master-account',
  templateUrl: './master-account.component.html',
  styleUrls: ['./master-account.component.css']
})
export class MasterAccountComponent implements OnInit {

  accountlist: any=[];
  loader=true;
  
  constructor(public adminServicesService:AdminServicesService,public globals: Globals, private router: Router,private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService,) { }

  ngOnInit() {
    this.adminServicesService.getaccount().subscribe(data => {
      this.accountlist = data["AccountGroup"];
      this.loader = false;
    })
  }
  
}
