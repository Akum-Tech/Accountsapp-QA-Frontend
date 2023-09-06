
import { EventEmitter, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MessagePanelService {

  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;
  emitter: EventEmitter<any> = new EventEmitter();
  authEmitter: EventEmitter<any> = new EventEmitter();

  childPageLoadedSub: Subject<any> = new Subject();
  childPageLoaded = this.childPageLoadedSub.asObservable();

  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next();
        }
      }
    });
  }


  ShowPopupMessageWithLocalization(key, autoCloseSecond,type){
    this.subject.next({ key: key, autoCloseSecond: autoCloseSecond ,msgType:type});
		// get 'key' message and make localization, show popup during 'autoCloseSecond' 
	}

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
