import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ICourseWorks } from '../../models/load';

@Component({
  selector: 'app-course-works',
  templateUrl: './course-works.component.html',
  styleUrls: ['./course-works.component.css']
})

export class CourseWorksComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CourseWorksComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ICourseWorks) { }

  // subjectName: string;
  // term: number;
  // course: number;
  // degree: string;
  // type: string;
  // sections: ISection[];
  // id: number;
  // groups: string[];
  // studentsAmount: number;
  // idSection: number;
  // section: string;
  // hour: number;
  // idTeacher: string;
  // isTeacherSaved: boolean;
  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
