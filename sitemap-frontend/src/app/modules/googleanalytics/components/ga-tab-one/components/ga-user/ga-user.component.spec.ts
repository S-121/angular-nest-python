import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaUserComponent } from './ga-user.component';

describe('GaUserComponent', () => {
  let component: GaUserComponent;
  let fixture: ComponentFixture<GaUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
