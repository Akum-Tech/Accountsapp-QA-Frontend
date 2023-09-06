import { Component, OnInit } from '@angular/core';
import { AdminServicesService} from './../../service/admin-services.service';
import { Router } from '@angular/router';
import { MessagePanelService } from 'src/app/service/message-panel.service';
import { Globals } from 'src/app/global';
import { LocalStorageService } from 'src/app/service/local-storage.service';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {

  unitlist: any=[];
  loader = true ;

  constructor(public adminServicesService:AdminServicesService,private messagePanelService: MessagePanelService,private router:Router,public globals:Globals, private localStorageService: LocalStorageService){ }

  ngOnInit() {
    if(this.localStorageService.getuserId()){
    }else{
      this.messagePanelService.ShowPopupMessageWithLocalization("Invalid URL Please Try Again Later",this.globals.messageCloseTime,this.globals.messageType.error)
      this.router.navigate(['/login']);
    }
    this.adminServicesService.getunits().subscribe(data => {
      this.unitlist = data["Units"];
      this.loader = false;
    })
  }
}
