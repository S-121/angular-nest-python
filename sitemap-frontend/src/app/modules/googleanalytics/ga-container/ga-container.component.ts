import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ga-container',
  templateUrl: './ga-container.component.html',
  styleUrls: ['./ga-container.component.scss'],
})
export class GaContainerComponent implements OnInit {
  project: any;
  constructor(
    private readonly __appService: AppService,
    private readonly __router: Router
  ) {}

  checkIfEnabled() {
    this.project = this.__appService.getProjectFromLocalStorage();
    if (!this.project || !this.project.ga) {
      this.__router.navigate(['/main/projects']);
    }
  }
  ngOnInit(): void {
    this.checkIfEnabled();
    this.__appService.changeProjct.subscribe((_) => {
      this.checkIfEnabled();
    });
  }
}
