import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LocalStorageService } from './../../service/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import Utils from "./../../utils/utils";
import * as moment from "moment";
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {

  
  dataNotFount: boolean = true;

  id: string;
  vtype: string;
  token: string;

  @ViewChild('invalidurlmodal', { static: true }) invalidurlmodal: TemplateRef<any>;
  

  constructor(private localStorageService: LocalStorageService,private route: ActivatedRoute,public dialog: MatDialog,
    private messagePanelService: MessagePanelService, public globals: Globals,private modalService: NgbModal) { }


  async ngOnInit() {

    await this.route.queryParams.subscribe((params) => {

      this.id =  params['id'] ? params['id'] : null;
      // this.vtype =  params['vtype'] ? params['vtype'] : null;
      // this.token = params['token'] ? params['token'] : null;
  
      if(this.id != null){
        
          if(this.id != ''){
            this.vouchershow();
          }
          else{
            this.dataNotFount = false;
            this.modalService.open(this.invalidurlmodal, { size: 'lg', backdrop : 'static', keyboard : false });
          }
        }else{
          this.dataNotFount = false;
          this.modalService.open(this.invalidurlmodal, { size: 'lg', backdrop : 'static', keyboard : false });
        }     
      });
  }

  vouchershow(){}


}
