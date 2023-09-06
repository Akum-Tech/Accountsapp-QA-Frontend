import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { MessagePanelService } from 'src/app/service/message-panel.service';
import { Globals } from 'src/app/global';
import { Router, ActivatedRoute } from '@angular/router';
import { BuyplaneService } from 'src/app/service/buyplane.service';
import { WindowRefService } from 'src/app/service/window-ref.service';
import { UserinfoModule } from './../../model/userinfo/userinfo.module';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-plan-order',
  templateUrl: './plan-order.component.html',
  styleUrls: ['./plan-order.component.css']
})
export class PlanOrderComponent implements OnInit {

  activeUser: any;
  subscriptionId: string;
  order: any = null;
  Addressdetail: any = null;
  razorPayKey: string;
  Userdata: UserinfoModule;
  setvalue :any;

  clicked = false;
  isShow_one : boolean;
  isShow_two : boolean;

  constructor(private localStorageService: LocalStorageService, 
    private messagePanelService: MessagePanelService, 
    public globals: Globals, 
    private router: Router, 
    private buyplaneService: BuyplaneService,
    private route: ActivatedRoute,
    private winRef: WindowRefService,
    private formBuilder: FormBuilder,
    @Inject('RAZOR_PAY_KEY') razorPayKey: string,
    private ngZone: NgZone) { 
      this.razorPayKey = razorPayKey;
  }
  
  orderform:any = {
    name :'',
    gst_number:'',
    email:'',
    address:''
  };

  isValid(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
 }

  validation_messages={
    'gst_number':[
      { type:'pattern', message:'Please Enter Valid Gst Number'}
      ],
  }

  ngOnInit() {
    this.isShow_one=true;
    this.isShow_two=false;

    this.activeUser = this.localStorageService.getuserdata();

    this.orderform.name = this.activeUser.name;
    this.orderform.email = this.activeUser.email;
  }

  
  backstep(){
    this.router.navigate(['/home']);
  }

  addressshow(){    
    this.clicked = false;
    this.route.queryParams.subscribe(params => {
      this.subscriptionId = params['subscriptionId'] ? params['subscriptionId'] : null;
    });

    this.clicked = true;
    if(this.activeUser.uid) {
      if(this.subscriptionId) {
        this.proceed(this.subscriptionId);

        setTimeout(() => {
          this.showsteps(2);
          this.clicked = true;
        }, 3000);

      } else {
        localStorage.clear();
        this.messagePanelService.ShowPopupMessageWithLocalization("Invalid URL Please Try Again Later",this.globals.messageCloseTime,this.globals.messageType.error)
        this.router.navigate(['admin/plan']);
      }
    } else {
      this.messagePanelService.ShowPopupMessageWithLocalization("Invalid URL Please Try Again Later",this.globals.messageCloseTime,this.globals.messageType.error)
      this.router.navigate(['/home']);
    }
  }

  
  proceed(subscriptionPlanId) {
    let decodesubid = atob(subscriptionPlanId);
    var body = { 'id': decodesubid,'name':this.orderform.name,'email':this.orderform.email,'gst_number':this.orderform.gst_number,'address':this.orderform.address};
    // var body = { 'id': decodesubid, name:'test', email:'test@gmail.com', address:'indore india', gst_number:'123123123a12' };
    this.buyplaneService.orderplan(body).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) { 
        this.order = data.data;
      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }


  checkOut() {
    if(!(this.order.amount_due > 0)) { return; }

    const options: any = {
      key: this.razorPayKey,
      amount: (this.order.amount_due * 100), // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: 'GST Accounting', // company name or product name
      description: 'Subscription',  // product description
      image: 'assets/images/logo.png', // company logo or product image
      order_id: this.order.id, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      prefill: {
        name: this.activeUser.name,
        email: this.activeUser.email,
        contact: this.activeUser.phone
      },      
      notes: {
        // include notes if any
      },
      theme: {
        color: '#0c238a'
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      // call your backend api to verify payment signature & capture transaction
      this.verify(response);
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  verify(response) {
    this.buyplaneService.verifyOrderplan(response).subscribe(data => {
      if (data === null || data === undefined) {
        this.messagePanelService.ShowPopupMessageWithLocalization('An error occured, please try again later', this.globals.messageCloseTime, this.globals.messageType.error);
      } else if (data['success'] == true) { 

        this.ngZone.run(() => this.router.navigate(['/home']));

      } else if (data['statusCode'] == 400) {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      } else {
        this.messagePanelService.ShowPopupMessageWithLocalization(data['message'], this.globals.messageCloseTime, this.globals.messageType.error);
      }
    });
  }
  
  showsteps(val){
    if(val==1){
    this.isShow_one=true;
    this.isShow_two=false;
    }else if(val==2){
      this.isShow_one=false;
      this.isShow_two=true;
    }else{
      // noting 
    }
  }


  

}
