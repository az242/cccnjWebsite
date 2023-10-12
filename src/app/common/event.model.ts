import { FirestoreDataConverter } from "@angular/fire/firestore";

export class Event {
    name: string;
    location: string;
    photoUrl: string;
    startDate: number;
    recurrence:RecurranceRule;
    forWho: string;
    desc: string;
    shortDesc: string;
    public: boolean;
}

export class RecurranceRule {
    interval: number;// how many days till this event occurs again
    endDate: number;// when we should stop this event 
    exceptionDates: number[]; //dates it should not repeat
}

export const eventConverter: FirestoreDataConverter<Event> = {
    toFirestore: (event) => {
        return {
            name: event.name,
            location: event.location,
            photoUrl: event.photoUrl,
            startDate: event.startDate,
            recurrence: event.recurrence,
            forWho: event.forWho,
            desc: event.desc,
            shortDesc: event.shortDesc,
            public: event.public
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        let event: Event = new Event();
        event.name = data.name;
        event.location = data.location;
        event.photoUrl = data.photoUrl;
        event.startDate = data.startDate;
        event.recurrence = data.recurrence;
        event.forWho = data.forWho;
        event.desc = data.desc;
        event.shortDesc = data.shortDesc;
        event.public = data.public;
        return event;
    }
};