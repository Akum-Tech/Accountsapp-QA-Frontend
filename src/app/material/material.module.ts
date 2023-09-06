import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTableModule,
  MatToolbarModule,
  MatBottomSheetModule,
  MatSliderModule,
  MatTabsModule,
  MatSidenavModule,
  MatPaginatorModule,
  MAT_RADIO_DEFAULT_OPTIONS,
  MAT_BOTTOM_SHEET_DATA,
  MAT_DATE_FORMATS
} from '@angular/material';
import {MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';


const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatBadgeModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatSliderModule,
    MatTabsModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatBadgeModule,
    MatGridListModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatSliderModule,
    MatTabsModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  
  declarations: [],
  entryComponents: [],
  providers: [
    {
      provide: MAT_BOTTOM_SHEET_DATA,
      useValue: {}
    },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    { 
      provide: DateAdapter, useClass: MomentDateAdapter, 
      deps: [MAT_DATE_LOCALE]
    },
    {
      provide: MAT_DATE_FORMATS, 
      useValue: MY_FORMATS
    },
  ]
})


export class MaterialModule {
  
}

