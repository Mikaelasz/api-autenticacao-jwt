import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import { BadRequestError, UnauthorizedError } from "../helpers/api-erros";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const userExists = await userRepository.findOneBy({ email });

    if (userExists) {
      throw new BadRequestError("Email ja existe");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      name,
      email,
      password: hashPassword,
    });

    await userRepository.save(newUser);

    //esse é o momento que no momento da resposta eu informo os dados que eu quero receber no response
    //então eu não vou receber o password no response
    const { password: _, ...user } = newUser;

    return res.status(201).json(user);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    //verificacao de email
    const user = await userRepository.findOneBy({ email });

    if (!user) {
      throw new BadRequestError("Email ou senha invalidos");
    }

    //compare compara a senha com o hash
    //user.password eh a senha que ta armazenada no banco de dados
    const verifyPass = await bcrypt.compare(password, user.password);

    if (!verifyPass) {
      throw new BadRequestError("Email ou senha invalidos");
    }

    //abaixo estou informando quais informacoes serão armazenadas no token payload,
    //senha, e tempo de expiracao
    const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? "", {
      expiresIn: "8h",
    });

    //estou fazendo a desestruturação, removendo o password do retorno
    const { password: _, ...userLogin } = user;

    return res.json({
      user: userLogin,
      token: token,
    });
  }

  async getProfile(req: Request, res: Response) {
    return res.json(req.user);
  }
}
