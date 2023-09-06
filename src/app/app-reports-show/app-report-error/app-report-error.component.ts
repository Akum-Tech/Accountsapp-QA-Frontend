import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Globals } from './../../global';
import { Router } from '@angular/router';

import { AppBankBookComponent } from '../../app-reports-show/app-bank-book/app-bank-book.component';


@Component({
  selector: 'app-app-report-error',
  templateUrl: './app-report-error.component.html',
  styleUrls: ['./app-report-error.component.css']
})
export class AppReportErrorComponent implements OnInit {

  
  modalRef: BsModalRef;

  constructor(public dialogRef: MatDialogRef<AppBankBookComponent>, @Inject(MAT_DIALOG_DATA) public otherdata: any) { }

  ngOnInit() {
  }

  closemodal(){
    // this.location.back();
    this.dialogRef.close();
  }

}
