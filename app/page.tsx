"use client";

import { useSession } from "next-auth/react";
import Home from "./components/mainpage";
import Organization from "./components/organization";

export default function Page() {
  const { data: session } = useSession();

  return <div>{session ? <Organization /> : <Home />}</div>;
}
