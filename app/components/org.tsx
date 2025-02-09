import React from "react";
import { Button } from "@/components/ui/button";

const Org = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white text-black space-x-12">
      <div className="w-1/4 h-[20vh] bg-blue-200 flex items-center justify-center rounded-xl">
        <Button variant="ghost" className="flex flex-col hover:bg-transparent">
          <div className="text-6xl">Create</div>
          <div className="text-xl">
            Do not have a organization? Join us now.
          </div>
        </Button>
      </div>
      <div className="w-1/4 h-[20vh] flex items-center justify-center bg-blue-300 rounded-xl">
        <Button
          variant="ghost"
          className="flex flex-col text-6xl hover:bg-transparent"
        >
          <div className="text-6xl">Join</div>
          <div className="text-xl">
            Already have a organization? Join us now.
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Org;
