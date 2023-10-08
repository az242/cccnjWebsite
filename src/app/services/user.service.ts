import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Firestore, addDoc, setDoc, collection, getDocs, getDoc, limit, query ,where, doc, documentId} from '@angular/fire/firestore';
import { User } from '../common/user.model';
// import { where } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class DbService {
  firestore: Firestore = inject(Firestore);
  userCollection = collection(this.firestore, 'users');

  constructor(private http: HttpClient) { }
  // test() {
  //   return this.http.get<any>(`${environment.serviceEndpoints.cccnj}/testpath`);
  // }
  async getUser(userId: string) {
    // db.collection('users').where('uid', '==', userId).limit(1);
    // const q = query(this.userCollection, where("uid", "==", userId), limit(1));
    // let temp;
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   temp = doc.data();
    // });
    // return temp;

    const docRef = doc(this.userCollection, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return undefined;
    }
  }
  async createUser(userId: string, user) {
    let result = await setDoc(doc(this.userCollection, userId), user);
    // const docRef = await addDoc(this.userCollection, user);
    return result;
  }
  async getUsers(userIds: string[]) {
    const q = query(this.userCollection, where(documentId(), "in", userIds));
    
    const productsDocsSnap = await getDocs(q);
    let users: User[] = [];
    productsDocsSnap.forEach((doc) => {
      users.push(doc.data() as User);
    });
    return users;
  }
  async createFamily(userId: string) {

  }
}
