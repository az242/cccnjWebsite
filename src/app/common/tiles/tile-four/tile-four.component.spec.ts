import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileFourComponent } from './tile-four.component';

describe('TileFourComponent', () => {
  let component: TileFourComponent;
  let fixture: ComponentFixture<TileFourComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TileFourComponent]
    });
    fixture = TestBed.createComponent(TileFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
