import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppreportsComponent } from './appreports.component';


// ------ ERROR COMPONENT ---
import { AppReportErrorComponent } from './../app-reports-show/app-report-error/app-report-error.component';

// ------ ACCOUNT BOOK REPORTS ---
import { AppBankBookComponent } from './../app-reports-show/app-bank-book/app-bank-book.component';
import { AppCashBookComponent } from './../app-reports-show/app-cash-book/app-cash-book.component';
import { AppLedgerReportComponent } from './../app-reports-show/app-ledger-report/app-ledger-report.component';
import { AppSaleRegisterComponent } from './../app-reports-show/app-sale-register/app-sale-register.component';
import { AppPurchaseRegisterComponent } from './../app-reports-show/app-purchase-register/app-purchase-register.component';
import { AppJournalRegisterComponent } from './../app-reports-show/app-journal-register/app-journal-register.component';
import { AppGroupReportsComponent } from './../app-reports-show/app-group-reports/app-group-reports.component';
import { AppDayBookComponent } from './../app-reports-show/app-day-book/app-day-book.component';

// ------ STOCK REPORTS ---
import { AppStockReportComponent } from './../app-reports-show/app-stock-report/app-stock-report.component';
import { AppStockItemComponent } from './../app-reports-show/app-stock-item/app-stock-item.component';

// ------ FINAL REPORTS ---

import { AppProfitLossComponent } from './../app-reports-show/app-profit-loss/app-profit-loss.component';
import { AppBalanceSheetComponent } from './../app-reports-show/app-balance-sheet/app-balance-sheet.component';
import { AppTrailbalanceComponent } from './../app-reports-show/app-trailbalance/app-trailbalance.component';


const routes: Routes = [
  
   //--------------- APP : ACCOUNT BOOK REPORTS ROUT ---------------------------------
  
   { path:'appbankbook', component:AppBankBookComponent },   
   { path:'appcashbook', component:AppCashBookComponent }, 
   { path:'appledger', component:AppLedgerReportComponent }, 
   { path:'appsale', component:AppSaleRegisterComponent }, 
   { path:'apppurchase', component:AppPurchaseRegisterComponent },
   { path:'appgroup', component:AppGroupReportsComponent },
   { path:'appdaybook', component:AppDayBookComponent },
   { path:'appjournalregister', component:AppJournalRegisterComponent },

   //--------------- APP : STOCK REPORTS ROUT ---------------------------------

   { path:'appstockreport', component:AppStockReportComponent },
   { path:'appstockitem', component:AppStockItemComponent },

   //--------------- APP : FINAL REPORTS ROUT ---------------------------------

   { path:'apptrailbalance', component:AppTrailbalanceComponent },
   { path:'appbalancesheet', component:AppBalanceSheetComponent },
   { path:'appprofitloss', component:AppProfitLossComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppreportsRoutingModule { }
