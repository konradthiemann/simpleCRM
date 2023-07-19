type NewType = string;

export class Finance {
    userId: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    creationDate: any | undefined;
    category: string | undefined;
    amount: number | undefined;
    note: string | undefined;
    transaction: string | undefined;

    constructor(obj?: any) {
        this.userId = obj ? obj.userId : '';
        this.firstName = obj ? obj.firstName : '';
        this.lastName = obj ? obj.lastName : '';
        this.creationDate = obj ? obj.creationDate : '';
        this.category = obj ? obj.category : '';
        this.amount = obj ? obj.amount : '';
        this.note = obj ? obj.note : '';
        this.transaction = obj ? obj.transaction : '';
    }

    public toJSON() {
        return {
            userId: this.userId,
            firstName: this.firstName,
            lastName: this.lastName,
            creationDate: this.creationDate,
            category: this.category,
            amount: this.amount,
            note: this.note,
            transaction: this.transaction,
        }
    }
}