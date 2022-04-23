import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPerformingPagesComponent } from './top-performing-pages.component';

describe('TopPerformingPagesComponent', () => {
  let component: TopPerformingPagesComponent;
  let fixture: ComponentFixture<TopPerformingPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopPerformingPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopPerformingPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
