import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { UsersService } from '../../users/services';
import { Router } from '@angular/router';
import { ProjectsService } from '../../projects/services';


@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss'],
})
export class MainContainerComponent implements OnInit {
  project: any;
  user: any;
  projects: any;
  stringify = JSON.stringify;
  constructor(
    private readonly __appService: AppService,
    private readonly __usersService: UsersService,
    private readonly __router: Router,
    private readonly __projectsService: ProjectsService,
  ) {}
  projectName = localStorage.getItem('projectName');

  async ngOnInit(): Promise<void> {
    try {
      this.user = this.__appService.getUserFromLocalStorage();
      this.user.id = this.user.id || this.user._id;
      this.user = Object.assign(
        this.user,
        await this.__usersService.getUserById(this.user.id)
      );
      localStorage.setItem('user', JSON.stringify(this.user));
      this.__appService.changeProjct.subscribe(() => {
        this.projectName = localStorage.getItem('projectName');
        this.project = this.__appService.getProjectFromLocalStorage();
      });
      this.projects = await this.__projectsService.getProjects();
      console.log("==============");

      console.log(this.projects)

    } catch (err) {
      localStorage.clear();
      this.__router.navigate(['/']);
    }
  }

  selectProject(project) {
    let project_parse = JSON.parse(project);
    console.log(project_parse);
    localStorage.setItem('project', project);
    localStorage.setItem('viewId', project_parse.viewId);
    localStorage.setItem('projectId', project_parse._id);
    localStorage.setItem('projectName', project_parse.name);
    this.__appService.changeProjct.emit(true);
    if (window.location.pathname === '/main/overview') {
      window.location.reload();
    } else {
      this.__router.navigate(['/main/overview']);
    }
  }
  
}
