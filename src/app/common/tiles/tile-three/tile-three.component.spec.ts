import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileThreeComponent } from './tile-three.component';

describe('TileThreeComponent', () => {
  let component: TileThreeComponent;
  let fixture: ComponentFixture<TileThreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TileThreeComponent]
});
    fixture = TestBed.createComponent(TileThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
