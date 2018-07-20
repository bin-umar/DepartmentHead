import {Component, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-load-kaf',
  templateUrl: './load-kaf.component.html',
  styleUrls: ['./load-kaf.component.css']
})
export class LoadKafComponent implements OnInit {

  @Output() cmpName: any = 'Сарбории кафедра';
  constructor() { }

  ngOnInit() {
  }

}
