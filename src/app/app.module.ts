import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'hammerjs';
import { DataTableModule} from "angular-6-datatable";
import { MaterialModule } from './material/material.module';
import { MessageService, MenuItem} from 'primeng/api';
import { ToastModule} from 'primeng/toast';
import { SplitButtonModule} from 'primeng/splitbutton';
import { Select2Module } from 'ng2-select2';
import { NgSelectModule } from '@ng-select/ng-select';
import { Globals} from './../app/global';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './pages/header/header.component';
import { GstsliderComponent } from './pages/gstslider/gstslider.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { TutorialvideoComponent } from './pages/tutorialvideo/tutorialvideo.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OwlModule } from 'ngx-owl-carousel';
import { FeaturesComponent } from './pages/features/features.component';
import { ReviewsComponent } from './pages/reviews/reviews.component';
import { ScreensComponent } from './pages/screens/screens.component';
//import { PriceplanComponent } from './pages/priceplan/priceplan.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ModalModule  } from 'ngx-bootstrap';
import { GetappComponent } from './pages/getapp/getapp.component';
import { ContactpageComponent } from './pages/contactpage/contactpage.component';
import { FooterComponent } from './pages/footer/footer.component';
import { ReactiveFormsModule ,FormsModule} from '@angular/forms';
import { CompanyComponent } from './pages/company/company.component';
import { CookieService } from 'ngx-cookie-service';
import { MessagePanelComponent } from './pages/message-panel/message-panel.component';
import {ChangeUserDetails} from './pages/changeuserdetail/changeuserdetails.component'
import { InviteUser } from './pages/inviteuser/inviteuser.component';
import {DataTablesModule} from 'angular-datatables';

//import { DashboardComponent } from './user-dashboard/dashboard/dashboard.component';
//import { UserHeaderComponent } from './user-dashboard/user-header/user-header.component';
//import { UserFooterComponent } from './user-dashboard/user-footer/user-footer.component';
//import { UserMenuComponent } from './user-dashboard/user-menu/user-menu.component';

