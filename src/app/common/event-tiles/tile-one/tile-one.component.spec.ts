import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileOneComponent } from './tile-one.component';

describe('TileOneComponent', () => {
  let component: TileOneComponent;
  let fixture: ComponentFixture<TileOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TileOneComponent]
    });
    fixture = TestBed.createComponent(TileOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
