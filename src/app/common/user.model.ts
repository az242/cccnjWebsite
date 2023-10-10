export interface User {
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
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export interface dateObject {
    month: number;
    day: number;
    year: number;
}

export interface Family {
    members: string[];
}