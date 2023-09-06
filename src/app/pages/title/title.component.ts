import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {

  @Input()
  heading1 = 'CONTACT US';
  @Input()
  heading2 = 'CONTACT US';
  
  constructor() { }

  ngOnInit() {
  }

}
