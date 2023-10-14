import { FirestoreDataConverter } from "@angular/fire/firestore";

export class Group {
    name: string;
    photoUrl: string;
    forWho: string;
    desc: string;
    shortDesc: string;
    when: string;
    location: string;
    visibility: string[];
    attendees: string[];
    owners: string[];
    uid: string;
}
export const groupConverter: FirestoreDataConverter<Group> = {
    toFirestore: (group) => {
        return {
            name: group.name,
            photoUrl: group.photoUrl,
            forWho: group.forWho,
            desc: group.desc,
            shortDesc: group.shortDesc,
            when: group.when,
            location: group.location,
            visibility: group.visibility,
            attendees: group.attendees,
            owners: group.owners
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        let group: Group = new Group();
        group.name = data.name;
        group.photoUrl = data.photoUrl;
        group.forWho = data.forWho;
        group.desc = data.desc;
        group.shortDesc = data.shortDesc;
        group.when = data.when;
        group.location = data.location;
        group.visibility = data.visibility;
        group.attendees = data.attendees;
        group.owners = data.owners;
        group.uid = snapshot.id;
        return group;
    }
};