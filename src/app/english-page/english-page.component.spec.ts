import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishPageComponent } from './english-page.component';

describe('EnglishPageComponent', () => {
  let component: EnglishPageComponent;
  let fixture: ComponentFixture<EnglishPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnglishPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
