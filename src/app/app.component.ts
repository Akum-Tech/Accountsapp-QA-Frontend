import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare let gtag:Function;
declare let fbq:Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GSTwebsite';

  constructor(private router: Router){
    router.events.subscribe((y: NavigationEnd) => {
      if(y instanceof NavigationEnd){
        gtag('config','UA-213829959-2',{'page_path' : y.url});
        fbq('track', 'PageView');
      }
    })
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
     if (window.pageYOffset > 250) {
       let element = document.getElementById('header');
       if(element){
        element.classList.add('sticky'); 
      }
     } else {
      let element = document.getElementById('header');
        if(element){
          element.classList.remove('sticky'); 
        }
        
     }
  }
}