//import { LedgerComponent } from './user-dashboard/ledger/ledger.component';
//import { ItemsComponent } from './user-dashboard/items/items.component';
//import { StockGroupComponent } from './user-dashboard/stock-group/stock-group.component';
//import { AccountGroupComponent } from './user-dashboard/account-group/account-group.component';
import { TitleComponent } from './pages/title/title.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { PackagesPlansComponent } from './pages/packages-plans/packages-plans.component';
import { HowItWorksComponent } from './pages/how-it-works/how-it-works.component';
import { FeaturespageComponent } from './pages/featurespage/featurespage.component';
//import { UnitComponent } from './user-dashboard/unit/unit.component';
//import { SubStockGroupComponent } from './user-dashboard/sub-stock-group/sub-stock-group.component';
//import { SalesinvoiceComponent } from './user-dashboard/salesinvoice/salesinvoice.component';
//import { PurchaseComponent } from './user-dashboard/purchase/purchase.component';
//import { ReceiptComponent } from './user-dashboard/receipt/receipt.component';
//import { PaymentComponent } from './user-dashboard/payment/payment.component';
//import { CreditnoteComponent } from './user-dashboard/creditnote/creditnote.component';
//import { DebitnoteComponent } from './user-dashboard/debitnote/debitnote.component';
//import { MasterAccountComponent } from './user-dashboard/master-account/master-account.component';
import { ArchwizardModule } from 'angular-archwizard';
import { NgxPaginationModule } from 'ngx-pagination';
import { JwPaginationModule } from 'jw-angular-pagination';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
//import { TaxesComponent } from './user-dashboard/taxes/taxes.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
//import { ViewsalesinvoiceComponent } from './user-dashboard/viewsalesinvoice/viewsalesinvoice.component';
//import { ViewPurchasevoucherComponent } from './user-dashboard/view-purchasevoucher/view-purchasevoucher.component';
//import { SalesinvoiceprintComponent } from './user-dashboard/salesinvoiceprint/salesinvoiceprint.component';
//import { PurchaseinvoiceprintComponent } from './user-dashboard/purchaseinvoiceprint/purchaseinvoiceprint.component';
//import { AddstockgroupComponent } from './component/addstockgroup/addstockgroup.component';
//import { AdditemComponent } from './component/additem/additem.component';
//import { AddledgerComponent } from './component/addledger/addledger.component';
//import { JournalvoucherComponent } from './user-dashboard/journalvoucher/journalvoucher.component';
//import { CreaterecieptComponent } from './user-dashboard/createreciept/createreciept.component';
//import { CreatepaymentComponent } from './user-dashboard/createpayment/createpayment.component';
//import { CreatecreditnoteComponent } from './user-dashboard/createcreditnote/createcreditnote.component';
//import { CreatedebitnoteComponent } from './user-dashboard/createdebitnote/createdebitnote.component';
//import { CreatejournalvoucherComponent } from './user-dashboard/createjournalvoucher/createjournalvoucher.component';
//import { PrintcreditnoteComponent } from './user-dashboard/printcreditnote/printcreditnote.component';
//import { PrintdebitnoteComponent } from './user-dashboard/printdebitnote/printdebitnote.component';
//import { PrintreceiptvoucherComponent } from './user-dashboard/printreceiptvoucher/printreceiptvoucher.component';
//import { PrintpaymentvoucherComponent } from './user-dashboard/printpaymentvoucher/printpaymentvoucher.component';
//import { PrintjournalComponent } from './user-dashboard/printjournal/printjournal.component';
//import { BalanceSheetComponent } from './reports/balance-sheet/balance-sheet.component';
//import { StockSummaryComponent } from './reports/stock-summary/stock-summary.component';
//import { LedgerAccountComponent } from './reports/ledger-account/ledger-account.component';
//import { ProfitLossComponent } from './reports/profit-loss/profit-loss.component';
//import { GroupSummaryComponent } from './reports/group-summary/group-summary.component';
//import { SalesRegisterComponent } from './reports/sales-register/sales-register.component';
//import { TrialBalanceComponent } from './reports/trial-balance/trial-balance.component';
//import { StockGroupReportComponent } from './reports/stock-group-report/stock-group-report.component';
//import { PurchaseRegisterComponent } from './reports/purchase-register/purchase-register.component';
//import { StockItemComponent } from './reports/stock-item/stock-item.component';
//import { VoucherReportsComponent } from './reports/voucher-reports/voucher-reports.component';
//import { JournalRegisterComponent } from './reports/journal-register/journal-register.component';
//import { CashbankBookComponent } from './reports/cashbank-book/cashbank-book.component';
//import { MultiplestockComponent } from './reports/multiplestock/multiplestock.component';
//import { AccountgroupReportComponent } from './reports/accountgroup-report/accountgroup-report.component';
//import { BankBookreportComponent } from './reports/bank-bookreport/bank-bookreport.component';
//import { EditSalesvoucherComponent } from './user-dashboard/edit-salesvoucher/edit-salesvoucher.component';
//import { EditPurchaseComponent } from './user-dashboard/edit-purchase/edit-purchase.component';
//import { EditDebitnoteComponent } from './user-dashboard/edit-debitnote/edit-debitnote.component';
//import { EditCreditnoteComponent } from './user-dashboard/edit-creditnote/edit-creditnote.component';
//import { EditReceiptComponent } from './user-dashboard/edit-receipt/edit-receipt.component';
//import { EditPaymentComponent } from './user-dashboard/edit-payment/edit-payment.component';
//import { EditJournalComponent } from './user-dashboard/edit-journal/edit-journal.component';
//import { GSTReportsComponent } from './reports/gst-reports/gst-reports.component';
//import { GstReportsOneComponent } from './reports/gst-reports-one/gst-reports-one.component';
//import { GstReportsTwoComponent } from './reports/gst-reports-two/gst-reports-two.component';
//import { OrderComponent } from './user-dashboard/order/order.component';
import { WindowRefService } from 'src/app/service/window-ref.service';
//import { PriceplanetwoComponent } from './pages/priceplanetwo/priceplanetwo.component';
import { BuyplaneComponent } from './component/buyplane/buyplane.component';
//import { SubaccountgroupComponent } from './component/subaccountgroup/subaccountgroup.component';
//import { ClosingvalueComponent } from './reports/closingvalue/closingvalue.component';
//import { CreateStockinhandComponent } from './user-dashboard/create-stockinhand/create-stockinhand.component';
//import { EditStockinhandComponent } from './user-dashboard/edit-stockinhand/edit-stockinhand.component';
//import { PrintStockinhandComponent } from './user-dashboard/print-stockinhand/print-stockinhand.component';
//import { PriceplanViewComponent } from './pages/priceplan-view/priceplan-view.component';

