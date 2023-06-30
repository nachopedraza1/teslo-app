export interface IUser {
    _id: string,
    name: string,
    email: string,
    password?: string,
    role: Roles,
    craetedAt?: string,
    updatedAt?: string,
}

type Roles = 'admin' | 'client'