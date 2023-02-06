import {ActiveSessionDbType} from "../types/types";
import {ObjectId} from "mongodb";
import {activeSessionsCollection} from "./db";

export const devicesRepo = {
    async addSessionToDb(refreshTokenMeta: string, deviceId: ObjectId,
                         userId: ObjectId, ip: string, deviceName: string,
                         issueDate: Date, expDate: Date): Promise<void> {
        const newSession: ActiveSessionDbType = {
            _id: deviceId,
            userId: userId,
            ip: ip,
            deviceName: deviceName,
            issuedAt: issueDate,
            expirationDate: expDate,
            refreshTokenMeta: refreshTokenMeta
        }
        await activeSessionsCollection.insertOne(newSession)
        return
    },
    async updateSessionWithDeviceId(newRefreshTokenMeta: string, deviceId: ObjectId,
                                    issueDate: Date, expDate: Date): Promise<boolean> {
        console.log(issueDate.toISOString(), 'updated issueDate')
        console.log(deviceId, ' device id in update method')
        const result = await activeSessionsCollection.updateOne({_id: deviceId}, {
            $set: {
                issuedAt: issueDate,
                expirationDate: expDate,
                refreshTokenMeta: newRefreshTokenMeta
            }
        })
        const a = await activeSessionsCollection.findOne({_id: deviceId})
        console.log(a)
        return result.matchedCount === 1
    },
    async deleteSessionById(deviceId: ObjectId): Promise<boolean> {
        const result = await activeSessionsCollection.deleteOne({_id: deviceId})
        return result.deletedCount === 1
    },
    async deleteAllOtherSessions(userId: ObjectId, deviceId: ObjectId): Promise<boolean> {
        const result = await activeSessionsCollection.deleteMany({
            "userId": userId,
            "_id": {$ne: deviceId}
        })
        return result.deletedCount >= 1
    }
}