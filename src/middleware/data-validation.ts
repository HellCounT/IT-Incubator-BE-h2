import {NextFunction, Request, Response} from "express";
import {body, CustomValidator, validationResult} from "express-validator";
import {blogsCollection} from "../repositories/db";
import {ObjectId} from "mongodb";

const isValidBlogId: CustomValidator = async (blogId: string) => {
    if (await blogsCollection.findOne({_id: new ObjectId(blogId)})) {
        return true
    } else {
        throw new Error ('Invalid parent blog id')
    }
}
export const blogDataValidator = {
    nameCheck: body('name').exists().isString().trim().isLength({min: 1, max: 15}).withMessage("Name is invalid"),
    descriptionCheck: body('description').exists().isString().trim().isLength({min: 1, max: 500}).withMessage("Description is invalid"),
    urlCheck: body('websiteUrl').exists().isString().trim().isLength({min: 1, max: 100}).isURL().withMessage("URL is invalid")
}
export const postDataValidator = {
    titleCheck: body("title").isString().trim().isLength({min: 1, max: 30}).withMessage("Title is invalid"),
    shortDescriptionCheck: body("shortDescription").isString().trim().isLength({min: 1, max: 100}).withMessage("Short description is invalid"),
    contentCheck: body("content").isString().trim().isLength({min: 1, max: 1000}).withMessage("Content is invalid"),
    blogIdCheck: body("blogId").exists().isString().custom(isValidBlogId)
}
export const inputValidation = (req: Request, res: Response, next: NextFunction) => {
    const errorMessagesArray = validationResult(req).array({onlyFirstError: true})
    if (errorMessagesArray.length > 0) {
        res.status(400).send({
                errorsMessages: errorMessagesArray.map(e => ({
                    message: e.msg,
                    field: e.param
                }))
            }
        )
    } else {
        next()
    }
}