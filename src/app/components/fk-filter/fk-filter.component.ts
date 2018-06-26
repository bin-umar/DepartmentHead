import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoadService } from '../../services/load.service';
import { Faculty, Kafedra } from '../../models/common';

@Component({
  selector: 'app-fk-filter',
  templateUrl: './fk-filter.component.html',
  styleUrls: ['./fk-filter.component.css'],
  providers: [ LoadService ]
})
export class FkFilterComponent implements OnInit {

  @Output() OnChooseKafedra = new EventEmitter<{kf: Kafedra, fc: Faculty}>();
  faculties: Faculty[] = [];
  selectedKf: number;
  selectedFc: number;
  kafedras: Kafedra[] = [];

  constructor(private loadService: LoadService) {
  }

  ngOnInit() {
    this.loadService.getFacultyList().subscribe(resp => {
      if (!resp.error) {
        this.faculties = resp.data.slice();
      }
    });
  }

  findKafedra() {
    this.loadService.getKafedraByFacultyId(this.selectedFc).subscribe(resp => {
      if (!resp.error) {
        this.kafedras = resp.data.slice();
      }
    });
  }

  getContentByKfId() {
    const fc = this.faculties.find(x => x.id === this.selectedFc);
    const kf = this.kafedras.find(x => x.id === this.selectedKf);

    this.OnChooseKafedra.emit({kf: kf, fc: fc});
  }

}
