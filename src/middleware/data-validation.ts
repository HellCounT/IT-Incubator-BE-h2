import {NextFunction, Request, Response} from "express";
import {body, CustomValidator, param, validationResult} from "express-validator";
import {blogsCollection, postsCollection, usersCollection} from "../repositories/db";
import {ObjectId} from "mongodb";

const isValidBlogId: CustomValidator = async (blogId: string) => {
    if (await blogsCollection.findOne({_id: new ObjectId(blogId)})) {
        return true
    } else {
        throw new Error('Invalid parent blog id')
    }
}
const isValidBlogIdParam: CustomValidator = async (id: string) => {
    if (await blogsCollection.findOne({_id: new ObjectId(id)})) {
        return true
    } else {
        throw new Error('Invalid parent blog id')
    }
}
const isValidPostIdParam: CustomValidator = async (id: string) => {
    if (await postsCollection.findOne({_id: new ObjectId(id)})) {
        return true
    } else {
        throw new Error('Invalid parent post id')
    }
}
const userAlreadyExists: CustomValidator = async (email: string) => {
    if (!await usersCollection.findOne({"accountData.email": email})) {
        return true
    } else {
        throw new Error('User already exists')
    }
}
export const blogDataValidator = {
    nameCheck: body('name').exists().isString().trim().isLength({min: 1, max: 15}).withMessage("Name is invalid"),
    descriptionCheck: body('description').exists().isString().trim().isLength({
        min: 1,
        max: 500
    }).withMessage("Description is invalid"),
    urlCheck: body('websiteUrl').exists().isString().trim().isLength({
        min: 1,
        max: 100
    }).isURL().withMessage("URL is invalid")
}
export const postDataValidator = {
    titleCheck: body("title").isString().trim().isLength({min: 1, max: 30}).withMessage("Title is invalid"),
    shortDescriptionCheck: body("shortDescription").isString().trim().isLength({
        min: 1,
        max: 100
    }).withMessage("Short description is invalid"),
    contentCheck: body("content").isString().trim().isLength({min: 1, max: 1000}).withMessage("Content is invalid"),
    blogIdCheck: body("blogId").exists().isString().custom(isValidBlogId),
    blogIdParamCheck: param('id').exists().isString().custom(isValidBlogIdParam)
}
export const commentDataValidator = {
    contentCheck: body("content").isString().trim().isLength({min: 20, max: 300}).withMessage("Content is invalid"),
    postIdParamCheck: param("postId").exists().isString().custom(isValidPostIdParam)
}
export const userDataValidator = {
    loginCheck: body('login').isString().trim().isLength({
        min: 3,
        max: 10
    }).matches(/^[a-zA-Z0-9_-]*$/).withMessage("Login is invalid"),
    passwordCheck: body('password').isString().trim().isLength({min: 6, max: 20}).withMessage("Password is invalid"),
    emailCheck: body('email').isString().notEmpty().isEmail().withMessage("Email is invalid"),
    loginOrEmailCheck: body('loginOrEmail').isString().trim().notEmpty().withMessage("Login/email is invalid"),
    userExistsCheck: body('email').custom(userAlreadyExists).withMessage('User already exists')
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
export const paramIdInputValidation = (req: Request, res: Response, next: NextFunction) => {
    const errorMessagesArray = validationResult(req).array({onlyFirstError: true})
    if (errorMessagesArray.length > 0) {
        res.sendStatus(404)
    } else {
        next()
    }
}