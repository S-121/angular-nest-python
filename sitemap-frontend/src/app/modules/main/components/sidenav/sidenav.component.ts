import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ProjectsService } from 'src/app/modules/projects/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  user: any;
  image: string;
  title: string;
  disableLink: boolean;
  project: any;
  projects: any;

  constructor(
    private readonly __appService: AppService,
    private readonly __projectsService: ProjectsService,
    private readonly __router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.__appService.getUserFromLocalStorage();
    this.project = this.__appService.getProjectFromLocalStorage();

    this.__appService.changeProjct.subscribe(() => {
      this.project = this.__appService.getProjectFromLocalStorage();
    });

    this.__appService.projectsChaged.subscribe(async (_) => {
      this.projects = await this.__projectsService.getProjects();
    });
    try {
      this.projects = await this.__projectsService.getProjects();
    } catch (err) {
      const { error } = err;
      if (error && error.statusCode === 401) {
        this.__router.navigate(['/']);
      }
    }
  }

  selectProject(viewId, name, id, p) {
    localStorage.setItem('viewId', viewId);
    localStorage.setItem('projectName', name);
    localStorage.setItem('projectId', id);
    localStorage.setItem('project', JSON.stringify(p));
    this.__appService.changeProjct.emit(true);
  }

  logout() {
    localStorage.clear();
  }
}
