import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public projectsChaged: EventEmitter<boolean> = new EventEmitter<boolean>();
  public keywordChanged: EventEmitter<string> = new EventEmitter<string>();

  public changeProjct: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() {}

  getProjectFromLocalStorage() {
    try {
      const project = localStorage.getItem('project');
      if (project) {
        return JSON.parse(project);
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  getUserFromLocalStorage() {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        return JSON.parse(user);
      }
      return null;
    } catch (err) {
      return null;
    }
  }
}
