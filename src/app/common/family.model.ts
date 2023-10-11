import { FirestoreDataConverter } from "@angular/fire/firestore";

export class Family {
    members: string[];
}

export const familyConverter: FirestoreDataConverter<Family> = {
    toFirestore: (family) => {
        return {
            members: family.members
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        let family: Family = new Family();
        family.members = data.members;
        return family;
    }
};