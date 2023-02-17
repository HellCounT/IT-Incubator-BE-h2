import {WithId} from "mongodb";

declare global {
    namespace Express {
        export interface Request {
            user?: WithId<UserInsertDbType> | null
        }
    }
}