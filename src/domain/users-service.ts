import {UserViewType} from "../repositories/queryRepo";
import {UserCreateType, UserInsertDbType} from "../repositories/db";
import bcrypt from 'bcrypt'
import {usersRepo} from "../repositories/users-database";
import {WithId} from "mongodb";

export const usersService = {
    async createUser(login: string, password: string, email: string): Promise<UserViewType> {
        const passwordHash = await this._generateHash(password)
        const newUser: UserCreateType = {
            login: login,
            password: password,
            email: email,
            createdAt: new Date().toISOString()
        }
        return await usersRepo.createUser(newUser, passwordHash)
    },
    async deleteUser(id: string): Promise<boolean | null> {
        return await usersRepo.deleteUser(id)
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        const user: WithId<UserInsertDbType> | null = await usersRepo.findByLoginOrEmail(loginOrEmail)
        if (!user) return false
        else {
            const passwordHash = await usersService._generateHash(password)
            return user.hash === passwordHash;
        }

    },
    async _generateHash(password: string) {
        return await bcrypt.hash(password, await bcrypt.genSalt(10))
    }
}
