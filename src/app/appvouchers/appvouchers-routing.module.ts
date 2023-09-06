import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppvouchersComponent } from './appvouchers.component';


import { AppSalevoucherprintComponent } from './../app-vouchers-show/app-salevoucherprint/app-salevoucherprint.component';
import { AppPurhcasevoucherprintComponent } from './../app-vouchers-show/app-purhcasevoucherprint/app-purhcasevoucherprint.component';
import { AppDebitnoteprintComponent } from './../app-vouchers-show/app-debitnoteprint/app-debitnoteprint.component';
import { AppCreditnoteprintComponent } from './../app-vouchers-show/app-creditnoteprint/app-creditnoteprint.component';
import { AppPaymentprintComponent } from './../app-vouchers-show/app-paymentprint/app-paymentprint.component';
import { AppReceiptprintComponent } from './../app-vouchers-show/app-receiptprint/app-receiptprint.component';
import { AppJournalvoucherComponent } from './../app-vouchers-show/app-journalvoucher/app-journalvoucher.component';
import { AppStockinhandvoucherComponent } from './../app-vouchers-show/app-stockinhandvoucher/app-stockinhandvoucher.component';

const routes: Routes = [
  // { path: '', component: AppvouchersComponent },

   //--------------- APP VOUCHERS PRINT ROUTER ---------------------------------
  
   { path:'salevoucher', component:AppSalevoucherprintComponent },
   { path:'purchasevoucher', component:AppPurhcasevoucherprintComponent },
   { path:'debitnotevoucher', component:AppDebitnoteprintComponent },
   { path:'creditnotevoucher', component:AppCreditnoteprintComponent },
   { path:'paymentvoucher', component:AppPaymentprintComponent },
   { path:'receiptvoucher', component:AppReceiptprintComponent },
   { path:'journalvoucherapp', component:AppJournalvoucherComponent },
   { path:'stockinhandvoucherapp', component:AppStockinhandvoucherComponent },
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AppvouchersRoutingModule { }
