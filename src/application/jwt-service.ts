import jwt from 'jsonwebtoken'
import {ObjectId, WithId} from "mongodb";
import {UserInsertDbType} from "../types/types";
import {settings} from "../settings";

export const jwtService = {
    createJwt(user: WithId<UserInsertDbType>): string {
        return jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '1h'})
    },
    async getUserIdByToken(token: string): Promise<ObjectId | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    }
}
