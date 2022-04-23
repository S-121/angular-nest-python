import { Component, OnInit } from '@angular/core';

interface FilterItem {
  options: any[];
  value: string;
}
@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
})
export class RadioComponent implements OnInit {
  filter: FilterItem;
  constructor() {}

  ngOnInit(): void {}
}
