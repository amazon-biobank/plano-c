import { User } from "../models/User";

export type UserType = {
    id: string;
    address: string;
    name: string;
    tokens: string[];
    balance: string;
    public_key: string;
    created_at: Date;
}

export type UserCreationArgs = {
    name: string;
    public_key: string;
}

export class UserDTO {
    public static userToJson = (user: User): UserType => {
        const userJson: UserType = {
            id: user.id,
            address: user.id,
            balance: user.balance.toString(),
            name: user.username,
            tokens: [],
            public_key: user.publicKey,
            created_at: user.createdAt
        }
        return userJson
    }
}