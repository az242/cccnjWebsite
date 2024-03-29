import { FirestoreDataConverter } from "@angular/fire/firestore";

export class User {
    photoUrl: string;
    displayName: string;
    firstName: string;
    lastName: string;
    email: string;
    address: Address;
    dob: Date;
    phone: string;
    familyId: string;
    roles: Array<string>;
    groups: Array<string>;
    events: Array<string>;
    created: string;
    loggedIn: string;
    member: Date;
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
/**
 * Available Admin Roles for user power roles
 * Indexes:
 * 0 admin
 * 1 event
 * 2 group
 */
export const Roles = Object.freeze(['admin', 'event', 'group', 'content']);
/**
 *  Available group roles for users/events/groups
 *  Indexes:
 *  0 english
 *  1 taiwanese
 *  2 mandarin
 */
export const Groups = Object.freeze(['english','taiwanese','mandarin']);
/**
 * Available Age Roles for users/events/groups
 * 
 * Indexes: 
 * 0 adult
 * 1 college
 * 2 youth
 * 3 child
 * 4 infant
 */
export const Ages = Object.freeze(['adult','college', 'youth', 'child', 'infant']);
export const AllRoles = Object.freeze([...Roles, ...Groups, ...Ages]);
/**
 * Get user age role by JS Date object
 * @param dob Date used to calculate current age
 * @returns string Age Role
 */
export const getAgeTag = (dob: Date) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    if(age > 21) {
        return Ages[0];
    } else if(age <= 21 && age >18) {
        return Ages[1];
    } else if(age < 18 && age >=11) {
        return Ages[2];
    } else if(age < 11 && age >=5) {
        return Ages[3]
    } else {
        return Ages[4];
    }
};
export const userConverter: FirestoreDataConverter<User> = {
    toFirestore: (user: User) => {
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
        user.dob = data.dob && data.dob !== '' ? data.dob.toDate() : undefined;
        user.phone = data.phone;
        user.familyId = data.familyId;
        user.roles = data.roles;
        user.groups = data.groups;
        user.events = data.events;
        user.member = data.member && data.member !== '' ? data.member.toDate() : undefined;
        user.uid = snapshot.id;
        user.photoUrl = data.photoUrl;
        return user;
    }
};
export class Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}