import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatTableModule,
  MatPaginatorModule,
  MatInputModule,
  MatSortModule,
  MatFormFieldModule,
  MatIconModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatAutocompleteModule,
  MatCardModule,
  MatExpansionModule,
  MatButtonModule,
  MatDialogModule,
  MatCheckboxModule,
  MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from './services/auth.service';

import { AppComponent } from './app.component';
import { TeacherNamePipe } from './models/teacher-name.pipe';
import { FkFilterComponent } from './components/fk-filter/fk-filter.component';
import { LoadComponent } from './components/load/load.component';
import { GetNamePipe } from './models/get-name.pipe';
import { TeacherLoadComponent } from './components/teacher-load/teacher-load.component';

@NgModule({
  declarations: [
    AppComponent,
    LoadComponent,
    FkFilterComponent,
    TeacherNamePipe,
    GetNamePipe,
    TeacherLoadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatTableModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
