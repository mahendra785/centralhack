"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import bg from "../../public/BG.svg";
import Signin from "../../app/(auth)/authactions/signin";
export default function Home() {
  const [animateText, setAnimateText] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const handleSignIn = async () => {
    try {
      await Signin();
    } catch (error) {
      console.error("Error during sign-in:", error);
    } finally {
    }
  };

  useEffect(() => {
    setTimeout(() => setAnimateText(true), 500);
    setTimeout(() => setShowButton(true), 2000);
  }, []);

  return (
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-black">
      <Image
        src={bg}
        alt="CentralHack"
        fill
        className="object-cover opacity-50"
      />
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: animateText ? "-180%" : "0%", opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute deutschlander text-[300px] text-white leading-[100px]"
      >
        SORT IQ
      </motion.div>
      {showButton && (
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute flex items-center justify-center px-6 py-3 bg-white text-black text-2xl font-bold rounded-xl shadow-lg hover:bg-gray-300"
          onClick={handleSignIn}
        >
          Get Started
        </motion.button>
      )}
    </div>
  );
}
