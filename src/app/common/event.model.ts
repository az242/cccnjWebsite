export interface Event {
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

export interface RecurranceRule {
    recurringDay: boolean;
    frequency: string;
    interval: number;
    weekdays: string[];
    endAfterOccurances: number;
    exceptionDates: string[];
}
