import { createRouter} from "../createRouter"
import { postRouter } from "./postRouter"
import { userRouter } from "./user.router"

export const appRouter = createRouter().merge("users." ,userRouter).merge("posts." , postRouter)

export type AppRouter = typeof appRouter