import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSeoComponent } from './technical-seo.component';

describe('TechnicalSeoComponent', () => {
  let component: TechnicalSeoComponent;
  let fixture: ComponentFixture<TechnicalSeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicalSeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalSeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
