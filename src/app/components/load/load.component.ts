import {Component, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import { LoadService } from '../../services/load.service';
import { DepartmentInfo, Faculty, Kafedra } from '../../models/common';
import { Load, Teacher } from '../../models/load';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css'],
  providers: [ LoadService ],
  encapsulation: ViewEncapsulation.None,
})

export class LoadComponent implements OnInit {

  @Output() cmpName: any = 'Сарбории кафедра';
  @Input() depInfo: DepartmentInfo;
  kafedra: Kafedra = {
    id: null,
    shortName: '',
    fullName: ''
  };
  faculty: Faculty = {
    id: null,
    shortName: '',
    fullName: ''
  };
  subjects: Load[] = [];
  teachers: Teacher[] = [{
    Id: 0,
    Fio: '',
    Post: '',
    UchStep: '',
    Science_degree: ''
  }];

  arrExSubjects = [];

  constructor(private loadService: LoadService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.kafedra = {
      id: this.depInfo.kf_id,
      fullName: this.depInfo.kafedra,
      shortName: ''
    };

    this.faculty.fullName = this.depInfo.faculty;

    this.loadService.getTeachersByKf(this.kafedra.id).subscribe(resp => {
      if (!resp.error) {
        resp.data.forEach(teacher => {
          this.teachers.push({
            Id: +teacher.Id,
            Fio: teacher.Fio,
            Post: teacher.Post,
            UchStep: teacher.UchStep,
            Science_degree: teacher.Science_degree
          });
        });

        this.loadService.getLoadSubjectsByKf(this.kafedra.id).subscribe((response) => {
          if (!response.error) {

            this.subjects = response.data.slice();
            this.subjects.forEach(subject => {
              this.arrExSubjects.push(subject.idExSubject + subject.group);

              subject.degree = this.authService.DEGREES[+subject.degree];
              subject.type = this.authService.TYPES[+subject.type];
              subject.idTeacher = this.teachers.find(x => +x.Id === +subject.idTeacher).Fio;
              subject.isTeacherSaved = !(subject.idTeacher === '');

            });

            // this.arrExSubjects.filter((v, i, self) => self.indexOf(v) === i);
            this.arrExSubjects = Array.from(new Set(this.arrExSubjects));
          }
        });
      }
    });
  }

  findSubjects(id: string) {
    return this.subjects.filter(x => (x.idExSubject + x.group) === id);
  }

  getKafedrasLoadById(filter: { kf: Kafedra, fc: Faculty }) {
    this.faculty = filter.fc;
    this.kafedra = filter.kf;
  }

  connectTeacherWithSubject(teacher: string, idSubject: number) {
    const teacherId = this.teachers.find(x => x.Fio === teacher).Id;

    this.loadService.saveTeacherId(teacherId, idSubject).subscribe(resp => {
      if (!resp.error) {
        this.subjects.find(x => +x.id === idSubject).isTeacherSaved = true;
      }
    });
  }

  deleteTeacherId(idSubject: number) {
    this.loadService.deleteTeacherId(idSubject).subscribe(resp => {
      if (!resp.error) {
        const sb = this.subjects.find(x => +x.id === idSubject);
        sb.isTeacherSaved = false;
        sb.idTeacher = '';
      }
    });
  }
}
