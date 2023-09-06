import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

  
  IsHidden= false;

  constructor(private router: Router ) {
    
    //  ------------ FLIP ICON -------------------------- //

    $(document).ready(function(){
      // Add minus icon for collapse element which is open by default
      $(".collapse.in").each(function(){
        $(this).siblings(".panel-heading").find(".glyphicon").addClass("rotate");
      });
      
      // Toggle plus minus icon on show hide of collapse element
      $(".collapse").on('show.bs.collapse', function(){
        $(this).parent().find(".glyphicon").addClass("rotate");
      }).on('hide.bs.collapse', function(){
        $(this).parent().find(".glyphicon").removeClass("rotate");
      });
    });

  // ------------ END FLIP ICON -----------------------//

    $(document).ready(function () {
      $('ul.nav > li').click(function (e) {
          e.preventDefault();
          $('ul.nav > li').removeClass('active');
          $(this).addClass('active');                
      });            
    });

    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
          $('#sidebar').toggleClass('active');
      });
    });

    $(document).ready(function(){
      $("#sidebarCollapse").click(function(){
        $("#content-wrapper").toggleClass('padding-left-remove');
      });
    });

   }

  ngOnInit() {
  }

//  ------------ LOGOUT -------------------------- //

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  

  menuHide(){
    this.IsHidden= !this.IsHidden;
  }

}
