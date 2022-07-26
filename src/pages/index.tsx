import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, error, isLoading } = trpc.useQuery(["hello"]);

  if (isLoading) {
    return <div> loading ... </div>;
  }

  if (error) {
    return <div> {JSON.stringify(error)} </div>;
  }
  return <div>This is my first trpc app {JSON.stringify(data)}</div>;
};

export default Home;
