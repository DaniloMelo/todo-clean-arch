import errors from "../../../core/shared/errors";
import IUser from "@/core/user/models/IUser";
import IUserRepository from "@/core/user/services/IUserRepository";
import JwtService from "../../auth/JwtService";
import { NextFunction, Request, Response } from "express";

export interface ReqWithUser extends Request {
  user?: IUser
}

export default function authMiddleware(userRepository: IUserRepository) {
  return async (req: ReqWithUser, res: Response, next: NextFunction) => {
    const accessDenied = () => res.status(403).send(errors.ACCESS_DENIED)

    const token = req.headers.authorization?.replace("bearer", "")
    if (!token) {
      accessDenied()
      return
    }

    const jwtService = new JwtService(process.env.JWT_SECRET!)
    const jwtPayloadData = jwtService.verify(token) as IUser

    const dbUser = await userRepository.readByEmail(jwtPayloadData.email)
    if (!dbUser) {
      accessDenied()
      return
    }

    req.user = dbUser

    next()
  }
}
