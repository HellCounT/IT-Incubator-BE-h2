import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {inputValidation, userDataValidator} from "../middleware/data-validation";

export const loginRouter = Router({})

loginRouter.post('/login',
    userDataValidator.passwordCheck,
    userDataValidator.loginOrEmailCheck,
    inputValidation,
    async (req: Request, res: Response) => {
    const checkResult = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (checkResult) res.sendStatus(204)
    else res.sendStatus(401)
})