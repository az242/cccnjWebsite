import { FirestoreDataConverter } from "@angular/fire/firestore";

export class User {
    photoUrl: string;
    displayName: string;
    firstName: string;
    lastName: string;
    email: string;
    address: Address;
    dob: dateObject;
    phone: string;
    familyId: string;
    roles: Array<string>;
    groups: Array<string>;
    events: Array<string>;
    created: string;
    loggedIn: string;
    member: dateObject;
    uid: string;
    constructor (firstName, lastName, email ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.photoUrl = '';
        this.displayName = firstName + ' ' + lastName;
        this.address = undefined;
        this.dob = undefined;
        this.phone = '';
        this.familyId = '';
        this.roles = [];
        this.groups = [];
        this.events = [];
        this.created = '';
        this.loggedIn = '';
        this.member = undefined;
        this.uid = '';
    }
}
export const Roles = ['admin', 'event', 'group'];
export const userConverter: FirestoreDataConverter<User> = {
    toFirestore: (user) => {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            photoUrl: user.photoUrl,
            address: user.address,
            dob: user.dob,
            phone: user.phone,
            familyId: user.familyId,
            roles: user.roles,
            groups: user.groups,
            events: user.events,
            member: user.member
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        let user: User = new User(data.firstName, data.lastName, data.email);
        user.address = data.address;
        user.dob = data.dob;
        user.phone = data.phone;
        user.familyId = data.familyId;
        user.roles = data.roles;
        user.groups = data.groups;
        user.events = data.events;
        user.member = data.member;
        user.uid = snapshot.id;
        return user;
    }
};
export class Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export class dateObject {
    month: number;
    day: number;
    year: number;
}
