import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAttributesComponent } from './search-attributes.component';

describe('SearchAttributesComponent', () => {
  let component: SearchAttributesComponent;
  let fixture: ComponentFixture<SearchAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchAttributesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
