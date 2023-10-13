import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, setDoc, collection, getDocs, getDoc, limit, query ,where, doc, documentId, updateDoc, arrayUnion, writeBatch, arrayRemove, deleteDoc, FieldPath, Query} from '@angular/fire/firestore';
import { User, userConverter } from '../common/user.model';
import { Family, familyConverter } from '../common/family.model';
import { Event, eventConverter } from '../common/event.model';
import { AuthService } from './auth.service';
// import { where } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class DbService {
  firestore: Firestore = inject(Firestore);
  userCollection = collection(this.firestore, 'users').withConverter(userConverter);
  familyCollection = collection(this.firestore, 'families').withConverter(familyConverter);
  eventCollection = collection(this.firestore, 'events').withConverter(eventConverter);
  constructor(private auth: AuthService) { }

  async getUser(userId: string): Promise<User> {
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
  async getAllUsers(): Promise<User[]> {
    let users = [];
    const querySnapshot = await getDocs(this.userCollection);
    querySnapshot.forEach((doc) => {
      let user = {uid: doc.id, ... doc.data()}
      users.push(user);
    });
    return users;
  }
  async createUser(userId: string, user) {
    let docRef = doc(this.userCollection, userId);
    let result = await setDoc(docRef, user);
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
  async getUsers(userIds: string[]): Promise<User[]> {
    const q = query(this.userCollection, where(documentId(), "in", userIds));
    
    const productsDocsSnap = await getDocs(q);
    let users = [];
    productsDocsSnap.forEach((doc) => {
      let user = {uid: doc.id, ... doc.data()};
      users.push(user);
    });
    return users;
  }
  async getFamilyMembers(familyId): Promise<User[]> {
    const docRef = doc(this.familyCollection, familyId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let familyData = docSnap.data();
      return await this.getUsers(familyData.members);
    } else {
      return [];
    }
  }
  async createFamily(family: Family) {
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
  async createEvent(event: Event) {
    const result = await addDoc(this.eventCollection, event);
    return result.id;
  }
  async getEventById(eventId) {
    const docRef = doc(this.eventCollection, eventId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let eventData = docSnap.data();
      return eventData;
    } else {
      return undefined;
    }
  }
  async getEventsByStartDate(startDate: Date, numLimit: number) {
    const q1 = query(this.eventCollection, where('startDate', ">=", startDate), where('recurrence', '==', null));
    const q2 = query(this.eventCollection, where(new FieldPath('recurrence','endDate'), '>=', startDate));
    const nonrecurringsDocsSnap = await getDocs(q1);
    const recurringDocsSnap = await getDocs(q2);
    let events:Event[] = [];
    nonrecurringsDocsSnap.forEach((doc) => {
      events.push(doc.data());
    });
    recurringDocsSnap.forEach(element => {
      let now = new Date();
      let event = element.data();
      if(event.recurrence && event.startDate.getTime() < now.getTime()) {
        let startDate: Date = event.startDate;
        while(startDate.getTime()<now.getTime()) {
          startDate.setDate(startDate.getDate() + event.recurrence.interval);
        }
        if(startDate.getTime() <= event.recurrence.endDate.getTime()) {
          events.push(event);
        }
      } else {
        events.push(event);
      }
      
    });
    if(this.auth.isLoggedIn()) {
      let roles = this.auth.getUserRoles();
      events = events.filter((event)=>{
        if(event.visibility.length > 0) {
          return event.visibility.some(visiblityTag => roles.includes(visiblityTag));
        } else {
          return true;
        }
      });
    }
    events.sort((e1,e2) => {return e1.startDate.getTime() - e2.startDate.getTime()});
    if(events.length > numLimit) {
      return events.slice(0,numLimit-1);
    } else {
      return events;
    }
  }
  async getEventsByDateRange(startDate: Date, endDate: Date, numLimit?: number) {
    let q1:Query<Event>;
    let q2:Query<Event>;
    
    if(numLimit) {
      q1 = query(this.eventCollection, where('startDate', ">=", startDate), where('startDate', "<=", endDate), where('recurrence', '==', null), limit(numLimit));
      q2 = query(this.eventCollection, where(new FieldPath('recurrence','endDate'), '>=', startDate), limit(numLimit));
    } else {
      q1 = query(this.eventCollection, where('startDate', ">=", startDate), where('startDate', "<=", endDate), where('recurrence', '==', null));
      q2 = query(this.eventCollection, where(new FieldPath('recurrence','endDate'), '>=', startDate));
    }
    const nonrecurringsDocsSnap = await getDocs(q1);
    const recurringDocsSnap = await getDocs(q2);
    let events:Event[] = [];
    nonrecurringsDocsSnap.forEach((doc) => {
      events.push(doc.data());
    });
    recurringDocsSnap.forEach(element => {
      let now = new Date();
      let event = element.data();
      if(event.recurrence && event.startDate.getTime() < now.getTime()) {
        let startDate: Date = event.startDate;
        while(startDate.getTime()<now.getTime()) {
          startDate.setDate(startDate.getDate() + event.recurrence.interval);
        }
        if(startDate.getTime() <= event.recurrence.endDate.getTime()) {
          events.push(event);
        }
      } else {
        events.push(event);
      }
    });
    if(this.auth.isLoggedIn()) {
      let roles = this.auth.getUserRoles();
      events = events.filter((event)=>{
        if(event.visibility.length > 0) {
          return event.visibility.some(visiblityTag => roles.includes(visiblityTag));
        } else {
          return true;
        }
      });
    }
    events.sort((e1,e2) => {return e1.startDate.getTime() - e2.startDate.getTime()});
    if(numLimit && events.length > numLimit) {
      return events.slice(0,numLimit-1);
    } else {
      return events;
    }
  }
}
