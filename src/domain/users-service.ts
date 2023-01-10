import bcrypt from 'bcrypt'
import {usersRepo} from "../repositories/users-database";
import {UserCreateType, UserViewType} from "../repositories/types";

export const usersService = {
    async createUser(login: string, password: string, email: string): Promise<UserViewType> {
        const passwordHash = await usersService._generateHash(password)
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
        const foundUser = await usersRepo.findByLoginOrEmail(loginOrEmail)
        console.log("foundUser", foundUser)
        if (!foundUser) return false
        else {
            const userHash = foundUser.hash
            //const passwordHash = await usersService._generateHash(password)
            return await bcrypt.compare(password,userHash)
        }
    },
    async _generateHash(password: string) {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    }
}
