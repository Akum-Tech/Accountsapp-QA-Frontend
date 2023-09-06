import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppvouchersRoutingModule } from './appvouchers-routing.module';
import { AppvouchersComponent } from './appvouchers.component';

import { AppSalevoucherprintComponent } from './../app-vouchers-show/app-salevoucherprint/app-salevoucherprint.component';
import { AppPurhcasevoucherprintComponent } from './../app-vouchers-show/app-purhcasevoucherprint/app-purhcasevoucherprint.component';
import { AppDebitnoteprintComponent } from './../app-vouchers-show/app-debitnoteprint/app-debitnoteprint.component';
import { AppCreditnoteprintComponent } from './../app-vouchers-show/app-creditnoteprint/app-creditnoteprint.component';
import { AppPaymentprintComponent } from './../app-vouchers-show/app-paymentprint/app-paymentprint.component';
import { AppReceiptprintComponent } from './../app-vouchers-show/app-receiptprint/app-receiptprint.component';
import { AppJournalvoucherComponent } from './../app-vouchers-show/app-journalvoucher/app-journalvoucher.component';
import { AppStockinhandvoucherComponent } from './../app-vouchers-show/app-stockinhandvoucher/app-stockinhandvoucher.component';
import { AppErrorShowComponent } from './../app-vouchers-show/app-error-show/app-error-show.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppvouchersComponent,
    AppSalevoucherprintComponent,
    AppPurhcasevoucherprintComponent,
    AppDebitnoteprintComponent,
    AppCreditnoteprintComponent,
    AppPaymentprintComponent,
    AppReceiptprintComponent,
    AppJournalvoucherComponent,
    AppStockinhandvoucherComponent,
    AppErrorShowComponent
  ],
  entryComponents: [AppErrorShowComponent],
  imports: [
    CommonModule,
    AppvouchersRoutingModule,
    MatDialogModule
  ]
})
export class AppvouchersModule { }
