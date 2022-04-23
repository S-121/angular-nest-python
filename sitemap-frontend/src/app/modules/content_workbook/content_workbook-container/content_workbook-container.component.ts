import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CanComponentDeactivate, ContentWorkbookService } from '../services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-content_workbook-container',
  templateUrl: './content_workbook-container.component.html',
  styleUrls: ['./content_workbook-container.component.scss'],
})
export class ContentWorkbookContainerComponent
  implements OnInit, CanComponentDeactivate, AfterViewInit {
  error: string;
  isLoading = false;
  success = false;
  confirmLeaving: boolean;
  constructor(
    public readonly __contentWorkbookService: ContentWorkbookService
  ) {}
  ngAfterViewInit(): void {}

  canDeactivate(): Observable<boolean> | boolean {
    if (this.__contentWorkbookService.dirty) {
      this.confirmLeaving = true;
      return this.__contentWorkbookService.subject;
    }
    return true;
  }

  ngOnInit(): void {}

  leave(value) {
    if (value === 0) {
      this.__contentWorkbookService.subject.next(true);
    } else if (value === 1) {
      this.__contentWorkbookService.saveItems.emit(true);
    }
    this.confirmLeaving = false;
  }
}
