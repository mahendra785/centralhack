"use client";

import { useRouter } from "next/navigation";
import SignOut from "../(auth)/authactions/signout";

export default function SignOutPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await SignOut();
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <button
        onClick={handleSignOut}
        className="px-6 py-3 bg-white text-black text-2xl font-bold rounded-xl shadow-lg hover:bg-gray-300"
      >
        Sign Out
      </button>
    </div>
  );
}
