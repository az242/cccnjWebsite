import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEventModalComponent } from './delete-event-modal.component';

describe('DeleteEventModalComponent', () => {
  let component: DeleteEventModalComponent;
  let fixture: ComponentFixture<DeleteEventModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteEventModalComponent]
    });
    fixture = TestBed.createComponent(DeleteEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
