import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersQueryRepo} from "../repositories/queryRepo";
import {settings} from "../settings";
import {expiredTokensRepo} from "../repositories/tokens-database";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
    } else {
        const token = req.headers.authorization.split(' ')[1]
        const userId = await jwtService.getUserIdByToken(token, settings.JWT_SECRET)
        if (userId) {
            req.user = await usersQueryRepo.findUserById(userId)
            next()
        } else res.sendStatus(401)
    }
}
export const refreshTokenCheck = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.refresh_token) res.sendStatus(401)
    else {
        const token = req.cookies.refresh_token
        if (await expiredTokensRepo.findToken(token)) res.sendStatus(401)
        const userId = await jwtService.getUserIdByToken(token, settings.JWT_REFRESH_SECRET)
        if (userId) {
            req.user = await usersQueryRepo.findUserById(userId)
            next()
        } else res.sendStatus(401)
    }
}