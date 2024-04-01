import { authMiddleware } from './middlewares/authMiddleware';
import { Router } from "express";
import { UserController } from "./controllers/UserController";

const routes = Router()

routes.post('/user', new UserController().create)
routes.post('/login', new UserController().login)

//duas maneiras de se usar o middle
//routes.get('/profile', authMiddleware, new UserController().getProfile)

//todas as rotas que estiverem abaixo passaram pelo middle
routes.use(authMiddleware)
routes.get('/profile', authMiddleware, new UserController().getProfile)

export default routes