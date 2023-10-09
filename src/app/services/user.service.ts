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
  familyCollection = collection(this.firestore, 'families');
  constructor() { }

  async getUser(userId: string) {
    const docRef = doc(this.userCollection, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return undefined;
    }
  }
  async getAllUsers() {
    let users = [];
    const querySnapshot = await getDocs(this.userCollection);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      let user = {uid: doc.id, ... doc.data()}
      users.push(user);
    });
    return users;
  }
  async createUser(userId: string, user) {
    let result = await setDoc(doc(this.userCollection, userId), user);
    // const docRef = await addDoc(this.userCollection, user);
    return result;
  }
  async getUsers(userIds: string[]) {
    const q = query(this.userCollection, where(documentId(), "in", userIds));
    
    const productsDocsSnap = await getDocs(q);
    let users = [];
    productsDocsSnap.forEach((doc) => {
      users.push(doc.data());
    });
    return users;
  }
  async getFamilyMembers(familyId) {
    const docRef = doc(this.familyCollection, familyId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let familyData = docSnap.data()
      return await this.getUsers(familyData.members);
    } else {
      return [];
    }
  }
  async createFamily(userId: string) {

  }
}
