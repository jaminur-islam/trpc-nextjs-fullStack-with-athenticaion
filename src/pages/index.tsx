import type { NextPage } from "next";
import Link from "next/link";
import LoginForm from "../components/LoginFrom";
import { useUserContext } from "../context/user.context";

const Home: NextPage = () => {
  const user = useUserContext();

  console.log(user);

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div>
      <Link href={"/posts"}>CreatePost</Link>
    </div>
  );
};

export default Home;
