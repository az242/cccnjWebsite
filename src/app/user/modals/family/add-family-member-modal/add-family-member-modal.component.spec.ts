import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFamilyMemberModalComponent } from './add-family-member-modal.component';

describe('AddFamilyMemberModalComponent', () => {
  let component: AddFamilyMemberModalComponent;
  let fixture: ComponentFixture<AddFamilyMemberModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [AddFamilyMemberModalComponent]
});
    fixture = TestBed.createComponent(AddFamilyMemberModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
