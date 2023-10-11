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

export class Family {
    members: string[];
}

const userConverter = {
    toFirestore: (user) => {
        return {
            
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.name, data.state, data.country);
    }
};