import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../services';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
})
export class ProjectsListComponent implements OnInit {
  error: string;
  isLoading = false;
  projects: any;
  confirmDelete = false;
  currentProject: any;
  _user: any;

  constructor(
    private readonly __projectsService: ProjectsService,
    private readonly __appService: AppService,
    private readonly __router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading = true;
      this._user = this.__appService.getUserFromLocalStorage();
      this.projects = await this.__projectsService.getProjects();
      this.error = null;
    } catch (err) {
      const { error } = err;
      this.error = (error && error.message) || err;
    } finally {
      this.isLoading = false;
    }
  }

  selectProject(project) {
    localStorage.setItem('project', JSON.stringify(project));
    localStorage.setItem('viewId', project.viewId);
    localStorage.setItem('projectId', project._id);
    localStorage.setItem('projectName', project.name);
    this.__appService.changeProjct.emit(true);
    this.__router.navigate(['/main/overview']);
  }

  async deleteProject({ _id: id }) {
    this.confirmDelete = false;
    await this.__projectsService.deleteProject(id);
    this.projects = await this.__projectsService.getProjects();
    this.__appService.projectsChaged.emit(true);
  }

  openConfirmDialog(evt, project) {
    evt.preventDefault();
    evt.stopPropagation();
    this.currentProject = project;
    this.confirmDelete = true;
  }

  editProject(evt, id) {
    evt.preventDefault();
    evt.stopPropagation();
    this.__router.navigate([`/main/projects/do/${id}`]);
  }
}
