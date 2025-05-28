import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEventModalComponent } from './view-event-modal.component';

describe('ViewEventModalComponent', () => {
  let component: ViewEventModalComponent;
  let fixture: ComponentFixture<ViewEventModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ViewEventModalComponent]
});
    fixture = TestBed.createComponent(ViewEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
