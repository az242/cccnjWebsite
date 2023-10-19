import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandarinPageComponent } from './mandarin-page.component';

describe('MandarinPageComponent', () => {
  let component: MandarinPageComponent;
  let fixture: ComponentFixture<MandarinPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MandarinPageComponent]
    });
    fixture = TestBed.createComponent(MandarinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
