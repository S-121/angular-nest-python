import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-left-side',
  templateUrl: './left-side.component.html',
  styleUrls: ['./left-side.component.scss'],
})
export class LeftSideComponent implements OnInit {
  filters = [
    {
      title: 'Date Range',
      name: 'dateRange',
      type: 'dateRange',
      id: 1,
      icon: 'calendar',
    },
    {
      icon: 'devices',
      title: 'Device',
      type: 'radio',
      name: 'device',
      id: 2,
      options: [
        {
          value: 'mobile',
          text: 'Mobile',
        },
        {
          value: 'desktop',
          text: 'Desktop',
        },
      ],
    },
    {
      icon: 'map-marker',
      title: 'Country',
      type: 'radio',
      name: 'country',
      id: 3,
      options: [
        {
          value: 'USA',
          text: 'USA',
        },
        {
          value: 'CAN',
          text: 'Canada',
        },
      ],
    },
    // {
    //   icon: 'display',
    //   title: 'Browser',
    //   type: 'radio',
    //   name: 'browser',
    //   id: 4,
    //   options: [
    //     {
    //       value: 'Chrome',
    //       text: 'Chrome',
    //     },
    //     {
    //       value: 'Firefox',
    //       text: 'FireFox',
    //     },
    //     {
    //       value: 'Safari',
    //       text: 'Safari',
    //     },
    //   ],
    // },
  ];
  widgets = [
    {
      icon: 'dollar',
      name: 'revenue',
      title: 'Revenue',
      type: 'revenue',
      id: 1,
      cols: 8,
      rows: 4,
    },
    {
      icon: 'line-chart',
      name: 'keyword',
      title: 'Keyword Chart',
      type: 'keyword',
      id: 2,
      cols: 8,
      rows: 4,
    },
    {
      icon: 'align-top',
      name: 'top-performing',
      title: 'Top Performing',
      type: 'top-performing',
      id: 3,
      cols: 8,
      rows: 4,
      resizeEnabled: false,
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