//import { AdminFooterComponent } from './admin-dashboard/admin-footer/admin-footer.component';
//import { AdminHeaderComponent } from './admin-dashboard/admin-header/admin-header.component';
//import { AdminMenuComponent } from './admin-dashboard/admin-menu/admin-menu.component';
//import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard/admin-dashboard.component';
//import { AdminTaxesComponent } from './admin-dashboard/admin-taxes/admin-taxes.component';
//import { MasterAccountAdminComponent } from './admin-dashboard/master-account-admin/master-account-admin.component';
//import { UnitsAdminComponent } from './admin-dashboard/units-admin/units-admin.component';
//import { UsersdetailAdminComponent } from './admin-dashboard/usersdetail-admin/usersdetail-admin.component';
//import { UserdetailViewComponent } from './admin-dashboard/userdetail-view/userdetail-view.component';
//import { PlanChangesComponent } from './admin-dashboard/plan-changes/plan-changes.component';
//import { StateAddComponent } from './admin-dashboard/state-add/state-add.component';
//import { FreeTrialComponent } from './admin-dashboard/free-trial/free-trial.component';
//import { OrganizationinfoComponent } from './admin-dashboard/organizationinfo/organizationinfo.component';
//import { PlanDetailShowComponent } from './admin-dashboard/plan-detail-show/plan-detail-show.component';
//import { PlanComponent } from './pages/plan/plan.component';

import { TwoDigitDecimaNumberDirective } from './two-digit-decima-number.directive';
//import { StockReportViewComponent } from './user-dashboard/stock-report-view/stock-report-view.component';
import { TermsOfServiceComponent } from './pages/home/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './pages/home/privacy-policy/privacy-policy.component';
import { ViewUserComponent } from './user-dashboard/view-user/view-user.component';

//import { PlanOrderComponent } from './pages/plan-order/plan-order.component';
//import { DownloadComponent } from './user-dashboard/download/download.component';
// import { AppErrorShowComponent } from './user-dashboard/app-error-show/app-error-show.component';
// import { AppPurhcasevoucherprintComponent } from './user-dashboard/app-purhcasevoucherprint/app-purhcasevoucherprint.component';
// import { AppSalevoucherprintComponent } from './user-dashboard/app-salevoucherprint/app-salevoucherprint.component';
// import { AppDebitnoteprintComponent } from './user-dashboard/app-debitnoteprint/app-debitnoteprint.component';
// import { AppCreditnoteprintComponent } from './user-dashboard/app-creditnoteprint/app-creditnoteprint.component';
// import { AppReceiptprintComponent } from './user-dashboard/app-receiptprint/app-receiptprint.component';
// import { AppPaymentprintComponent } from './user-dashboard/app-paymentprint/app-paymentprint.component';
// import { AppJournalvoucherComponent } from './user-dashboard/app-journalvoucher/app-journalvoucher.component';
// import { AppStockinhandvoucherComponent } from './user-dashboard/app-stockinhandvoucher/app-stockinhandvoucher.component';

