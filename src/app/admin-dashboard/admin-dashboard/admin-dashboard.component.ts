import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from './../../service/local-storage.service';
import { Router } from '@angular/router';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  
  activeuser: any;


  constructor(
    private localStorageService: LocalStorageService,
    private messagePanelService: MessagePanelService,
    private router: Router,
    public globals: Globals
    ) { }

  ngOnInit() {
    // this.activeuser = this.localStorageService.getuserinfo();
    // if(this.activeuser.application_type == 'Web'){
    //   this.messagePanelService.ShowPopupMessageWithLocalization("Invalid URL Please Try Again Later",this.globals.messageCloseTime,this.globals.messageType.error)
    //   this.router.navigate(['/login']);
    // }else{
    //   this.router.navigate(['/admindashboard']);
    // }
    
  }

}
