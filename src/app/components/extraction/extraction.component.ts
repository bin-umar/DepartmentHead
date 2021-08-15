import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { CurriculumList, ExtractionSubject, PrintInfo } from '../../models/curriculum';
import { AuthService } from '../../services/auth.service';
import { ExtractionService } from '../../services/extraction.service';

const separateIfMoreThanOne = (item, index) => {
  if (item.length > 1) {
    return  item.split(',')[index];
  }
  return item;
};

@Component({
  selector: 'app-extraction',
  templateUrl: './extraction.component.html',
  styleUrls: ['./extraction.component.css'],
  providers: [ ExtractionService ]
})

export class ExtractionComponent implements OnInit {

  @Input() Curriculum: CurriculumList;
  @ViewChild('header') header: ElementRef;

  subjects: ExtractionSubject[] = [];
  types = [];
  degrees = [];

  printInfo: PrintInfo = {
    fFac_NameTaj: '',
    fFac_NameTajShort: '',
    fFac_Dekan: '',
    kf_full_name: '',
    kf_short_name: '',
    kf_chief: '',
    itm_chief: '',
    kfChiefPosition: ''
  };

  constructor(private extractionService: ExtractionService,
              private authService: AuthService) {
    this.types = this.authService.TYPES;
    this.degrees = this.authService.DEGREES;
  }

  ngOnInit() {
    this.extractionService.getPrintInfo(this.Curriculum.idSpec).subscribe(resp => {
      if (!resp.error) {
        this.printInfo = resp.data;
      }
    });

    this.extractionService.getSubjectsByExtractionId(this.Curriculum.id).subscribe(resp => {
      if (!resp.error) {
        resp.data.forEach(item => {

          const i = item.terms.split(',').indexOf(item.term.toString());

          const credits = item.credits.toString().split(',')[i];
          const term = item.terms.toString().split(',')[i];
          const checkout_b = separateIfMoreThanOne(item.checkout_b, i);
          const checkout_diff = separateIfMoreThanOne(item.checkout_diff, i);
          const exam = separateIfMoreThanOne(item.exam, i);
          let kmd = separateIfMoreThanOne(item.exam, i);

          if (exam !== kmd && exam !== '') { kmd = ''; }

          this.subjects.push({
            id: +item.id,
            name: item.name,
            idStSubject: +item.idStSubject,
            credits: +credits,
            terms: item.terms,
            term: +term,
            auditCredits: +item.auditCredits,
            course: +item.course,
            lessonHours: +item.lessonHours,
            kmroCredits: +item.kmroCredits,
            kmroHour: +item.kmroHour,
            exam,
            kmd,
            checkout_b,
            checkout_diff,
            courseProject: +item.courseProject,
            courseWork: +item.courseWork,
            workKont: +item.workKont,
            lkPlan: +item.lkPlan,
            lkTotal: +item.lkTotal,
            lbPlan: +item.lbPlan,
            lbTotal: +item.lbTotal,
            prPlan: +item.prPlan,
            prTotal: +item.prTotal,
            smPlan: +item.smPlan,
            smTotal: +item.smTotal,
            advice: +item.advice,
            trainingPrac: +item.trainingPrac,
            manuPrac: +item.manuPrac,
            diplomPrac: +item.diplomPrac,
            bachelorWork: +item.bachelorWork,
            gosExam: +item.gosExam,
            total: this.total(item),
            kfName: item.kfName,
            selective: +item.selective
          });
        });
      }
    });
  }

  rowAmount(amount: number): number[] {
    return Array.from(Array(amount).keys());
  }

  isBntu() {
    return [1, 9].includes(+this.Curriculum.fcId);
  }

  getSubjectsByTerm(semester: number) {
    return this.subjects.filter(item => +item.term - (item.course - 1) * 2 === semester);
  }

  sum(prop: string, term?: number): number {
    let sum = 0;
    let subjects;

    if (term) {
      subjects = this.getSubjectsByTerm(term);
    } else {
      subjects = this.subjects;
    }

    subjects.forEach(item => {
      switch (prop) {
        case 'credits': sum += item.credits; break;
        case 'auditCredits': sum += item.auditCredits; break;
        case 'lessonHours': sum += item.lessonHours; break;
        case 'kmroCredits': sum += item.kmroCredits; break;
        case 'kmroHour': sum += item.kmroHour; break;
        case 'lkPlan': sum += item.lkPlan; break;
        case 'lkTotal': sum += item.lkTotal; break;
        case 'lbPlan': sum += item.lbPlan; break;
        case 'lbTotal': sum += item.lbTotal; break;
        case 'prPlan': sum += item.prPlan; break;
        case 'prTotal': sum += item.prTotal; break;
        case 'smPlan': sum += item.smPlan; break;
        case 'smTotal': sum += item.smTotal; break;
        case 'advice': sum += item.advice; break;
        case 'trainingPrac': sum += item.trainingPrac; break;
        case 'manuPrac': sum += item.manuPrac; break;
        case 'total': sum += item.total; break;
      }
    });

    return +sum.toFixed(2);
  }

  total(subject: ExtractionSubject): number {
    subject.total = (
        +subject.lkTotal +
        +subject.lkPlan +
        +subject.smTotal +
        +subject.smPlan +
        +subject.lbPlan +
        +subject.lbTotal +
        +subject.prPlan +
        +subject.prTotal +
        +subject.trainingPrac +
        +subject.manuPrac +
        +subject.kmroHour +
        +subject.checkout_b +
        +subject.checkout_diff
    );

    return subject.total;
  }

  print(): void {
    window.print();
  }
}
