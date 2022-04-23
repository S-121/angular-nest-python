import { Component, OnInit } from '@angular/core';
import { OnPageService } from '../services/onPage.service';
import { CanComponentDeactivate } from '../services';
import { Observable, of, Subject } from 'rxjs';

@Component({
  selector: 'app-onPage-container',
  templateUrl: './onPage-container.component.html',
  styleUrls: ['./onPage-container.component.scss'],
})
export class OnPageContainerComponent
  implements OnInit, CanComponentDeactivate {
  error: string;
  isLoading = false;
  success = false;
  items: Map<string, any> = new Map();
  confirmLeaving: boolean;
  subject: Subject<boolean> = new Subject();
  constructor(private readonly __onPageService: OnPageService) {}

  canDeactivate(): Observable<boolean> | boolean {
    if (this.items.size) {
      this.confirmLeaving = true;
      return this.subject;
    }
    return true;
  }

  ngOnInit(): void {
    console.log(this.items.size);
  }

  onUpdateItem(item) {
    this.items.set(item.url, item);
  }

  async saveItems() {
    try {
      this.isLoading = true;
      await this.__onPageService.updateRows(Array.from(this.items.values()));
      this.items.clear();
      this.subject.next(true);
      this.error = null;
      this.success = true;
      setTimeout(() => (this.success = false), 2000);
    } catch ({ error }) {
      this.success = false;
      this.error = error.message || 'Server Error';
    } finally {
      this.isLoading = false;
    }
  }
}
