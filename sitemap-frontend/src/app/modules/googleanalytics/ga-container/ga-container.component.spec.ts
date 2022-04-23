import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaContainerComponent } from './ga-container.component';

describe('GaContainerComponent', () => {
  let component: GaContainerComponent;
  let fixture: ComponentFixture<GaContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
