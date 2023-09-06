import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { AdminmoduleRoutingModule } from "./adminmodule-routing.module";

import { DashboardComponent } from "./../user-dashboard/dashboard/dashboard.component";
import { LedgerComponent } from "./../user-dashboard/ledger/ledger.component";
import { ItemsComponent } from "./../user-dashboard/items/items.component";
import { StockGroupComponent } from "./../user-dashboard/stock-group/stock-group.component";
import { AccountGroupComponent } from "./../user-dashboard/account-group/account-group.component";
import { UnitComponent } from "./../user-dashboard/unit/unit.component";
import { SubStockGroupComponent } from "./../user-dashboard/sub-stock-group/sub-stock-group.component";
import { SalesinvoiceComponent } from "./../user-dashboard/salesinvoice/salesinvoice.component";
import { PurchaseComponent } from "./../user-dashboard/purchase/purchase.component";
import { ReceiptComponent } from "./../user-dashboard/receipt/receipt.component";
import { PaymentComponent } from "./../user-dashboard/payment/payment.component";
import { CreditnoteComponent } from "./../user-dashboard/creditnote/creditnote.component";
import { DebitnoteComponent } from "./../user-dashboard/debitnote/debitnote.component";
import { MasterAccountComponent } from "./../user-dashboard/master-account/master-account.component";
import { TaxesComponent } from "./../user-dashboard/taxes/taxes.component";
import { ViewsalesinvoiceComponent } from "./../user-dashboard/viewsalesinvoice/viewsalesinvoice.component";
import { SalesinvoiceprintComponent } from "./../user-dashboard/salesinvoiceprint/salesinvoiceprint.component";
import { ViewPurchasevoucherComponent } from "./../user-dashboard/view-purchasevoucher/view-purchasevoucher.component";
import { PurchaseinvoiceprintComponent } from "./../user-dashboard/purchaseinvoiceprint/purchaseinvoiceprint.component";
import { JournalvoucherComponent } from "./../user-dashboard/journalvoucher/journalvoucher.component";
import { CreaterecieptComponent } from "./../user-dashboard/createreciept/createreciept.component";
import { CreatepaymentComponent } from "./../user-dashboard/createpayment/createpayment.component";
import { CreatecreditnoteComponent } from "./../user-dashboard/createcreditnote/createcreditnote.component";
import { CreatedebitnoteComponent } from "./../user-dashboard/createdebitnote/createdebitnote.component";
import { CreatejournalvoucherComponent } from "./../user-dashboard/createjournalvoucher/createjournalvoucher.component";
import { PrintcreditnoteComponent } from "./../user-dashboard/printcreditnote/printcreditnote.component";
import { PrintdebitnoteComponent } from "./../user-dashboard/printdebitnote/printdebitnote.component";
import { PrintreceiptvoucherComponent } from "./../user-dashboard/printreceiptvoucher/printreceiptvoucher.component";
import { PrintpaymentvoucherComponent } from "./../user-dashboard/printpaymentvoucher/printpaymentvoucher.component";
import { PrintjournalComponent } from "./../user-dashboard/printjournal/printjournal.component";
import { BalanceSheetComponent } from "./../reports/balance-sheet/balance-sheet.component";
import { StockSummaryComponent } from "./../reports/stock-summary/stock-summary.component";
import { LedgerAccountComponent } from "./../reports/ledger-account/ledger-account.component";
import { ProfitLossComponent } from "./../reports/profit-loss/profit-loss.component";
import { GroupSummaryComponent } from "./../reports/group-summary/group-summary.component";
import { SalesRegisterComponent } from "./../reports/sales-register/sales-register.component";
import { StockGroupReportComponent } from "./../reports/stock-group-report/stock-group-report.component";
import { TrialBalanceComponent } from "./../reports/trial-balance/trial-balance.component";
import { PurchaseRegisterComponent } from "./../reports/purchase-register/purchase-register.component";
import { StockItemComponent } from "./../reports/stock-item/stock-item.component";
import { VoucherReportsComponent } from "./../reports/voucher-reports/voucher-reports.component";
import { JournalRegisterComponent } from "./../reports/journal-register/journal-register.component";
import { CashbankBookComponent } from "./../reports/cashbank-book/cashbank-book.component";
import { MultiplestockComponent } from "./../reports/multiplestock/multiplestock.component";
import { AccountgroupReportComponent } from "./../reports/accountgroup-report/accountgroup-report.component";
import { BankBookreportComponent } from "./../reports/bank-bookreport/bank-bookreport.component";
import { EditSalesvoucherComponent } from "./../user-dashboard/edit-salesvoucher/edit-salesvoucher.component";
import { EditPurchaseComponent } from "./../user-dashboard/edit-purchase/edit-purchase.component";
import { EditDebitnoteComponent } from "./../user-dashboard/edit-debitnote/edit-debitnote.component";
import { EditCreditnoteComponent } from "./../user-dashboard/edit-creditnote/edit-creditnote.component";
import { EditReceiptComponent } from "./../user-dashboard/edit-receipt/edit-receipt.component";
import { EditPaymentComponent } from "./../user-dashboard/edit-payment/edit-payment.component";
import { EditJournalComponent } from "./../user-dashboard/edit-journal/edit-journal.component";
import { GSTReportsComponent } from "./../reports/gst-reports/gst-reports.component";
import { GstReportsOneComponent } from "./../reports/gst-reports-one/gst-reports-one.component";
import { GstReportsTwoComponent } from "./../reports/gst-reports-two/gst-reports-two.component";
import { OrderComponent } from "./../user-dashboard/order/order.component";

