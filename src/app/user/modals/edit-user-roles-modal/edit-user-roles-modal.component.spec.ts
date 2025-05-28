import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserRolesModalComponent } from './edit-user-roles-modal.component';

describe('EditUserRolesModalComponent', () => {
  let component: EditUserRolesModalComponent;
  let fixture: ComponentFixture<EditUserRolesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [EditUserRolesModalComponent]
});
    fixture = TestBed.createComponent(EditUserRolesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
