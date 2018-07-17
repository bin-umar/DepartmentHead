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

export interface DepartmentInfo {
  kf_id: number;
  faculty: string;
  kafedra: string;
}

export interface IDepartmentInfo {
  error: boolean;
  data: DepartmentInfo;
}

/**
 * Standard
 */

export interface Standard {
  ids: number;
  fSpec_Shifr: string;
  timeOfStudying: number;
  typeOfStudying: string;
  degreeOfStudying: string;
  dateOfAcceptance: Date;
  locked: number;
}

export interface IStandard {
  error: boolean;
  data: [Standard];
}
