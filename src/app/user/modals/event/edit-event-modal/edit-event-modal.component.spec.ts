import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventModalComponent } from './edit-event-modal.component';

describe('EditEventModalComponent', () => {
  let component: EditEventModalComponent;
  let fixture: ComponentFixture<EditEventModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditEventModalComponent]
    });
    fixture = TestBed.createComponent(EditEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
