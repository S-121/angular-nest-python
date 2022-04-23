import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordResearchContainerComponent } from './keyword-research-container.component';

describe('KeywordResearchContainerComponent', () => {
  let component: KeywordResearchContainerComponent;
  let fixture: ComponentFixture<KeywordResearchContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeywordResearchContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordResearchContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
