import { UserCreationArgs } from '../data/UserDTO';
import { User } from "../models/User";

export class UserAlreadyExistsValidator {
    public static validate = async (userCreationArgs: UserCreationArgs) => {
        const sameName = await User.findOne({
            where: {
                name: userCreationArgs.name
            }
        });
        const sameCertificate = await User.findOne({
            where: {
                publicKey: userCreationArgs.public_key
            }
        })
        if(sameName || sameCertificate)
            throw new UserAlreadyExistsValidator();
    }
}