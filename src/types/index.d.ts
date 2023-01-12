import {WithId} from "mongodb";
import {UserInsertDbType} from "./types";

interface RequestWithUser extends Request {
    user: WithId<UserInsertDbType> | null
}

declare global{
     namespace Express {
        interface Request extends RequestWithUser{
        }
    }
}