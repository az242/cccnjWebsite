import { Injectable, inject } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadBytes, uploadBytesResumable } from '@angular/fire/storage';
@Injectable({
  providedIn: 'root'
})
export class CloudService {
  private storage: Storage = inject(Storage);
  constructor() { }
  uploadFile(input: HTMLInputElement) {
    if (!input.files) return

    const files: FileList = input.files;

    for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
            const storageRef = ref(this.storage, file.name);
            uploadBytesResumable(storageRef, file);
        }
    }
  }
  async uploadPhotoPic(location:string, id: string, selectedFile: File) {
    let extension = selectedFile.name.split('.').pop(); 
    const fileRef = ref(this.storage,`${location}/${id}/photo.${extension}`);
    let result = await uploadBytes(fileRef, selectedFile)
    let downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  }
}
