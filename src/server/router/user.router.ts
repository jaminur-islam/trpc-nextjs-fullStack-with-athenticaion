import {  createUserSchema, userOtpSchema, varifyOptSchema } from "../../schema/user.schema";
import { createRouter } from "../createRouter";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import * as trpc  from "@trpc/server";
import { sendLoginEmail } from "../../utils/mailer";
import {baseUrl, url} from "../../../src/constants"
import { decode, encode } from "../../utils/base64";
import { singJwt } from "../../utils/jwt";
import { serialize } from "cookie";


export const userRouter =  createRouter().mutation("register_user" , {
  input: createUserSchema,
  async resolve({ctx , input}){
    const {email, name} = input
   try{
    const user = await ctx.prisma.user.create({data:{email , name }})
    return user
   }catch(e){
    console.log(e)
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
        // userId: user.id
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    })  
   const dk = encode(`${token.id}:${user.email}`);
   console.log("my token dk " , dk)
    await sendLoginEmail({
      token: encode(`${token.id}:${user.email}`),
      url: baseUrl,
      email: user.email    
    })

    return true
  }
}).query('verify_otp' ,{
  input : varifyOptSchema,
  async resolve({input , ctx}){
  const decoded = await decode(input.hash).split(":");
  const {email , id} = decoded;
  const token = await ctx.prisma.loginToken.findFirst({
    where: {
      id,
      user: {
        email,
      },
    },
    include: {
      user: true,
    },
  })

  if(!token){
    throw new trpc.TRPCError({
      code: "FORBIDDEN",
      message: "Invalid token"
    })
  }

  const jwt = singJwt({
    email: token.user?.email,
    id: token.user?.id
  })

  ctx.res.setHeader("Set-Cookie" , serialize('token' , jwt , {path: "/"}))


  return {
    redirect: token.redirect
  }
  
 
  }
}).query("me" , {
  resolve({ctx}){
    return ctx.user
  }
})
