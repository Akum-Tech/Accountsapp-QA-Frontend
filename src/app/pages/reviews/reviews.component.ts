import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

// import $ from 'jquery';
import AOS from 'aos';


@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    autoplay:false,
    autoplayHoverPause:false,
    // autoplaySpeed:1000,
    lazyLoad:true,
    // autoplayTimeout:3000,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    // navSpeed: 700,
    navText: ['<span class="hide"></span>', '<span class="hide"></span>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },
      940: {
        items: 2
      }
    },
    nav: false
  }
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
