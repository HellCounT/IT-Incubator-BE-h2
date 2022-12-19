import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const inputValidation = (req: Request, res: Response, next: NextFunction) => {
    const errorMessages = validationResult(req).array({onlyFirstError: true})
    if (errorMessages.length > 0) {
        res.status(400).send({
                "errorMessages": errorMessages.map(e => ({
                    message: e.msg,
                    field: e.location
                }))}
            )
    } else {
        next()
    }
}
