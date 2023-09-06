import { Component, OnInit } from '@angular/core';

import AOS from 'aos';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { 
    $(function() {
      console.log( "ready!" );
      AOS.init({
      });
    });
  }

  ngOnInit() {
  }

}
