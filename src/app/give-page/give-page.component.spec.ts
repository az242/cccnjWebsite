import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GivePageComponent } from './give-page.component';

describe('GivePageComponent', () => {
  let component: GivePageComponent;
  let fixture: ComponentFixture<GivePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GivePageComponent]
    });
    fixture = TestBed.createComponent(GivePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
