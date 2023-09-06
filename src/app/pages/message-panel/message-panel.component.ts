import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {MessagePanelService} from './../../service/message-panel.service';
import { MessageService } from 'primeng/components/common/api';

@Component({
  selector: 'app-message-panel',
  templateUrl: './message-panel.component.html',
  styleUrls: ['./message-panel.component.css']
})
export class MessagePanelComponent implements OnInit {

  display: boolean = false;
  message: any;
  subscription: Subscription;
  constructor(private messagePanelService:MessagePanelService,private messageService:MessageService) {
  }

  ngOnInit() {
    this.messagePanelService.getMessage()
      .subscribe(data => {
        if(data){
          this.messageService.add({severity:data.msgType, summary: 'Message', detail: data.key})
         // this.message = data.key;
          this.display = true;
          setTimeout(() => { 
            this.message = null; 
            this.display=false;
          }, data.autoCloseSecond);
        }
      });
  }
  showDialog() {
    this.display = true; 
  }
}