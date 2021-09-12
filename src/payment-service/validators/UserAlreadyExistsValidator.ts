import { UserCreationArgs } from '../data/UserDTO';
import { UserAlreadyExistsException } from '../errors/CustomExceptions';
import { User } from "../models/User";

export class UserAlreadyExistsValidator {
    public static validate = async (userCreationArgs: UserCreationArgs) => {
        const sameName = await User.findOne({
            where: {
                username: userCreationArgs.name
            }
        });
        const sameCertificate = await User.findOne({
            where: {
                publicKey: userCreationArgs.public_key
            }
        })
        if(sameName || sameCertificate)
            throw new UserAlreadyExistsException();
    }
}