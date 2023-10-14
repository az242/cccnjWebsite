import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileTwoComponent } from './tile-two.component';

describe('TileTwoComponent', () => {
  let component: TileTwoComponent;
  let fixture: ComponentFixture<TileTwoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TileTwoComponent]
    });
    fixture = TestBed.createComponent(TileTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
