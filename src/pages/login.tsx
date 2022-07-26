import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateUserInput, UserOtpInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";

const Login = () => {
  const { handleSubmit, register } = useForm<UserOtpInput>();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const { mutate, error } = trpc.useMutation(["users.request_otp"], {
    onSuccess: () => {
      setSuccess(true);
    },
  });
  function onSubmit(values: UserOtpInput) {
    mutate(values);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}
        <h1 className="text-4xl">Register</h1>

        {success && <div> Checked Your Email</div>}

        <input
          type="email"
          className="border border-gray-300 mt-5"
          placeholder="jane.doe@example.com"
          {...register("email")}
        />
        <br />

        <button
          className="bg-red-400 border border-gray-300 mt-5"
          type="submit"
        >
          Login
        </button>
      </form>

      <Link href="/register">Register </Link>
    </>
  );
};

export default Login;
