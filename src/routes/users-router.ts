import {Request, Response, Router} from "express";
import {UserQueryParser, usersQueryRepo} from "../repositories/queryRepo";
import {inputValidation, userDataValidator} from "../middleware/data-validation";
import {usersService} from "../domain/users-service";
import {basicAuth} from "../middleware/auth";

export const usersRouter = Router({})

usersRouter.get('/', basicAuth, async (req: Request, res: Response) => {
    // query validation and parsing
    let queryParams: UserQueryParser = {
        sortBy: 'createdAt',
        sortDirection: -1,
        pageNumber: 1,
        pageSize: 10,
        searchEmailTerm: null,
        searchLoginTerm: null
    }
    if (req.query.searchLoginTerm) queryParams.searchLoginTerm = req.query.searchLoginTerm.toString()
    if (req.query.searchEmailTerm) queryParams.searchEmailTerm = req.query.searchEmailTerm.toString()
    if (req.query.sortBy) queryParams.sortBy = req.query.sortBy.toString()
    if (req.query.sortDirection && req.query.sortDirection.toString() === "asc") queryParams.sortDirection = 1
    if (req.query.pageNumber) queryParams.pageNumber = +req.query.pageNumber
    if (req.query.pageSize) queryParams.pageSize = +req.query.pageSize
    res.status(200).send(await usersQueryRepo.viewAllUsers(queryParams))
})

usersRouter.post('/', basicAuth,
    //Input validation
    userDataValidator.loginCheck,
    userDataValidator.passwordCheck,
    userDataValidator.emailCheck,
    inputValidation,
    //Handlers
    async (req: Request, res: Response) => {
        //User creation
        const userCreationResult = await usersService.createUser(req.body.login, req.body.password, req.body.email)
        return res.status(201).send(userCreationResult)
})

usersRouter.delete('/:id', basicAuth, async (req: Request, res: Response) => {
    if (await usersService.deleteUser(req.params.id)) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})