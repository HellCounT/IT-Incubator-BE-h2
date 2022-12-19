import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const inputValidation = (req: Request, res: Response, next: NextFunction) => {
    const errorMessagesArray = validationResult(req).array({onlyFirstError: true})
    if (errorMessagesArray.length > 0) {
        res.status(400).json({
                errorMessages: errorMessagesArray.map(e => ({
                    message: e.msg,
                    field: e.param
                }))
                }
        )
    } else {
        next()
    }
}
