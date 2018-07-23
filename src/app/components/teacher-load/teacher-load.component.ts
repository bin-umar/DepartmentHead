import {Component, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-teacher-load',
  templateUrl: './teacher-load.component.html',
  styleUrls: ['../extraction/extraction.component.css']
})
export class TeacherLoadComponent implements OnInit {

  @Output() cmpName: any = 'Сарбории омӯзгорони кафедра';
  constructor() { }

  ngOnInit() {
  }

}
