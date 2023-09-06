import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class UserinfoModule {
  email:string;
  id:string;
  name: string;
  token: string;
  islogin:boolean;
  phone: number;
  application_type: string;
  uid: string;
  user_id: string;
  financial_year:string;
  financial_start:string;
  financial_end:string;
  current_period_start:string;
  current_period_end:string;
  terms:string;
}
