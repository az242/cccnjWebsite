import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaiwanesePageComponent } from './taiwanese-page.component';

describe('TaiwanesePageComponent', () => {
  let component: TaiwanesePageComponent;
  let fixture: ComponentFixture<TaiwanesePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaiwanesePageComponent]
    });
    fixture = TestBed.createComponent(TaiwanesePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
