import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSearchAttributesComponent } from './question-search-attributes.component';

describe('QuestionSearchAttributesComponent', () => {
  let component: QuestionSearchAttributesComponent;
  let fixture: ComponentFixture<QuestionSearchAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionSearchAttributesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSearchAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