import { ClosingvalueComponent } from "./../reports/closingvalue/closingvalue.component";
import { CreateStockinhandComponent } from "./../user-dashboard/create-stockinhand/create-stockinhand.component";
import { EditStockinhandComponent } from "./../user-dashboard/edit-stockinhand/edit-stockinhand.component";
import { PrintStockinhandComponent } from "./../user-dashboard/print-stockinhand/print-stockinhand.component";
import { StockReportViewComponent } from "./../user-dashboard/stock-report-view/stock-report-view.component";

import { AdminDashboardComponent } from "./../admin-dashboard/admin-dashboard/admin-dashboard.component";
import { AdminTaxesComponent } from "./../admin-dashboard/admin-taxes/admin-taxes.component";
import { MasterAccountAdminComponent } from "./../admin-dashboard/master-account-admin/master-account-admin.component";
import { UnitsAdminComponent } from "./../admin-dashboard/units-admin/units-admin.component";
import { UsersdetailAdminComponent } from "./../admin-dashboard/usersdetail-admin/usersdetail-admin.component";
import { UserdetailViewComponent } from "./../admin-dashboard/userdetail-view/userdetail-view.component";
import { PlanChangesComponent } from "./../admin-dashboard/plan-changes/plan-changes.component";
import { StateAddComponent } from "./../admin-dashboard/state-add/state-add.component";
import { FreeTrialComponent } from "./../admin-dashboard/free-trial/free-trial.component";
import { OrganizationinfoComponent } from "./../admin-dashboard/organizationinfo/organizationinfo.component";

import { PlanDetailShowComponent } from "./../admin-dashboard/plan-detail-show/plan-detail-show.component";

import { AutoLedgerListComponent } from "./../admin-dashboard/auto-ledger-list/auto-ledger-list.component";

import { AdditemComponent } from "./../component/additem/additem.component";
import { AddstockgroupComponent } from "./../component/addstockgroup/addstockgroup.component";
import { SubaccountgroupComponent } from "./../component/subaccountgroup/subaccountgroup.component";
import { AddledgerComponent } from "./../component/addledger/addledger.component";
import { PlanComponent } from "./../pages/plan/plan.component";
import { PlanOrderComponent } from "./../pages/plan-order/plan-order.component";

import { PriceplanComponent } from './../pages/priceplan/priceplan.component';
import { PriceplanetwoComponent } from './../pages/priceplanetwo/priceplanetwo.component';
import { PriceplanViewComponent } from './../pages/priceplan-view/priceplan-view.component';
//---------------------------------- download ---------------------------------///
import { DownloadComponent } from "./../user-dashboard/download/download.component";

// ----------------APP-LAZY LOADING ------------------------------------------------


import { UserHeaderComponent } from './../user-dashboard/user-header/user-header.component';
import { UserFooterComponent } from './../user-dashboard/user-footer/user-footer.component';
import { UserMenuComponent } from './../user-dashboard/user-menu/user-menu.component';

