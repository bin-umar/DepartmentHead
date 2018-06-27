import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  Type,
  ViewChild,
  ViewContainerRef } from '@angular/core';
import { AuthService } from './services/auth.service';
import { DepartmentInfo, UserInfo } from './models/common';

import { TeacherLoadComponent } from './components/teacher-load/teacher-load.component';
import { LoadComponent } from './components/load/load.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  entryComponents: [
    LoadComponent,
    TeacherLoadComponent
  ]
})

export class AppComponent implements OnDestroy {
  @ViewChild('content', {read: ViewContainerRef})
  parent: ViewContainerRef;
  type: Type<LoadComponent>;
  cmpRef: ComponentRef<LoadComponent>;
  depInfo: DepartmentInfo;

  component = '';
  loadComponent = LoadComponent;
  teacherComponent = TeacherLoadComponent;

  constructor (private componentFactoryResolver: ComponentFactoryResolver,
               private auth: AuthService) {

    const href = window.location.href;
    if (href.indexOf('hash') !== -1) {
      const hash = href.split('hash=')[1];
      const data = atob(hash).split('$');

      console.log(href);

      const user: UserInfo = {
        userId: +data[0],
        type: data[1],
        time: data[2]
      };

      this.auth.checkUserSession(user).subscribe(response => {
        if (!response) {
          window.location.replace('./error.html');
        } else {
          this.auth.getUserKafedra().subscribe(resp => {
            if (!resp.error) {
              this.depInfo = resp.data;
              this.createComponentDynamically(this.loadComponent);
            }
          });
        }
      });
    } else {
      window.location.replace('./error.html');
    }

    // this.auth.getToken('jaxa', 'jaxa97').subscribe(result => {
    //   if (result) {
    //   } else {
    //     console.log('Username or password is incorrect');
    //   }
    // });
  }

  ngOnDestroy() {
    this.auth.logout();
  }

  createComponentDynamically(cmp) {
    if (this.cmpRef) { this.cmpRef.destroy(); }
    this.type = cmp;

    const childComponent = this.componentFactoryResolver.resolveComponentFactory(this.type);
    const CmpRef = this.parent.createComponent(childComponent);
    CmpRef.instance.depInfo = this.depInfo;
    this.component = CmpRef.instance.cmpName;

    this.cmpRef = CmpRef;
  }
}
