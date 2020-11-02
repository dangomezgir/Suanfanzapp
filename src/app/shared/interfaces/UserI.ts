import {ContactI} from '../../pages/private/home/interfaces/contact'

export interface UserI {
    email: string;
    telefono: string;
    name: string;
    lname: string;
    password?: string;
    isLogged:boolean;
    contacts: ContactI[];
    icon: string;
}
