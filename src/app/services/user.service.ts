import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, setDoc, collection, getDocs, getDoc, limit, query ,where, doc, documentId, updateDoc, arrayUnion, writeBatch, arrayRemove, deleteDoc} from '@angular/fire/firestore';
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
      let user = docSnap.data();
      user.uid = userId;
      return user;
    } else {
      return undefined;
    }
  }
  async getAllUsers() {
    let users = [];
    const querySnapshot = await getDocs(this.userCollection);
    querySnapshot.forEach((doc) => {
      let user = {uid: doc.id, ... doc.data()}
      users.push(user);
    });
    return users;
  }
  async createUser(userId: string, user) {
    let result = await setDoc(doc(this.userCollection, userId), user);
    return result;
  }
  async batchUpdateUser(updates: {uid:string, updates:any}[]) {
    const batch = writeBatch(this.firestore);
    for(let update of updates) {
      const updateRef = doc(this.firestore, "users", update.uid);
      batch.update(updateRef, update.updates);
    }
    await batch.commit();
  }
  async updateUser(userId: string, fieldsToUpdate) {
    const userRef = doc(this.firestore, "users", userId);
    let result = await updateDoc(userRef, fieldsToUpdate);
    return result;
  }
  async getUsers(userIds: string[]) {
    const q = query(this.userCollection, where(documentId(), "in", userIds));
    
    const productsDocsSnap = await getDocs(q);
    let users = [];
    productsDocsSnap.forEach((doc) => {
      let user = {uid: doc.id, ... doc.data()};
      users.push(user);
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
  async createFamily(family) {
    // let result = await setDoc(doc(this.familyCollection, familyId), family);
    const result = await addDoc(this.familyCollection, family);
    return result.id;
  }
  async removeFamilyMember(familyId, memberId) {
    const familyRef = doc(this.firestore, "families", familyId);
    let result = await updateDoc(familyRef, {
      members: arrayRemove(memberId)
    });
    return result;
  }
  async deleteFamily(familyId) {
    let result = await deleteDoc(doc(this.firestore, "families", familyId));
    return result;
  }
  async addFamilyMember(familyId, memberId) {
    const familyRef = doc(this.firestore, "families", familyId);
    let result = await updateDoc(familyRef, {
      members: arrayUnion(memberId)
    });
    return result;
  }
}
