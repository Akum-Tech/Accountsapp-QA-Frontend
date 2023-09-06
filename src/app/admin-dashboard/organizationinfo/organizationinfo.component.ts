import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AdminServicesService } from './../../service/admin-services.service'
import { FormBuilder, Validators } from '@angular/forms';
import { MessagePanelService } from './../../service/message-panel.service';
import { Globals } from './../../global';
import { LocalStorageService } from './../../service/local-storage.service';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-organizationinfo',
  templateUrl: './organizationinfo.component.html',
  styleUrls: ['./organizationinfo.component.css']
})
export class OrganizationinfoComponent implements OnInit {

 
  modalRef: BsModalRef;
  public data : any;
  loader=true;
  clicked = false;
  infolist: any = [];
  dataNotFount = true ;
  
  imgbaseurl="";
  fileToUpload:any = [];
  defaultImage: any='';
  imagename: any;
  deleteData:any = {};

  constructor(public adminServicesService:AdminServicesService,private modalService: BsModalService,public globals: Globals, private router: Router, private formBuilder: FormBuilder, private messagePanelService: MessagePanelService, private localStorageService: LocalStorageService,public dialog: MatDialog) { }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  Addinfo = this.formBuilder.group({
    company_name: ['', Validators.required],
    gst_number: ['',[Validators.pattern('^([a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$')]],
    cin_number: [''],
    service_code: [''],
    phone_number: ['',  Validators.pattern('^[0-9]{10}$')],
    email: ['', Validators.pattern('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/')],
    terms: [''],
    pan_number:['',[Validators.pattern('^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$')]],
    address: [''],
    file:"",
  });

  Editinfo = this.formBuilder.group({
    company_name: ['', Validators.required],
    gst_number: ['',[Validators.pattern('^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$')]],
    cin_number: [''],
    service_code: [''],
    phone_number: ['',  Validators.pattern('^[0-9]{10}$')],
    email: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')],
    terms: [''],
    pan_number:['',[Validators.pattern('^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$')]],
    address: [''],
    file:"",
  });

  isValid(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
 }

 validation_messages={
  'company_name':[
    { type:'required', message:'Please Enter Company Name'}
  ],
  'gst_number':[
  { type:'pattern', message:'Enter Valid GST Number'}
  ],
  'pan_number':[
  { type:'pattern', message:'Enter Valid Pan Number'}
  ],
  'email':[
    { type:'pattern', message:'Enter Valid Email ID'}
    ],
    'phone_number':[
      { type:'pattern', message:'Please Enter Valid Phone Number'}
    ],
 
}

  ngOnInit() {
    this.GetInfoDetail();
    this.imgbaseurl=this.localStorageService.getBaseUrl();
  }

