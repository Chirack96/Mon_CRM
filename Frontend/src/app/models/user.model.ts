export class User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  groupe: string;
  image?: string;

  constructor(
    id: number = 0,
    firstname: string = '',
    lastname: string = '',
    email: string = '',
    password: string = '',
    groupe: string = ''
  ) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
    this.groupe = groupe;
  }
}
