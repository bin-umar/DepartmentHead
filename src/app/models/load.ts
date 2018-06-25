export interface Load {
  id: number;
  subjectName: string;
  idExSubject: number;
  term: number;
  course: number;
  group: string;
  degree: string;
  type: string;
  studentsAmount: number;
  section: string;
  hour: number;
  idGroup: number;
  idTeacher: string;
  isTeacherSaved: boolean;
}

export interface ILoad {
  error: boolean;
  data: [Load];
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
