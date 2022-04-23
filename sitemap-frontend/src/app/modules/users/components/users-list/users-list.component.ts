import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  error: string;
  isLoading = false;
  users: any;
  confirmDelete = false;
  currentUser: any;
  _user: any;
  constructor(
    private readonly __usersService: UsersService,
    private readonly __appService: AppService,
    private readonly __router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading = true;
      this._user = this.__appService.getUserFromLocalStorage();
      this.users = await this.__usersService.getUsers();
    } catch (err) {
      const { error } = err;
      this.error = (error && error.message) || err;
    } finally {
      this.isLoading = false;
    }
  }

  async deleteUser({ _id: id }) {
    this.confirmDelete = false;
    await this.__usersService.deleteUser(id);
    this.users = await this.__usersService.getUsers();
  }

  openConfirmDialog(evt, project) {
    evt.preventDefault();
    evt.stopPropagation();
    this.currentUser = project;
    this.confirmDelete = true;
  }

  editUser(evt, id) {
    evt.preventDefault();
    evt.stopPropagation();
    this.__router.navigate([`/main/users/do/${id}`]);
  }
}
