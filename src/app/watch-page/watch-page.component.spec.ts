import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchPageComponent } from './watch-page.component';

describe('WatchPageComponent', () => {
  let component: WatchPageComponent;
  let fixture: ComponentFixture<WatchPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WatchPageComponent]
    });
    fixture = TestBed.createComponent(WatchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
