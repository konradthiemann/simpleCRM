type NewType = string;

export class User {
    firstName: string | undefined;
    lastName: string | undefined;
    birthDate: number | undefined;
    street: string | undefined;
    zipCode: number | undefined;
    city: string | undefined;
    email: string | undefined;
    password: string | undefined;
    id: any | undefined;

    constructor(obj?: any) {

        this.firstName = obj ? obj.firstName : '';
        this.lastName = obj ? obj.lastName : '';
        this.birthDate = obj ? obj.birthDate : '';
        this.street = obj ? obj.street : '';
        this.zipCode = obj ? obj.zipCode : '';
        this.city = obj ? obj.city : '';
        this.email = obj ? obj.email : '';
        this.password = obj ? obj.password : '';
        this.id = obj ? obj.id : '';
    }

    public toJSON() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            birthDate: this.birthDate,
            street: this.street,
            zipCode: this.zipCode,
            city: this.city,
            email: this.email,
            password: this.password,
            id: this.id,
        }
    }
}