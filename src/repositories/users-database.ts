import {UserCreateType, UserInsertDbType, usersCollection} from "./db";
import {UserViewType} from "./queryRepo";
import {ObjectId} from "mongodb";

export const usersRepo = {
    async findByLoginOrEmail(loginOrEmail: string) {
        return await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    },
    async createUser(newUser: UserCreateType, hash: string): Promise<UserViewType> {
        const insertDbUser: UserInsertDbType = {
            login: newUser.login,
            email: newUser.email,
            hash: hash,
            createdAt: newUser.createdAt
        }
        const result = await usersCollection.insertOne({...insertDbUser})
        return {
            id: result.insertedId.toString(),
            ...insertDbUser
        }
    },
    async deleteUser(id: string): Promise<boolean | null> {
        if (ObjectId.isValid(id)) {
            const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
            return result.deletedCount === 1
        } else return null
    },
}