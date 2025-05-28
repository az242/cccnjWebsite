import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveFamilyModalComponent } from './leave-family-modal.component';

describe('LeaveFamilyModalComponent', () => {
  let component: LeaveFamilyModalComponent;
  let fixture: ComponentFixture<LeaveFamilyModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [LeaveFamilyModalComponent]
});
    fixture = TestBed.createComponent(LeaveFamilyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
