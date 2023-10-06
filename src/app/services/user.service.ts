import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Firestore, addDoc, collection, getDocs, limit, query ,where} from '@angular/fire/firestore';
// import { where } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  firestore: Firestore = inject(Firestore);
  userCollection = collection(this.firestore, 'users');

  constructor(private http: HttpClient) { }
  test() {
    return this.http.get<any>(`${environment.serviceEndpoints.cccnj}/testpath`);
  }
  async getUser(userId) {
    // db.collection('users').where('uid', '==', userId).limit(1);
    const q = query(this.userCollection, where("uid", "==", userId), limit(1));
    let temp;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      temp = doc.data();
    });
    return temp;
  }
  async createUser(user) {
    const docRef = await addDoc(this.userCollection, user);
    return docRef.id;
  }
}
