import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  Type,
  ViewChild,
  ViewContainerRef } from '@angular/core';
import { LoadComponent } from './load/load.component';
import { AuthService } from './services/auth.service';
import { UserInfo } from './models/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  entryComponents: [
    LoadComponent
  ]
})

export class AppComponent implements OnDestroy {
  @ViewChild('content', {read: ViewContainerRef})
  parent: ViewContainerRef;
  type: Type<LoadComponent>;
  cmpRef: ComponentRef<LoadComponent>;

  loadComponent = LoadComponent;

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
          this.auth.getUserKafedra(user.userId).subscribe(resp => {
            console.log(resp);
          });
          this.createComponentDynamically(this.loadComponent);
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
    this.cmpRef = this.parent.createComponent(childComponent);
  }
}