import { AdminFooterComponent } from './../admin-dashboard/admin-footer/admin-footer.component';
import { AdminHeaderComponent } from './../admin-dashboard/admin-header/admin-header.component';
import { AdminMenuComponent } from './../admin-dashboard/admin-menu/admin-menu.component';

import { NgCircleProgressModule } from 'ng-circle-progress';
import {DataTablesModule} from 'angular-datatables';
import { DataTableModule} from "angular-6-datatable";
import { ReactiveFormsModule ,FormsModule} from '@angular/forms';
import { MaterialModule } from './../material/material.module';
import { Select2Module } from 'ng2-select2';
import { NgSelectModule } from '@ng-select/ng-select';
import { ViewUserComponent } from "../user-dashboard/view-user/view-user.component";
@NgModule({
  declarations: [
    PriceplanComponent,
    PriceplanetwoComponent,
    PriceplanViewComponent,
    AdminFooterComponent,
    AdminHeaderComponent,
    AdminMenuComponent,
    UserMenuComponent,
    UserHeaderComponent,
    UserFooterComponent,
    DashboardComponent,
    LedgerComponent,
    ItemsComponent,
    StockGroupComponent,
    AccountGroupComponent,
    UnitComponent,
    SubStockGroupComponent,
    SalesinvoiceComponent,
    PurchaseComponent,
    ReceiptComponent,
    PaymentComponent,
    CreditnoteComponent,
    DebitnoteComponent,
    MasterAccountComponent,
    TaxesComponent,
    ViewsalesinvoiceComponent,
    SalesinvoiceprintComponent,
    ViewPurchasevoucherComponent,
    PurchaseinvoiceprintComponent,
    JournalvoucherComponent,
    CreaterecieptComponent,
    CreatepaymentComponent,
    CreatecreditnoteComponent,
    CreatedebitnoteComponent,
    CreatejournalvoucherComponent,
    PrintcreditnoteComponent,
    PrintdebitnoteComponent,
    PrintreceiptvoucherComponent,
    PrintpaymentvoucherComponent,
    PrintjournalComponent,
    BalanceSheetComponent,
    StockSummaryComponent,
    LedgerAccountComponent,
    ProfitLossComponent,
    GroupSummaryComponent,
    SalesRegisterComponent,
    StockGroupReportComponent,
    TrialBalanceComponent,
    ViewUserComponent,
    PurchaseRegisterComponent,
    StockItemComponent,
    VoucherReportsComponent,
    JournalRegisterComponent,
    CashbankBookComponent,
    MultiplestockComponent,
    AccountgroupReportComponent,
    BankBookreportComponent,
    EditSalesvoucherComponent,
    EditPurchaseComponent,
    EditDebitnoteComponent,
    EditCreditnoteComponent,
    EditReceiptComponent,
    EditPaymentComponent,
    EditJournalComponent,
    GSTReportsComponent,
    GstReportsOneComponent,
    GstReportsTwoComponent,
    OrderComponent,
    ClosingvalueComponent,
    CreateStockinhandComponent,
    EditStockinhandComponent,
    PrintStockinhandComponent,
    StockReportViewComponent,
    AdminDashboardComponent,
    AdminTaxesComponent,
    MasterAccountAdminComponent,
    UnitsAdminComponent,
    UsersdetailAdminComponent,
    UserdetailViewComponent,
    PlanChangesComponent,
    StateAddComponent,
    FreeTrialComponent,
    OrganizationinfoComponent,
    PlanDetailShowComponent,
    AutoLedgerListComponent,
    AdditemComponent,
    AddstockgroupComponent,
    SubaccountgroupComponent,
    AddledgerComponent,
    PlanComponent,
    PlanOrderComponent,
    DownloadComponent
  ],

  imports: [CommonModule, 
    AdminmoduleRoutingModule, 
    MatDialogModule,
     DataTablesModule,
     DataTableModule,
     FormsModule,
     MaterialModule,
     NgSelectModule,
     Select2Module,
    ReactiveFormsModule,
    NgCircleProgressModule.forRoot({
    radius: 70,
    space:4,
    percent:99,
    outerStrokeWidth: 10,
    innerStrokeWidth: 3,
    outerStrokeColor: "#30304b",
    innerStrokeColor: "#30304b80",
    animationDuration: 500,
    animation:true
  })]
})
export class AdminmoduleModule {}
