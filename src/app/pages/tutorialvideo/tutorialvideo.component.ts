import { Component, OnInit} from '@angular/core';
// import $ from 'jquery';
import AOS from 'aos';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-tutorialvideo',
  templateUrl: './tutorialvideo.component.html',
  styleUrls: ['./tutorialvideo.component.css']
})
export class TutorialvideoComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    autoplay:false,
    autoplayHoverPause:false,
    lazyLoad:true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    // navText: ['<span class="hide"></span>', '<span class="hide"></span>'],
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
        items: 3
      },
      940: {
        items: 5
      }
    },
    nav: true
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
