import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { CompanyComponent } from './pages/company/company.component';
import { TermsOfServiceComponent } from './pages/home/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './pages/home/privacy-policy/privacy-policy.component';
import { ContactpageComponent } from './pages/contactpage/contactpage.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { PackagesPlansComponent } from './pages/packages-plans/packages-plans.component';
import { HowItWorksComponent } from './pages/how-it-works/how-it-works.component';
import {ChangeUserDetails} from './pages/changeuserdetail/changeuserdetails.component'

import { FeaturespageComponent } from './pages/featurespage/featurespage.component';
import { InviteUser } from './pages/inviteuser/inviteuser.component';
import { from } from 'rxjs';



const routes: Routes = [


  { path:'', component:HomeComponent },
  { path:'home', component:HomeComponent },
  { path:'terms', component:TermsOfServiceComponent},
  { path:'privacy-policy', component:PrivacyPolicyComponent},
  { path:'contactpage', component:ContactpageComponent},
  { path:'product_detail', component:ProductDetailsComponent},
  { path:'packages_plans', component:PackagesPlansComponent},
  { path:'how_it_works', component:HowItWorksComponent },
  { path:'featurespage', component:FeaturespageComponent },
  { path:'login', component:LoginComponent },
  { path:'signup', component:SignupComponent },
  { path:'company', component:CompanyComponent },
  { path:'change_email_phone', component:ChangeUserDetails },
  { path:'invite_user', component:InviteUser},



  //----------------------------------admin module---------------------------------------//
  { path: 'admin',
  loadChildren: () => import('./adminmodule/adminmodule.module').then(m => m.AdminmoduleModule)
  },
  //----------------------------------end admin module-----------------------------------//

  // ---------------------------DOWNLOAD ROUT -------------------------------------------

  // ----------------------------APP ROUTES-----------------------------------------------
    { path: 'app',
      loadChildren: () => import('./appvouchers/appvouchers.module').then(m => m.AppvouchersModule)
    },
    { path: 'report',
      loadChildren: () => import('./appreports/appreports.module').then(m => m.AppreportsModule)
    },


];

@NgModule({
  imports: [RouterModule.forRoot(routes
  //   ,{
  //   useHash: true
  // }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
