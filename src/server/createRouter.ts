import {router} from "@trpc/server";
import superjson from "superjson";
import { Context } from "./createContext";

// todo add appRouter to generic [add Context]
export function createRouter(){
  return router<Context>().transformer(superjson)
}