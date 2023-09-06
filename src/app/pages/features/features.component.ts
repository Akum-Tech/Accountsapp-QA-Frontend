import { Component, OnInit } from '@angular/core';

import AOS from 'aos';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {

  constructor() {
    $(function() {
      AOS.init({
      });
    });
   }

  ngOnInit() {
  }

}
