import { router } from "@trpc/server";
import dynamic from "next/dynamic";
import React, { useState } from "react";

const LoginForm = dynamic(() => import("../components/LoginFrom"), {
  ssr: false,
});
const login = () => {
  return <LoginForm />;
};

export default login;
