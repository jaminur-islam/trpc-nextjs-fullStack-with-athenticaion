import { router } from "@trpc/server";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateUserInput, UserOtpInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";

function VerifyToken({ hash }: { hash: string }) {
  const router = useRouter();

  const { data, isLoading } = trpc.useQuery([
    "users.verify_otp",
    {
      hash,
    },
  ]);

  if (!isLoading) {
    return (
      <div>
        <h1> Verify...</h1>
      </div>
    );
  }

  router.push(data?.redirect?.includes("login") ? "/" : data?.redirect || "/");

  return <p> Redirect... </p>;
}

const LoginForm = () => {
  const { handleSubmit, register } = useForm<UserOtpInput>();
  const router = useRouter();
  const hash = router?.asPath.split("#token=")[1];
  console.log(hash);
  const [success, setSuccess] = useState(false);
  const { mutate, error } = trpc.useMutation(["users.request_otp"], {
    onSuccess: () => {
      setSuccess(true);
    },
  });
  function onSubmit(values: UserOtpInput) {
    mutate({ ...values, redirect: router.asPath });
  }

  if (hash) {
    return (
      <div>
        <VerifyToken hash={hash} />
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}
        <h1 className="text-4xl">Login</h1>

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
    </div>
  );
};

export default LoginForm;
