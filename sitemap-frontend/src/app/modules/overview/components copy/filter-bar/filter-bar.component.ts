import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { DashboardService, UrlHelper } from '../../services';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
})
export class FilterBarComponent implements OnInit {
  keys = Object.keys;
  constructor(
    private dragulaService: DragulaService,
    public readonly __dashboardService: DashboardService
  ) {
    let filters = this.dragulaService.find('filters');
    if (filters) {
      const { drake } = filters;
      drake.on('drag', (el) => {
        this.toggleShadow();
      });
      drake.on('dragend', (el) => {
        this.toggleShadow();
      });
      drake.on('over', (el, container, source) => {
        this.toggleHidden(el, container);
      });
      drake.on('out', (el, container, source) => {
        this.toggleHidden(el, container);
      });
    }
  }

  ngOnInit(): void {}

  apply() {
    this.__dashboardService.query = UrlHelper.buildQuery(
      this.__dashboardService.filters
    );
    this.__dashboardService.queryChanged.emit(true);
  }

  toggleShadow() {
    ['filterBar1', 'filterBar2'].forEach((id) => {
      document.getElementById(id).classList.toggle('shadow');
    });
  }
  toggleHidden(el, container) {
    const { id } = container;
    if (id === 'filterBar1' || id === 'filterBar2') {
      el.classList.toggle('hidden');
      document.getElementById(id).classList.toggle('focus');
    }
  }

  removeFilter(arr, filter) {
    arr.splice(
      arr.findIndex((item) => item.id === filter.id),
      1
    );
    this.apply();
  }
}