// import { AppvouchersComponent } from './appvouchers/appvouchers.component';
// import { AppreportsComponent } from "./appreports/appreports.component";



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    TwoDigitDecimaNumberDirective,
    GstsliderComponent,
    TutorialvideoComponent,
    FeaturesComponent,
    ReviewsComponent,
    ScreensComponent,
    //PriceplanComponent,
    LoginComponent,
    SignupComponent,
    GetappComponent,
    ContactpageComponent,
    FooterComponent,
    CompanyComponent,
    ChangeUserDetails,
    InviteUser,
    MessagePanelComponent,
   // DashboardComponent,
   // UserHeaderComponent,
   // UserFooterComponent,
   // UserMenuComponent,
    //LedgerComponent,
    //ItemsComponent,
    //StockGroupComponent,
    //AccountGroupComponent,
    TitleComponent,
    ProductDetailsComponent,
    PackagesPlansComponent,
    HowItWorksComponent,
    FeaturespageComponent,
    //UnitComponent,
    //SubStockGroupComponent,
    //SalesinvoiceComponent,
    //PurchaseComponent,
    //ReceiptComponent,
    //PaymentComponent,
    //CreditnoteComponent,
    //DebitnoteComponent,
    //MasterAccountComponent,
    //TaxesComponent,
    //ViewsalesinvoiceComponent,
    //ViewPurchasevoucherComponent,
    //SalesinvoiceprintComponent,
    //PurchaseinvoiceprintComponent,
   // AddstockgroupComponent,
    //AdditemComponent,
    //AddledgerComponent,
    //JournalvoucherComponent,
    //CreaterecieptComponent,
   // CreatepaymentComponent,
    //CreatecreditnoteComponent,
    //CreatedebitnoteComponent,
    //CreatejournalvoucherComponent,
    //PrintcreditnoteComponent,
    //PrintdebitnoteComponent,
    //PrintreceiptvoucherComponent,
    //PrintpaymentvoucherComponent,
    //PrintjournalComponent,
    //BalanceSheetComponent,
    //StockSummaryComponent,
    //LedgerAccountComponent,
    //ProfitLossComponent,
    //GroupSummaryComponent,
    //SalesRegisterComponent,
    //TrialBalanceComponent,
    //StockGroupReportComponent,
    //PurchaseRegisterComponent,
    //StockItemComponent,
    //VoucherReportsComponent,
    //JournalRegisterComponent,
    //CashbankBookComponent,
    //MultiplestockComponent,
    //AccountgroupReportComponent,
    //BankBookreportComponent,
    //EditSalesvoucherComponent,
    //EditPurchaseComponent,
    //EditDebitnoteComponent,
    //EditCreditnoteComponent,
    //EditReceiptComponent,
    //EditPaymentComponent,
    //EditJournalComponent,
    //GSTReportsComponent,
    //GstReportsOneComponent,
    //GstReportsTwoComponent,
    //OrderComponent,
    //PriceplanetwoComponent,
    BuyplaneComponent,
    //SubaccountgroupComponent,
    //ClosingvalueComponent,
    //CreateStockinhandComponent,
    //EditStockinhandComponent,
    ///PrintStockinhandComponent,
    //PriceplanViewComponent,
   // AdminFooterComponent,
    //AdminHeaderComponent,
    //AdminMenuComponent,
    //AdminDashboardComponent,
    //AdminTaxesComponent,
    //MasterAccountAdminComponent,
    //UnitsAdminComponent,
    //UsersdetailAdminComponent,
    //UserdetailViewComponent,
    //PlanChangesComponent,
    //StateAddComponent,
    //FreeTrialComponent,
    //OrganizationinfoComponent,
    //PlanDetailShowComponent,
    //StockReportViewComponent,
    TermsOfServiceComponent,
    PrivacyPolicyComponent,
    // ViewUserComponent,
    //AutoLedgerListComponent,
    //PlanComponent,
   // PlanOrderComponent,
    //DownloadComponent
    // AppErrorShowComponent
    // AppPurhcasevoucherprintComponent,
    // AppSalevoucherprintComponent,
    // AppDebitnoteprintComponent,
    // AppCreditnoteprintComponent,
    // AppReceiptprintComponent,
    // AppPaymentprintComponent,
    // AppJournalvoucherComponent,
    // AppStockinhandvoucherComponent
    // AppvouchersComponent,
    // AppreportsComponent
  ],
  imports: [
    BrowserAnimationsModule,
    OwlModule,
    CarouselModule,
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule,
    HttpClientModule,
    DataTableModule,
    NgxPaginationModule,
    JwPaginationModule,
    NgbModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    MaterialModule,
    Select2Module,
    NgSelectModule,
    SplitButtonModule,
    ArchwizardModule,
    ModalModule.forRoot(),
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
    })
  ],
  entryComponents: [BuyplaneComponent],
  providers:
  [
    MessageService,
    { provide: 'API_URL', useFactory: getApiUrl },
      CookieService,Globals,
      WindowRefService,
    { provide: 'RAZOR_PAY_KEY', useFactory: getRazorPayKey },
    { provide : LocationStrategy , useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }

export function getApiUrl() {
  // return 'http://localhost:8989/';
  // return 'http://168.235.88.106:8989/';
    // return 'https://api.myaccountsapp.in/';
    return 'https://maa.colanapps.in/'
}

export function getRazorPayKey() {
  // ------------NEW KEY ----------------------------
  // return 'rzp_live_Jq6uyCiWYLc93Y';
  return 'rzp_test_ka8C2RJbXmzbto';

  // ------------OLD KEY ----------------------------
  // return 'rzp_test_v9ql5QCGwV1fF6';
  // return 'rzp_live_rUYnNuY7W5RJ5v';
}
