import { Component, OnInit, TemplateRef } from '@angular/core';
import * as jquery from 'jquery';
import AOS from 'aos';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-gstslider',
  templateUrl: './gstslider.component.html',
  styleUrls: ['./gstslider.component.css']
})
export class GstsliderComponent implements OnInit {

  modalRef: BsModalRef;
  
  constructor(private modalService: BsModalService) {
    $(function() {
      AOS.init({
      });
    });
   }

  ngOnInit() {
  }

  openSliderModal(Slidertemplate: TemplateRef<any>) {
      this.modalRef = this.modalService.show(Slidertemplate, {
        class:'modal-lg',
        keyboard: false,
        backdrop:'static'
      });
    }

}
