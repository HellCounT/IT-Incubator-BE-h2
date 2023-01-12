import {WithId} from "mongodb";
import {UserInsertDbType} from "./types";

declare global{
    declare namespace Express {
        export interface Request {
            user: WithId<UserInsertDbType> | null
        }
    }
}