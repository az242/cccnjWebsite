import { FirestoreDataConverter } from "@angular/fire/firestore";

export class Event {
    name: string;
    location: string;
    photoUrl: string;
    startDate: Date;
    attendees: string[];
    recurrence:RecurranceRule;
    forWho: string;
    desc: string;
    shortDesc: string;
    visibility: string[];
    uid: string;
    owners: string[];
}

export class RecurranceRule {
    interval: number;// how many days till this event occurs again
    endDate: Date;// when we should stop this event 
    exceptionDates: Date[]; //dates it should not repeat
}

export const eventConverter: FirestoreDataConverter<Event> = {
    toFirestore: (event) => {
        return {
            name: event.name,
            location: event.location,
            photoUrl: event.photoUrl,
            startDate: event.startDate,
            recurrence: event.recurrence ? event.recurrence : null,
            forWho: event.forWho,
            desc: event.desc,
            shortDesc: event.shortDesc,
            visibility: event.visibility,
            attendees: event.attendees,
            owners: event.owners
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        let event: Event = new Event();
        event.name = data.name;
        event.location = data.location;
        event.photoUrl = data.photoUrl;
        event.startDate = data.startDate && data.startDate !== '' ? data.startDate.toDate() : undefined;
        if(data.recurrence) {
            event.recurrence = {
                interval: data.recurrence.interval,
                endDate: data.recurrence.endDate && data.recurrence.endDate !== '' ? data.recurrence.endDate.toDate() : undefined,
                exceptionDates: data.recurrence.exceptionDates.map(date => date.toDate())
            };
        } else {
            event.recurrence = undefined;
        }
        event.uid = snapshot.id;
        event.forWho = data.forWho;
        event.desc = data.desc;
        event.shortDesc = data.shortDesc;
        event.visibility = data.visibility;
        event.attendees = data.attendees;
        event.owners = data.owners;
        return event;
    }
};