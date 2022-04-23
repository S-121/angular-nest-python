import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
})
export class DateRangeComponent implements OnInit {
  start: null;
  filter: any;
  constructor() {}

  ngOnInit(): void {}

  ngModelChange() {
    const { start, end } = this.filter;
    if (start && end) {
      this.filter.value = `${start} - ${end}`;
    }
  }
  open() {
    const elem = document.querySelector('.datepicker');
    elem && elem.removeEventListener('click', this.stopPropagation);
    elem && elem.addEventListener('click', this.stopPropagation);
  }

  stopPropagation(event) {
    event.stopPropagation();
  }
}
