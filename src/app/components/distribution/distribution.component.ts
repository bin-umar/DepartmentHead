import { Component, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { DepartmentInfo, Faculty, Kafedra } from '../../models/common';
import { Distribution, IDistribution, Load, Teacher } from '../../models/load';
import { AuthService } from '../../services/auth.service';
import { LoadService } from '../../services/load.service';
import { ExtractionService } from '../../services/extraction.service';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.css'],
  providers: [ LoadService, ExtractionService ],
  encapsulation: ViewEncapsulation.None,
})

export class DistributionComponent implements OnInit {

  @Output() cmpName: any = 'Тақсимкунии соатҳои кафедра';
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

  subjects: IDistribution[] = [];
  teachers: Teacher[];

  constructor(private loadService: LoadService,
              private extService: ExtractionService,
              private auth: AuthService) {
  }

  ngOnInit() {
    this.kafedra = {
      id: this.depInfo.kf_id,
      fullName: this.depInfo.kafedra,
      shortName: ''
    };

    this.faculty.fullName = this.depInfo.faculty;

    this.extService.getTeachersByKf(this.kafedra.id).subscribe(resp => {
      if (!resp.error) {
        this.teachers = resp.data.slice();
        this.teachers.unshift({
          Id: 0,
          Fio: '',
          Post: '',
          UchStep: '',
          Science_degree: ''
        });

        this.loadService.getLoadSubjectsByKf(this.kafedra.id).subscribe((response) => {
          if (!response.error) {

            const subjects: Load[] = response.data.slice();
            subjects.forEach(subject => {

              subject.newId = subject.idExSubject + subject.group;
              subject.degree = this.auth.DEGREES[+subject.degree];
              subject.type = this.auth.TYPES.find(o => o.id === +subject.type).name;

            });

            const distribution = new Distribution(subjects, this.teachers);
            this.subjects = distribution.getSubjects();
          }
        });
      }
    });
  }

  getKafedrasLoadById(filter: { kf: Kafedra, fc: Faculty }) {
    this.faculty = filter.fc;
    this.kafedra = filter.kf;
  }

  connectTeacherWithSubject(teacher: string, idSubject: number) {
    const teacherId = this.teachers.find(x => x.Fio === teacher).Id;

    this.loadService.saveTeacherId(teacherId, idSubject).subscribe(resp => {
      if (!resp.error) {
        this.subjects.some(o => {
          const sb = o.sections.find(x => +x.id === +idSubject);
          if (sb) { sb.isTeacherSaved = true; return true; }
        });
      }
    });
  }

  deleteTeacherId(idSubject: number) {
    this.loadService.deleteTeacherId(idSubject).subscribe(resp => {
      if (!resp.error) {
        this.subjects.some(o => {

          const sb = o.sections.find(x => +x.id === +idSubject);
          if (sb) {
            sb.isTeacherSaved = false;
            sb.idTeacher = '';
            return true;
          }
        });
      }
    });
  }
}
