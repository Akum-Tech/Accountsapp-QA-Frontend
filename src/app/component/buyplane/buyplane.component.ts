import { Component, OnInit, TemplateRef, Inject } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Globals } from './../../global';
import { Router } from '@angular/router';
import { SalesinvoiceComponent } from '../../user-dashboard/salesinvoice/salesinvoice.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-buyplane',
  templateUrl: './buyplane.component.html',
  styleUrls: ['./buyplane.component.css']
})
export class BuyplaneComponent implements OnInit {

  
  
  deleteData:any = {};
  modalRef: BsModalRef;

  constructor( private router: Router,public globals: Globals,private modalService: BsModalService,public dialog: MatDialog, public dialogRef: MatDialogRef<SalesinvoiceComponent>, @Inject(MAT_DIALOG_DATA) public otherdata: any){}

  closebuyplan(){
    this.dialogRef.close();
    this.router.navigate(['admin/dashboard']);
  }

  backdashboard(){
    this.dialogRef.close();
    this.router.navigate(['admin/dashboard']);
  }

  buyplan(){
    this.dialogRef.close();
    this.router.navigate(['admin/priceplan']);
  }

  ngOnInit() {
  }

}
