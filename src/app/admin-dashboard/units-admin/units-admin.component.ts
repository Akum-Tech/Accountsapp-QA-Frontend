import { Component, OnInit } from '@angular/core';
import { AdminServicesService} from './../../service/admin-services.service';
import { Router } from '@angular/router';
import { MessagePanelService } from 'src/app/service/message-panel.service';
import { Globals } from 'src/app/global';
import { LocalStorageService } from 'src/app/service/local-storage.service';


@Component({
  selector: 'app-units-admin',
  templateUrl: './units-admin.component.html',
  styleUrls: ['./units-admin.component.css']
})
export class UnitsAdminComponent implements OnInit {

  unitlist: any=[];
  loader = true ;
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
