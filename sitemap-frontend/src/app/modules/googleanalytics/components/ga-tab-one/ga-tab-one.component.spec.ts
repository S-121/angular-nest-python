import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaTabOneComponent } from './ga-tab-one.component';

describe('GaTabOneComponent', () => {
  let component: GaTabOneComponent;
  let fixture: ComponentFixture<GaTabOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaTabOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaTabOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
