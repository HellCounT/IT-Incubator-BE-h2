import {usersCollection} from "./db";
import {ObjectId} from "mongodb";
import {UserCreateType, UserInsertDbType, UserViewType} from "../types/types";

export const usersRepo = {
    async findByLoginOrEmail(loginOrEmail: string) {
        return await usersCollection.findOne({
            $or: [{'accountData.email': loginOrEmail},
                {'accountData.login': loginOrEmail}]
        })
    },
    async findByConfirmationCode(emailConfirmationCode: string) {
        return await usersCollection.findOne(
            {'emailConfirmationData.confirmationCode': emailConfirmationCode})
    },
    async createUser(newUser: UserCreateType, hash: string): Promise<UserViewType> {
        const insertDbUser: UserInsertDbType = {
            accountData: {
                login: newUser.login,
                email: newUser.email,
                hash: hash,
                createdAt: newUser.createdAt
            },
            emailConfirmationData: {
                confirmationCode: newUser.confirmationCode,
                expirationDate: newUser.expirationDate,
                isConfirmed: newUser.isConfirmed
            }
        }
        const result = await usersCollection.insertOne({...insertDbUser})
        return {
            id: result.insertedId.toString(),
            login: insertDbUser.accountData.login,
            email: insertDbUser.accountData.email,
            createdAt: insertDbUser.accountData.createdAt
        }
    },
    async deleteUser(id: string): Promise<boolean | null> {
        if (ObjectId.isValid(id)) {
            const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
            return result.deletedCount === 1
        } else return null
    },
    async confirmUser(id: string): Promise<boolean> {
        const result = await usersCollection.updateOne({_id: new ObjectId(id)}, {
            $set:
                {
                    'emailConfirmationData.isConfirmed': true
                }
        })
        return result.matchedCount === 1
    },
    async updateConfirmationCode(id: ObjectId, newCode: string): Promise<void> {
        await usersCollection.updateOne({_id: id}, {
            $set:
                {
                    'emailConfirmationData.confirmationCode': newCode
                }
        })
        return
    }
}