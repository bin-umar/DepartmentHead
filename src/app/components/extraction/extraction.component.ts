import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ExtractionService } from '../../services/extraction.service';
import { CurriculumList, ExtractionSubject, PrintInfo } from '../../models/curriculum';
import { AuthService } from '../../services/auth.service';

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
    itm_chief: ''
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
          let exams, kmds, exam, kmd;

          if (item.exam.length > 1) {
            exams = item.exam.toString().split(',');
          } else if (item.kmd.length > 1) {
            kmds = item.kmd.toString().split(',');
          }

          exam = (exams === undefined ? '' : exams[i] );
          kmd = (kmds === undefined ? '' : kmds[i]);

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
            exam: exam,
            kmd: kmd,
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

  getSubjectsByTerm(semester: number) {
    return this.subjects.filter(item => +item.term - (item.course - 1) * 2 === semester);
  }

  sum(prop, term) {
    let sum = 0;
    let subjects;

    if (term !== 3) {
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
        case 'diplomPrac': sum += item.diplomPrac; break;
        case 'bachelorWork': sum += item.bachelorWork; break;
        case 'gosExam': sum += item.gosExam; break;
        case 'total': sum += item.total; break;
      }
    });

    return +sum.toFixed(2);
  }

  total(subject: ExtractionSubject) {
    const result = +subject.lkTotal + +subject.lkPlan + +subject.smTotal +
      +subject.smPlan + +subject.lbPlan + +subject.lbTotal +
      +subject.prPlan + +subject.prTotal + +subject.trainingPrac +
      +subject.manuPrac + +subject.diplomPrac + +subject.bachelorWork +
      +subject.gosExam + +subject.kmroHour + +subject.advice;

    subject.total = result;
    return result;
  }

  print() {
    window.print();
  }

}
