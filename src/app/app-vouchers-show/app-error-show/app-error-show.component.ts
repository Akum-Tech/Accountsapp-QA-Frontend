import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Globals } from './../../global';
import { Router } from '@angular/router';

import { AppPurhcasevoucherprintComponent } from '../../app-vouchers-show/app-purhcasevoucherprint/app-purhcasevoucherprint.component';

@Component({
  selector: 'app-app-error-show',
  templateUrl: './app-error-show.component.html',
  styleUrls: ['./app-error-show.component.css']
})
export class AppErrorShowComponent implements OnInit {

  
  modalRef: BsModalRef;

  constructor(public dialogRef: MatDialogRef<AppPurhcasevoucherprintComponent>, @Inject(MAT_DIALOG_DATA) public otherdata: any) { }

  ngOnInit() {
  }

  closemodal(){
    // this.location.back();
    this.dialogRef.close();
  }
}
