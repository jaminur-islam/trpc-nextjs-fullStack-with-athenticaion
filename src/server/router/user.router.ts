import { createUserOutPut, createUserSchema, userOtpSchema } from "../../schema/user.schema";
import { createRouter } from "../createRouter";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import * as trpc  from "@trpc/server";
import { sendLoginEmail } from "../../utils/mailer";
import {url} from "../../../src/constants"
import { encode } from "../../utils/base64";

export const userRouter =  createRouter().mutation("register_user" , {
  input: createUserSchema,
  async resolve({ctx , input}){
    const {email, name} = input
   try{
    const user = await ctx.prisma.user.create({data:{email , name }})
    return user
   }catch(e){
    if(e instanceof PrismaClientKnownRequestError){
         if(e.code === "P2002"){
          throw new trpc.TRPCError({
            code : "CONFLICT",
            message: 'User already exists'
          })
         }
    }
    throw new trpc.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:"Something went wrong "
    })
   }
  }
}).mutation("request_otp" , {
  input: userOtpSchema,
  async resolve({ctx , input}){

  
    const {email , redirect} = input;
    const user = await ctx.prisma.user.findUnique({
      where: {
        email
      }
    })
    if(!user){
      throw new trpc.TRPCError({
        code : 'NOT_FOUND',
        message: "user not found"
      })
    }

    const token = await ctx.prisma.loginToken.create({
      data: {
        redirect,
        userId: user.id
       /*  user: {
          connect: {
            id: user.id,
          },
        }, */
      },
    })
    console.log(token)
  
   const dk = encode(`${token.id}:${user.email}`);
   console.log("my token dk " , dk)
    await sendLoginEmail({
      token: encode(`${token.id}:${user.email}`),
      url: url,
      email: user.email    
    })

    return true
  }
})