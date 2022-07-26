import z from "zod"

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string(),
})

export const createUserOutPut = z.object({

  name: z.string(),
  email: z.string(),
})
export type CreateUserInput = z.TypeOf<typeof createUserSchema>

export const userOtpSchema = z.object({
  email: z.string(),
  redirect: z.string().default("/")
})

export type UserOtpInput = z.TypeOf<typeof userOtpSchema>