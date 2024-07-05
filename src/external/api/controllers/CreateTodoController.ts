import { Express, RequestHandler, Response } from "express"
import { ReqWithUser } from "../middlewares/authMiddleware";
import CreateTodo from "@/core/todo/services/CreateTodo";

export default class CreateTodoController {
  constructor(
    webServer: Express,
    useCase: CreateTodo,
    ...middlewares: RequestHandler[]
  ) {

    webServer.post("/api/todos/create", ...middlewares, async (req: ReqWithUser, res: Response) => {
      try {
        await useCase.execute({
          userId: req.user!.id,
          title: req.body.title,
          description: req.body.description
        })

        res.status(201).send()

      } catch (error: any) {
        res.status(400).send(error.message)
      }
    })
  }
}
