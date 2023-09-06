import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class LoginModule {
  id: number;
  name: string;
  email: string;
  phone: number;
  device_id: string;
  android_token: string;
  apple_token: string;
  application_type: string;
  status: number;
  date: string

}
