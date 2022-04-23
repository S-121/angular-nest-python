import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterWqaContainerComponent } from './master-wqa-container.component';

describe('MasterWqaContainerComponent', () => {
  let component: MasterWqaContainerComponent;
  let fixture: ComponentFixture<MasterWqaContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterWqaContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterWqaContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
