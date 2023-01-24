import jwt from 'jsonwebtoken'
import {ObjectId, WithId} from "mongodb";
import {UserInsertDbType} from "../types/types";
import {settings} from "../settings";
import {expiredTokensRepo} from "../repositories/tokens-database";

export const jwtService = {
    createJwt(user: WithId<UserInsertDbType>): string {
        return jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: 10})
    },
    createRefreshJwt(user: WithId<UserInsertDbType>): string {
        return jwt.sign({userId: user._id}, settings.JWT_REFRESH_SECRET, {expiresIn: 20})
    },
    async updateRefreshJwt(user: WithId<UserInsertDbType>, refreshToken: string): Promise<string> {
        await expiredTokensRepo.addTokenToDb(refreshToken, user._id)
        return jwt.sign({userId: user._id}, settings.JWT_REFRESH_SECRET, {expiresIn: 20})
    },
    async getUserIdByToken(token: string, secret: string): Promise<ObjectId | null> {
        try {
            const result: any = jwt.verify(token, secret)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    },
    async addTokenToDb(user: WithId<UserInsertDbType>, refreshToken: string): Promise<void> {
        await expiredTokensRepo.addTokenToDb(refreshToken, user._id)
        return
    }
}
