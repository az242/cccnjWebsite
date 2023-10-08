export interface User {
    firstName: string;
    lastName: string;
    email: string;
    address: Address;
    dob: DateOfBirth;
    phone: string;
    roles: Array<string>;
    groups: Array<string>;
    events: Array<string>;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export interface DateOfBirth {
    month: number;
    day: number;
    year: number;
}