/*
* Interface for User DTO, only used in creating new Users
*/
export interface UserInterface {
    _id?: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    isAdmin: boolean;
    role: 'admin' | 'ceo' | 'hr' | 'salesman';
}

export const USER_ROLES = {
    ADMIN: 'admin' as const,
    CEO: 'ceo' as const,
    HR: 'hr' as const,
    SALESMAN: 'salesman' as const
};
