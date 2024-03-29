import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, setDoc, collection, getDocs, getDoc, limit, query ,where, doc, documentId, updateDoc, arrayUnion, writeBatch, arrayRemove, deleteDoc, FieldPath, Query, orderBy} from '@angular/fire/firestore';
import { Roles, User, userConverter } from '../common/user.model';
import { Family, familyConverter } from '../common/family.model';
import { Event, eventConverter } from '../common/event.model';
import { AuthService } from './auth.service';
import { Group, groupConverter } from '../common/group.model';
// import { where } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class DbService {
  firestore: Firestore = inject(Firestore);
  userCollection = collection(this.firestore, 'users').withConverter(userConverter);
  familyCollection = collection(this.firestore, 'families').withConverter(familyConverter);
  eventCollection = collection(this.firestore, 'events').withConverter(eventConverter);
  groupCollection = collection(this.firestore, 'groups').withConverter(groupConverter);
  contentCollection = collection(this.firestore, 'content');
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
      const updateRef = doc(this.userCollection, update.uid);
      batch.update(updateRef, update.updates);
    }
    await batch.commit();
  }
  async updateUser(userId: string, fieldsToUpdate) {
    const userRef = doc(this.userCollection, userId);
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
    const familyRef = doc(this.familyCollection, familyId);
    let result = await updateDoc(familyRef, {
      members: arrayRemove(memberId)
    });
    return result;
  }
  async deleteFamily(familyId) {
    let result = await deleteDoc(doc(this.familyCollection, familyId));
    return result;
  }
  async addFamilyMember(familyId, memberId) {
    const familyRef = doc(this.familyCollection, familyId);
    let result = await updateDoc(familyRef, {
      members: arrayUnion(memberId)
    });
    return result;
  }
  async createEvent(event: Event) {
    const result = await addDoc(this.eventCollection, event);
    return result.id;
  }
  async updateEvent(eventId: string, updates) {
    const userRef = doc(this.eventCollection, eventId);
    let result = await updateDoc(userRef, updates);
    return result;
  }
  async getEventByIds(eventIds: string[]): Promise<Event[]> {
    const q = query(this.eventCollection, where(documentId(), "in", eventIds));
    
    const productsDocsSnap = await getDocs(q);
    let events = [];
    let now = new Date();
    productsDocsSnap.forEach((doc) => {
      let event = doc.data();
      if(event.recurrence && event.startDate.getTime() < now.getTime()) {
        let startDate: Date = new Date(event.startDate);
        while(startDate.getTime()<now.getTime() || event.recurrence.exceptionDates.some(date => date.getDate() === startDate.getDate() && date.getMonth() === startDate.getMonth())) {
          startDate.setDate(startDate.getDate() + event.recurrence.interval);
        }
        if(startDate.getTime() <= event.recurrence.endDate.getTime()) {
          event.startDate = startDate;
        }
      }
      events.push(event);
    });
    events.sort((e1,e2) => {return e1.startDate.getTime() - e2.startDate.getTime()});
    return events;
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
  async getEventsByOwner(userId) {
    const q = query(this.eventCollection, where('owners','array-contains',userId));
    const snapshop = await getDocs(q);
    let events: Event[] = [];
    snapshop.forEach((doc)=>{
      events.push(doc.data());
    });
    events.sort((e1,e2) => {return e1.startDate.getTime() - e2.startDate.getTime()});
    return events;
  }
  async addEventAttendee(eventId, attendeeId) {
    const eventRef = doc(this.eventCollection, eventId);
    let result = await updateDoc(eventRef, {
      attendees: arrayUnion(attendeeId)
    });
    return result;
  }
  async getEventsByStartDate(startDate: Date, numLimit: number) {
    const q1 = query(this.eventCollection, where('startDate', ">=", startDate), where('recurrence', '==', null), limit(numLimit));
    const q2 = query(this.eventCollection, where(new FieldPath('recurrence','endDate'), '>=', startDate), limit(numLimit));
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
        while(startDate.getTime()<now.getTime() || event.recurrence.exceptionDates.some(date => date.getDate() === startDate.getDate() && date.getMonth() === startDate.getMonth())) {
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
          let hiddenVisiblity = event.visibility.filter(visTag => Roles.includes(visTag));
          if(hiddenVisiblity.length > 0) {
            return hiddenVisiblity.some(visiblityTag => roles.includes(visiblityTag));
          } else {
            return true;
          }
        } else {
          return true;
        }
      });
    } else {
      events.filter(event => {
        if(event.visibility.length > 0) {
          let hiddenVisiblity = event.visibility.filter(visTag => Roles.includes(visTag));
          if(hiddenVisiblity.length > 0) {
            return false;
          } else {
            return true;
          }
        }
        return true;
      });
    }
    events.sort((e1,e2) => {return e1.startDate.getTime() - e2.startDate.getTime()});
    if(events.length > numLimit) {
      return events.slice(0,numLimit);
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
        while(startDate.getTime()<now.getTime() || event.recurrence.exceptionDates.some(date => date.getDate() === startDate.getDate() && date.getMonth() === startDate.getMonth())) {
          startDate.setDate(startDate.getDate() + event.recurrence.interval);
        }
        if(startDate.getTime() <= event.recurrence.endDate.getTime() && startDate.getTime() <= endDate.getTime()) {
          events.push(event);
        }
      } else {
        if(event.startDate.getTime() <= endDate.getTime()) {
          events.push(event); 
        }
      }
    });
    if(this.auth.isLoggedIn()) {
      let roles = this.auth.getUserRoles();
      events = events.filter((event)=>{
        if(event.visibility.length > 0) {
          let hiddenVisiblity = event.visibility.filter(visTag => Roles.includes(visTag));
          if(hiddenVisiblity.length > 0) {
            return hiddenVisiblity.some(visiblityTag => roles.includes(visiblityTag));
          } else {
            return true;
          }
        } else {
          return true;
        }
      });
    } else {
      events.filter(event => {
        if(event.visibility.length > 0) {
          let hiddenVisiblity = event.visibility.filter(visTag => Roles.includes(visTag));
          if(hiddenVisiblity.length > 0) {
            return false;
          } else {
            return true;
          }
        }
        return true;
      });
    }
    events.sort((e1,e2) => {return e1.startDate.getTime() - e2.startDate.getTime()});
    if(numLimit && events.length > numLimit) {
      return events.slice(0,numLimit-1);
    } else {
      return events;
    }
  }
  async deleteEvent(eventId) {
    let result = await deleteDoc(doc(this.eventCollection, eventId));
    return result;
  }
  async createGroup(group: Group) {
    const result = await addDoc(this.groupCollection, group);
    return result.id;
  }
  async updateGroup(groupId: string, updates) {
    const userRef = doc(this.groupCollection, groupId);
    let result = await updateDoc(userRef, updates);
    return result;
  }
  async addGroupAttendee(groupId, attendeeId) {
    const eventRef = doc(this.groupCollection, groupId);
    let result = await updateDoc(eventRef, {
      attendees: arrayUnion(attendeeId)
    });
    return result;
  }
  async getGroups(lim): Promise<Group[]> {
    let groups = [];
    const q = query(this.groupCollection, limit(lim));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      groups.push(doc.data());
    });
    return groups;
  }
  async getGroupByIds(groupIds: string[]): Promise<Group[]> {
    const q = query(this.groupCollection, where(documentId(), "in", groupIds));
    const productsDocsSnap = await getDocs(q);
    let groups = [];
    productsDocsSnap.forEach((doc) => {
      groups.push(doc.data());
    });
    return groups;
  }
  async getGroupById(groupId) {
    const docRef = doc(this.groupCollection, groupId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return undefined;
    }
  }
  async deleteGroup(groupId) {
    let result = await deleteDoc(doc(this.firestore, "groups", groupId));
    return result;
  }
  async getWatchContent() {
    const docRef = doc(this.contentCollection, 'watch');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return undefined;
    }
  }
  async updateWatchContent(watchUrl) {
    const userRef = doc(this.contentCollection, 'watch');
    let result = await updateDoc(userRef, {src: watchUrl});
    return result;
  }
  async getLandingContent() {
    const docRef = doc(this.contentCollection, 'landing');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return undefined;
    }
  }
  async updateLandingContent(content) {
    const userRef = doc(this.contentCollection, 'landing');
    let result = await updateDoc(userRef, content);
    return result;
  }
  async getTranslations() {
    const docRef = doc(this.contentCollection, 'translation');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return undefined;
    }
  }
  async saveTranslation(translation) {
    const docRef = doc(this.contentCollection, 'translation');
    await setDoc(docRef,translation, { merge: true });
  }
}
