import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatableTableComponent } from './updatable-table.component';

describe('UpdatableTableComponent', () => {
  let component: UpdatableTableComponent;
  let fixture: ComponentFixture<UpdatableTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatableTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
