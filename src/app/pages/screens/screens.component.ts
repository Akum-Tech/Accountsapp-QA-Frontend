import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

// import $ from 'jquery';

@Component({
  selector: 'app-screens',
  templateUrl: './screens.component.html',
  styleUrls: ['./screens.component.css']
}) 

export class ScreensComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    autoplay:true,
    autoplayHoverPause:false,
    lazyLoad:true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navText: ['<i class="fa fa-angle-left next-pre" aria-hidden="true"></i>', 
              '<i class="fa fa-angle-right next-pre" aria-hidden="true"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 5
      },
      940: {
        items: 5
      }
    },
    nav: true
  }

  constructor() { }

  ngOnInit() {
  }

}
