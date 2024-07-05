import { Express, Request, RequestHandler, Response } from "express"
import ReadTodosByUserId from "@/core/todo/services/ReadTodosByUserId";

export default class ReadTodosByUserIdController {
  constructor(
    webServer: Express,
    useCase: ReadTodosByUserId,
    ...middlewares: RequestHandler[]
  ) {

    webServer.get("/api/todos/:userId", ...middlewares, async (req: Request, res: Response) => {
      try {
        const todoList = await useCase.execute(req.params.userId)

        res.status(200).send(todoList)
      } catch (error: any) {
        res.status(400).send(error.message)
      }
    })
  }
}
