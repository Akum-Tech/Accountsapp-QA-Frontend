import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

// import $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { 

    $(document).ready(function () {
      $('ul.nav > li').click(function (e) {
          e.preventDefault();
          $('ul.nav > li').removeClass('active');
          $(this).addClass('active');                
      });            
    });

    $(document).ready(function(){
      $(".navbar-toggler").click(function(){
        $("#mobileMenu").addClass("viewMenu");
      });

      $(".hideMenu").click(function(){
        $("#mobileMenu").removeClass("viewMenu");
        }); 
      });

  }

  ngOnInit() {
  }

}
