import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'invite-user',
  templateUrl: './inviteuser.component.html',
  styleUrls: ['./inviteuser.component.css']
})
export class InviteUser {
  isEmailSectionVisible = false;
  isMobileSectionVisible = false;
  isEmailExtraSectionVisible=false;
  isPhoneExtraSectionVisible=false;
  isEmailOTPVisible = false;
  isPhoneOTPVisible = false;
  isEmailOTPSendVisible=false;
  isPhoneOTPSendVisible=false;

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }


}