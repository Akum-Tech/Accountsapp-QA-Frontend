import { Component, OnInit } from '@angular/core';

// import $ from 'jquery';
import AOS from 'aos';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent implements OnInit {

  constructor() {
    $(function() {
      AOS.init({
      });
    });
   }

  ngOnInit() {
  }

}
