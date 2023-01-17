import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {inputValidation, userDataValidator} from "../middleware/data-validation";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../middleware/auth-middleware";
import {usersQueryRepo} from "../repositories/queryRepo";

export const authRouter = Router({})

authRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {
    const token = req.headers.authorization!.split(' ')[1]
    const result = await usersQueryRepo.getMyInfo(token)
    res.status(204).send(result)
})

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
        res.status(200).send(token)
    }
    else res.sendStatus(401)
})

authRouter.post('/registration',
    //Input validation
    userDataValidator.loginCheck,
    userDataValidator.passwordCheck,
    userDataValidator.emailCheck,
    userDataValidator.userExistsCheckEmail,
    userDataValidator.userExistsCheckLogin,
    inputValidation,
    //Handlers
    async (req: Request, res: Response) => {
        //User registration
        const userRegResult = await usersService.registerUser(req.body.login, req.body.password, req.body.email)
        if (userRegResult) res.sendStatus(204)
})

authRouter.post('/registration-confirmation',
    userDataValidator.codeExists,
    inputValidation,
    async (req: Request, res: Response) => {
    const result = await usersService.confirmUserEmail(req.body.code)
    console.log(result)
    if (!result) res.sendStatus(400)
    else return res.sendStatus(204)
})

authRouter.post('/registration-email-resending',
    userDataValidator.emailCheck,
    inputValidation,
    async (req: Request, res: Response) => {
    const result = await usersService.resendActivationCode(req.body.email)
    if (!result) res.sendStatus(400)
    else return res.sendStatus(204)
})