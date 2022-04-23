import { Component } from '@angular/core';
import {
  Event,
  Router,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  ActivationStart,
  ActivationEnd,
} from '@angular/router';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Sitemap';
  @BlockUI() blockUI: NgBlockUI;

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof ActivationStart: {
          this.blockUI.start('Loading...');
          break;
        }

        case event instanceof ActivationEnd:
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          setTimeout(() => {
            this.blockUI.stop();
          }, 500);
          break;
        }
        default: {
          break;
        }
      }
    });
  }
}
