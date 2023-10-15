import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'upload-profile-photo-modal',
  templateUrl: './upload-profile-photo-modal.component.html',
  styleUrls: ['./upload-profile-photo-modal.component.scss']
})
export class UploadProfilePhotoModalComponent {
  @Output() onSubmit = new EventEmitter<File>();
  selectedFile: File | null = null;
  ngOnInit() {
    const myModalEl = document.getElementById('profilePhotoModal')
    myModalEl.addEventListener('hidden.bs.modal', event => {
      this.resetForm();
    })
  }
  resetForm() {
    this.selectedFile = null;
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  upload() {
    console.log(this.selectedFile);
    if(this.selectedFile) {
      this.onSubmit.next(this.selectedFile);
    }
  }
}
