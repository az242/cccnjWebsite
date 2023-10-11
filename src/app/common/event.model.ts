import { FirestoreDataConverter } from "@angular/fire/firestore";

export class Event {
    name: string;
    location: string;
    photoUrl: string;
    startDate: string;
    endDate: string;
    recurrence:RecurranceRule;
    forWho: string;
    desc: string;
    shortDesc: string;
}

export class RecurranceRule {
    recurringDay: boolean;
    frequency: string;
    interval: number;
    weekdays: string[];
    endAfterOccurances: number;
    exceptionDates: string[];
}

export const eventConverter: FirestoreDataConverter<Event> = {
    toFirestore: (event) => {
        return {
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        let family: Event = new Event();
        return family;
    }
};