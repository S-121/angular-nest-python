import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-auth-container',
  templateUrl: './auth-container.component.html',
  styleUrls: ['./auth-container.component.scss'],
})
export class AuthContainerComponent implements OnInit {
  constructor(
    private readonly __router: Router,
    private readonly appService: AppService
  ) {
    const user = this.appService.getUserFromLocalStorage();
    const project = this.appService.getProjectFromLocalStorage();
    if (user && project) {
      this.__router.navigate(['/main/overview']);
    } else if (user) {
      this.__router.navigate(['/main/projects']);
    }
  }

  ngOnInit(): void {}
}
