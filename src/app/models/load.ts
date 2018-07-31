export interface Load {
  id: number;
  newId: string;
  subjectName: string;
  idExSubject: number;
  term: number;
  course: number;
  group: string;
  degree: string;
  type: string;
  studentsAmount: number;
  idSection: number;
  section: string;
  hour: number;
  idGroup: number;
  idTeacher: string;
}

export interface ILoad {
  error: boolean;
  data: [Load];
}

interface ISection {
  id: number;
  groups: string[];
  studentsAmount: number;
  section: string;
  hour: number;
  idTeacher: string;
  isTeacherSaved: boolean;
}

export interface IDistribution {
  subjectName: string;
  term: number;
  course: number;
  degree: string;
  type: string;
  sections: ISection[];
}

export class Distribution {

  private realSubjects: IDistribution[] = [];
  private arrNewIds = new Set<string>();

  constructor(private loadSubjects: Load[],
              private teachers: Teacher[]) {

    loadSubjects.forEach((item, id, array) => {
      if (+item.idGroup > 0) {
        const mainSubject = array.find(o => +o.id === +item.idGroup);

        if (mainSubject !== undefined) {
          array.filter(o => o.newId === item.newId && +o.id !== item.id)
            .forEach(o => {
              o.newId = mainSubject.newId;
              this.arrNewIds.add(mainSubject.newId);
            });
        }

      } else {
        this.arrNewIds.add(item.newId);
      }
    });

    this.combineSubjects();
  }

  private combineSubjects() {
    this.arrNewIds.forEach(id => {
      const subject: IDistribution = {
        subjectName: null,
        term: null,
        course: null,
        degree: null,
        type: null,
        sections: []
      };

      this.loadSubjects.filter(o => o.newId === id)
        .forEach((o, index, array) => {

          if (index === 0) {
            subject.degree = o.degree;
            subject.type = o.type;
            subject.course = o.course;
            subject.term = o.term;
            subject.subjectName = o.subjectName;
          }

          const teacher = this.teachers.find(x => +x.Id === +o.idTeacher).Fio;
          switch (+o.idSection) {
            case 4: {
              if (o.newId === (o.idExSubject + o.group)) {
                const groupInfo = this.findGroups(array);

                subject.sections.push({
                  id: o.id,
                  groups: groupInfo.groups,
                  studentsAmount: groupInfo.studentsAmount,
                  section: o.section,
                  hour: o.hour,
                  idTeacher: teacher,
                  isTeacherSaved: !(teacher === '')
                });
              }
            } break;
            default: {
              subject.sections.push({
                id: o.id,
                groups: Array.of(o.group),
                studentsAmount: o.studentsAmount,
                section: o.section,
                hour: o.hour,
                idTeacher: teacher,
                isTeacherSaved: !(teacher === '')
              });
            } break;
          }
        });

      this.realSubjects.push(subject);
    });
  }

  public getSubjects() {
    return this.realSubjects;
  }

  private findGroups(subjects: Load[]) {

    const groups: string[] = [];
    let studentsAmount = 0;

    subjects.forEach(subject => {
      if (groups.indexOf(subject.group) === -1) {
        groups.push(subject.group);
        studentsAmount += +subject.studentsAmount;
      }
    });

    return {
      groups: groups,
      studentsAmount: studentsAmount
    };
  }
}

export interface Teacher {
  Id: number;
  Fio: string;
  Post: string;
  UchStep: string;
  Science_degree: string;
}

export interface ITeacher {
  error: boolean;
  data: [Teacher];
}