  async Addorganizationinfo() {
    this.clicked = false;
    this.Addinfo.controls['file'].setValue(this.fileToUpload);
    let company_name = this.Addinfo.controls['company_name'].value;
    let gst_number = this.Addinfo.controls['gst_number'].value?this.Addinfo.controls['gst_number'].value:'';
    let pan_number = this.Addinfo.controls['pan_number'].value?this.Addinfo.controls['pan_number'].value:'';
    let address = this.Addinfo.controls['address'].value?this.Addinfo.controls['address'].value:'';
    let cin_number = this.Addinfo.controls['cin_number'].value?this.Addinfo.controls['cin_number'].value:'';
    let service_code = this.Addinfo.controls['service_code'].value?this.Addinfo.controls['service_code'].value:'';
    let phone_number = this.Addinfo.controls['phone_number'].value?this.Addinfo.controls['phone_number'].value:'';
    let terms = this.Addinfo.controls['terms'].value?this.Addinfo.controls['terms'].value:'';
    let email = this.Addinfo.controls['email'].value?this.Addinfo.controls['email'].value:'';
    let logo = this.Addinfo.controls['file'].value?this.Addinfo.controls['file'].value:'';
     

    if (!company_name) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Company Name", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }
    // else if(!this.isValid(email)) {
    //   this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Email ID", this.globals.messageCloseTime, this.globals.messageType.error);
    //   return false;
    // }
    else {
      
      
      let obj=null;
      if(logo!= null && logo!=""){
        obj= {"company_name": company_name,"gst_number":gst_number,"pan_number":pan_number,"address":address,"cin_number":cin_number,"phone_number":phone_number,"service_code":service_code,"terms":terms,"email":email,"file":logo};
      }else{
        obj= {"company_name": company_name,"service_code":service_code,"gst_number":gst_number,"pan_number":pan_number,"address":address,"cin_number":cin_number,"phone_number":phone_number,"terms":terms,"email":email};
      }

      let form_data = await  new FormData();
      for ( var key in obj ) {
         await form_data.append(key, obj[key]);
      }

      this.clicked = true;
      this.adminServicesService.addinfodetail(form_data).subscribe(data => {
        if (data === null || data === undefined) {
          this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
        } else if (data['success'] == true) { 
          this.modalRef.hide();
          this.Addinfo.reset();
          setTimeout(()=>{ 
            this.GetInfoDetail();
           
            this.defaultImage='';
            this.fileToUpload=null;
        }, 1000);

        } else if (data['statusCode'] == 400) {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
        } else {
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
        }
      });
    }
  }  

    
  onChangeSetImagePath(event){
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        this.imagename = file.name;
        const img = new Image();
        img.src = window.URL.createObjectURL( file );
        this.fileToUpload=file;
        reader.readAsDataURL(file);
        reader.onload = () => {
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          window.URL.revokeObjectURL( img.src );
          this.defaultImage = reader.result;
      };
    }
  }

  GetInfoDetail(){
    this.dataNotFount = true;
    this.adminServicesService.getinfodetail().subscribe(data => {
      if (data === null || data === undefined){
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] === true) {
        if(data.company.length>0){
          this.infolist = data.company;
          this.loader = false;
        }else{
          this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
          this.loader = false;
        }
      } else if (data['statusCode'] == 400) {
        this.loader = false;
        this.dataNotFount = false;
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.loader = false;
        this.dataNotFount = false;
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }

  async editorganizationinfo(){
    this.Editinfo.controls['file'].setValue(this.fileToUpload);
    let id = this.Editinfo.controls['id'].value;
    let company_name = this.Editinfo.controls['company_name'].value;
    let gst_number = this.Editinfo.controls['gst_number'].value?this.Editinfo.controls['gst_number'].value:'';
    let pan_number = this.Editinfo.controls['pan_number'].value?this.Editinfo.controls['pan_number'].value:'';
    let address = this.Editinfo.controls['address'].value?this.Editinfo.controls['address'].value:'';
    let cin_number = this.Editinfo.controls['cin_number'].value?this.Editinfo.controls['cin_number'].value:'';
    let service_code = this.Editinfo.controls['service_code'].value?this.Editinfo.controls['service_code'].value:'';
    let phone_number = this.Editinfo.controls['phone_number'].value?this.Editinfo.controls['phone_number'].value:'';
    let terms = this.Editinfo.controls['terms'].value?this.Editinfo.controls['terms'].value:'';
    let email = this.Editinfo.controls['email'].value?this.Editinfo.controls['email'].value:'';
    let logo = this.Editinfo.controls['file'].value?this.Editinfo.controls['file'].value:'';
     
    if (!company_name) {
      this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Company Name", this.globals.messageCloseTime, this.globals.messageType.error);
      return false;
    }
    // else if(!this.isValid(email)) {
    //   this.messagePanelService.ShowPopupMessageWithLocalization("Please Enter Valid Email ID", this.globals.messageCloseTime, this.globals.messageType.error);
    //   return false;
    // }
    else {
      
      
      let obj=null;
      if(logo!= null && logo!=""){
        obj= {"company_name": company_name,"gst_number":gst_number,"pan_number":pan_number,"address":address,"service_code":service_code,"cin_number":cin_number,"phone_number":phone_number,"terms":terms,"email":email,"file":logo};
      }else{
        obj= {"company_name": company_name,"gst_number":gst_number,"pan_number":pan_number,"address":address,"service_code":service_code,"cin_number":cin_number,"phone_number":phone_number,"terms":terms,"email":email};
      }

      let form_data = await  new FormData();
      for ( var key in obj ) {
        await form_data.append(key, obj[key]);
      }
      let data ={
        id:id,
        form_data:form_data
      }
    this.adminServicesService.putinfodetail(data).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) { 
        this.modalRef.hide();
        this.Editinfo.reset();

        setTimeout(()=>{ 
          this.GetInfoDetail();
        
          this.defaultImage='';
          this.fileToUpload=null;
        }, 1000);

      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
    }
  }

   openAddInfo(addtemplate: TemplateRef<any>) {
    this.defaultImage='';
    this.fileToUpload=null;
    this.Addinfo.reset();
    this.modalRef = this.modalService.show(addtemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  // deleteplan(data) {
  //   this.adminServicesService.deleteplaninfo(data.id).subscribe(data => {
  //     if (data === null || data === undefined) {
  //       this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
  //     } else if (data['success'] == true) { 
  //       this.deleteData = {};
  //       this.modalRef.hide();
  //       setTimeout(()=>{ 
  //         this.GetInfoDetail();
  //       }, 1000);
  //     } else if (data['statusCode'] == 400) {
  //       this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.success);
  //     } else {
  //       this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
  //     }
  //   });
  // }

  openInfoEditModal(Edittemplate: TemplateRef<any>,item) {
    this.clicked = false;
    this.defaultImage = item.logo?this.localStorageService.getBaseUrl()+item.logo:'';
    this.fileToUpload = item.logo;

    this.Editinfo = this.formBuilder.group({
        id: [item.id],
        company_name: [item.company_name, Validators.required],
        gst_number: [item.gst_number,[Validators.pattern('^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$')]],
        cin_number: [item.cin_number],
        service_code: [item.service_code],
        phone_number: [item.phone_number,  Validators.pattern('^[0-9]{10}$')],
        email: [item.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')],
        terms: [item.terms],
        pan_number:[item.pan_number,[Validators.pattern('^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$')]],
        address: [item.address],
        file:"",
    });


    this.modalRef = this.modalService.show(Edittemplate, {
      class:'modal-lg',
      keyboard: false,
      backdrop:'static'
    });
  }

  
  // openTrailDeleteModal(deletetemplate: TemplateRef<any>, item) {
  //   this.deleteData = item?item:{};
  //   this.modalRef = this.modalService.show(deletetemplate, {
  //     class:'modal-lg',
  //     keyboard: false,
  //     backdrop:'static'
  //   });
  // }

}
