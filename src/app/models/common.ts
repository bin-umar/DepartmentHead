/**
 * Authorization interfaces
 */
export interface UserInfo {
  userId: number;
  type: string;
  time: string;
}

export interface IAuth {
  error: boolean;
  data: {
    token?: string
    hash?: string
  };
}

export interface CheckResponse {
  error: boolean;
  data: {
    last_action: string;
  };
}

/**
 * Common http responses
 */

export interface ResponseAdd {
  error: boolean;
  data: {
    id: number
  };
}

export interface UpdateResponse {
  error: boolean;
}

/**
 * Speciality interfaces
 */

export interface ISpec {
  error: boolean;
  data: [ISpec];
}

export interface ISpec {
  fID: number;
  fSpec_NameRus: string;
  fSpec_NameTaj: string;
  fSpec_Shifr: string;
}

export class Spec {
  constructor(
    public fID: number,
    public fSpec_NameRus: string,
    public fSpec_NameTaj: string,
    public fSpec_Shifr: string
  ) { }
}

/**
 * Group interfaces
 */

export interface IGroup {
  id: number;
  idSpec: number;
  number: number;
  name: string;
  degree: string;
  type: string;
  course: number;
  subgroup: number;
  subgroup2: number;
  studentsAmount: number;
  educationYear: string;
  extraction: number;
  load: number;
}

export interface Faculty {
  id: number;
  fullName: string;
  shortName: string;
}

export interface IFaculty {
  error: boolean;
  data: [Faculty];
}

export interface Kafedra {
  id: number;
  shortName: string;
  fullName: string;
}

export interface KafedraRes {
  error: boolean;
  data: [Kafedra];
}

export interface GroupResponse {
  error: boolean;
  data: [IGroup];
}

/**
 * Subjects interfaces
 */

export interface ISubject {
  id: number;
  number: number;
  name_tj: string;
  name_ru: string;
  shortname_tj: string;
  shortname_ru: string;
  removable: number;
}

export interface SubjectResponse {
  error: boolean;
  data: [ISubject];
}
