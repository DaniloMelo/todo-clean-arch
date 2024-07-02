import dotenv from "dotenv"
import express, { Request, Response } from "express"
import RegisterUserController from "./external/api/RegisterUserController"
import RegisterUser from "./core/user/services/RegisterUser"
import UserRepository from "./external/database/UserRepository"
import BcryptCryptography from "./external/auth/BcryptCryptography"
import LoginUser from "./core/user/services/LoginUser"
import LoginUserController from "./external/api/LoginUserController"

dotenv.config({ path: ".env.development" })

const app = express()
const PORT = process.env.API_PORT ?? 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello World!!!</h1>")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


const userRepository = new UserRepository()
const bcryptCryptography = new BcryptCryptography()

const registerUserUseCase = new RegisterUser(userRepository, bcryptCryptography)
const loginUserUseCase = new LoginUser(userRepository, bcryptCryptography)

new RegisterUserController(app, registerUserUseCase)
new LoginUserController(app, loginUserUseCase)
