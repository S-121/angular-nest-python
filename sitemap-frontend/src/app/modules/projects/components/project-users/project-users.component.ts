import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ProjectsService } from '../../services';
import { ClrDatagridStateInterface } from '@clr/angular';
import { searchSort, debounce } from 'src/app/shared';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-project-users',
  templateUrl: './project-users.component.html',
  styleUrls: ['./project-users.component.scss'],
})
export class ProjectUsersComponent implements OnInit, AfterViewInit {
  @Input('users') users: FormControl;
  @Input('projectId') projectId: string;

  selected = [];
  dirty = false;
  data: any[];
  error: string;
  isLoading = false;
  refreshFn: Function;
  constructor(private readonly projectService: ProjectsService) {
    this.refreshFn = debounce(this.refresh);
  }

  ngOnInit(): void {
    this.users.setValue(this.users.value || []);
  }

  ngAfterViewInit() {
    this.getData();
  }
  addUser(user: { email: string }) {
    this.users.value.push(user.email);
    this.users.setValue([...new Set(this.users.value)]);
    this.data.splice(
      this.data.findIndex((u) => u.email === user.email),
      1
    );
  }

  async getData(params = undefined) {
    try {
      this.isLoading = true;
      this.data = await this.projectService.searchUser(
        this.projectId,
        params,
        this.users.value
      );
      this.data = this.data.filter(
        (user) => !this.users.value?.includes(user.email)
      );
      this.error = null;
    } catch (err) {
      const { error } = err;
      this.error = (error && error.message) || err;
    } finally {
      this.isLoading = false;
    }
  }

  async refresh(state: ClrDatagridStateInterface) {
    const params = searchSort(state);
    await this.getData(params);
  }
  onDelete() {
    this.users.setValue(
      this.users.value.filter((email) => !this.selected.includes(email))
    );
  }
}
