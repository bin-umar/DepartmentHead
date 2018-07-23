import { Faculty } from './common';
import {ICoefficient} from './settings';

export interface LoadKaf {
  id: number;
  newId: string;
  subjectName: string;
  idExSubject: number;
  exam: string;
  term: number;
  course: number;
  group: string;
  subgroup: number;
  subgroup2: number;
  degree: string;
  type: number;
  studentsAmount: number;
  idSection: number;
  section: string;
  hour: number;
  idGroup: number;
  fcId: number;
  fcName: string;
}

export interface ILoadKaf {
  error: boolean;
  data: [LoadKaf];
}

interface IType {
  plan: number;
  total: number;
}

export interface ILoadKafSubject {
  id: string;
  subjectName: string;
  term: number;
  course: number;
  groups: string[];
  groupsAmount: number;
  subgroups: number;
  degree: string;
  type: number;
  studentsAmount: number;
  courseProject: number;
  courseWork: number;
  workKont: number;
  lecture: IType;
  laboratory: IType;
  practical: IType;
  seminar: IType;
  totalAuditHour: number;
  exam: number;
  advice: number;
  practices: number;
  gosExam: number;
  diploma: number;
  total: number;
  fcId: number;
  fcName: string;
}

export class LoadKafReport {

  private subjects: ILoadKafSubject[] = [];
  private arrNewIds = new Set<string>();

  constructor(private load: LoadKaf[],
              private coefs: ICoefficient) {
    load.forEach((item, id, array) => {

      if (+item.idGroup > 0) {
        const mainSubject = array.find(o => +o.id === +item.idGroup);

        array.filter(o => o.newId === item.newId && +o.id !== item.id)
             .forEach(o => {
               o.newId = mainSubject.newId;
               this.arrNewIds.add(mainSubject.newId);
             });

      } else {
        this.arrNewIds.add(item.newId);
      }

    });

    this.combineSubjects();
  }

  private combineSubjects() {
    this.arrNewIds.forEach(id => {

      const subject: ILoadKafSubject = {
        id: null,
        subjectName: null,
        term: null,
        course: null,
        groups: null,
        groupsAmount: null,
        subgroups: null,
        degree: null,
        type: null,
        studentsAmount: null,
        courseProject: null,
        courseWork: null,
        workKont: null,
        lecture: {plan: null, total: null},
        laboratory: {plan: null, total: null},
        practical: {plan: null, total: null},
        seminar: {plan: null, total: null},
        totalAuditHour: null,
        exam: null,
        advice: null,
        practices: null,
        gosExam: null,
        diploma: null,
        total: null,
        fcId: null,
        fcName: null
      };

      this.load.filter(o => o.newId === id)
        .forEach((o, index, array) => {

          if (index === 0) {
            const groupInfo = this.findGroups(array);

            subject.groups = groupInfo.groups;
            subject.subgroups = groupInfo.subgroups;
            subject.groupsAmount = groupInfo.groupsAmount;
            subject.studentsAmount = groupInfo.studentsAmount;
            subject.subjectName = o.subjectName;
            subject.id = o.newId;
            subject.degree = o.degree;
            subject.type = o.type;
            subject.fcId = o.fcId;
            subject.fcName = o.fcName;
            subject.course = o.course;
            subject.term = +o.term - (+o.course - 1) * 2;

            if (o.exam !== '') {
              if (+o.type === 1) {
                if (subject.degree === 'бакалавр') {
                  subject.exam = this.coefs.exam.bachelor * subject.groupsAmount;
                } else if (subject.degree === 'магистр') {
                  subject.exam = this.coefs.exam.masters * subject.groupsAmount;
                }

              } else if (+o.type === 2 || +o.type === 25) {
                subject.exam = this.coefs.exam.distance * subject.groupsAmount;
              }
            }
          }

          if (o.newId === (o.idExSubject + o.group)) {
            switch (+o.idSection) {
              case 1: subject.courseWork = this.coefs.courseWork * subject.studentsAmount; break;
              case 2: subject.courseProject = this.coefs.courseProject * subject.studentsAmount; break;
              case 3: subject.workKont = this.coefs.controlWork * subject.studentsAmount; break;
              case 4: {
                subject.lecture.plan = o.hour;
                subject.lecture.total = o.hour;
              } break;
              case 5: {
                subject.laboratory.plan = o.hour;
                subject.laboratory.total = +o.hour * subject.subgroups;
              } break;
              case 6: {
                subject.practical.plan = o.hour;
                subject.practical.total = +o.hour * subject.groupsAmount;
              } break;
              case 7: {
                subject.seminar.plan = o.hour;
                subject.seminar.total = +o.hour * subject.groupsAmount;
              } break;
              case 9: subject.practices = o.hour; break;
              case 10: subject.practices = o.hour; break;
              case 11: subject.practices = o.hour; break;
              case 12: subject.advice = o.hour; break;
            }
          }
        });

      subject.totalAuditHour = this.countAuditTotal(subject);
      subject.total = this.countTotal(subject);
      this.subjects.push(subject);
    });
  }

  private countAuditTotal(subject: ILoadKafSubject): number {
    return +subject.lecture.total + +subject.laboratory.total + +subject.practical.total
          + +subject.seminar.total + +subject.exam + +subject.courseProject + +subject.courseWork
          + +subject.workKont;
  }

  private countTotal(subject: ILoadKafSubject): number {
    return subject.totalAuditHour + +subject.gosExam + +subject.diploma + +subject.practices;
  }

  private findGroups(subjects: LoadKaf[]) {

    const groups: string[] = [];
    let subgroups = 0;
    let studentsAmount = 0;

    subjects.forEach(subject => {
      if (groups.indexOf(subject.group) === -1) {
        groups.push(subject.group);
        subgroups += +subject.subgroup;
        studentsAmount += +subject.studentsAmount;
      }
    });

    return {
      groups: groups,
      subgroups: subgroups,
      groupsAmount: groups.length,
      studentsAmount: studentsAmount
    };
  }

  public getSubjects() {
    return this.subjects;
  }
}
