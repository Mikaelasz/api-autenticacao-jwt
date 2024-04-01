import { Request } from 'express';
import { User } from '../entities/User';

//sobreescrevendo Request
declare global{
    namespace Express{
        export interface Request{
            user: Partial<User>
        }
    }
}