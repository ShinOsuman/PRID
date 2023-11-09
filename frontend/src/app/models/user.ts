export class User {
    id?: number;
    pseudo?: string;
    password?: string;
    email?: string;
    lastname?: string;
    firstName?: string;
    birthDate?: string;

    constructor(data: any) {
        if (data) {
            this.pseudo = data.pseudo;
            this.password = data.password;
            this.firstName = data.firstName;
            this.lastname = data.lastname;
            this.birthDate = data.birthDate &&
                data.birthDate.length > 10 ? data.birthDate.substring(0, 10) : data.birthDate;
        }
    }
}
