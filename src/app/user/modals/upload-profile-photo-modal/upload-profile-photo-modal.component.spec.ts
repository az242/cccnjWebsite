import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProfilePhotoModalComponent } from './upload-profile-photo-modal.component';

describe('UploadProfilePhotoModalComponent', () => {
  let component: UploadProfilePhotoModalComponent;
  let fixture: ComponentFixture<UploadProfilePhotoModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadProfilePhotoModalComponent]
    });
    fixture = TestBed.createComponent(UploadProfilePhotoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
