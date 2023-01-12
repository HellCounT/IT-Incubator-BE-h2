import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {inputValidation, userDataValidator} from "../middleware/data-validation";
import {jwtService} from "../application/jwt-service";

export const authRouter = Router({})

authRouter.post('/login',
    userDataValidator.passwordCheck,
    userDataValidator.loginOrEmailCheck,
    inputValidation,
    async (req: Request, res: Response) => {
    const checkResult = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (checkResult) {
        const token = {
            "accessToken": jwtService.createJwt(checkResult)
        }
        res.sendStatus(200).send(token)
    }
    else res.sendStatus(401)
})