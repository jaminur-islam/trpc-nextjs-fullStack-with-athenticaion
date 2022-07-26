import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { CreateUserInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";

function RegisterPage() {
  const { handleSubmit, register } = useForm<CreateUserInput>();
  const router = useRouter();

  const { mutate, error } = trpc.useMutation(["users.register_user"], {
    onSuccess: () => {
      router.push("/login");
    },
  });

  function onSubmit(values: CreateUserInput) {
    mutate(values);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}
        <h1 className="text-4xl">Register</h1>

        <input
          type="email"
          className="border border-gray-300 mt-5"
          placeholder="jane.doe@example.com"
          {...register("email")}
        />
        <br />
        <input
          className="border border-gray-300 mt-5"
          type="text"
          placeholder="Tom"
          {...register("name")}
        />
        <button
          className="bg-red-400 border border-gray-300 mt-5"
          type="submit"
        >
          Register
        </button>
      </form>

      <Link href="/login">Login</Link>
    </>
  );
}

export default RegisterPage;
