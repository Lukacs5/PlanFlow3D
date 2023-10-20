"use client";
import React, { useState } from "react";
import Login from "../components/login";
import Playgroud from "../components/playground";
import DynamicYourComponent from "@/components/dynamicComponentLoader";
import Register from "@/components/register";

const MasterPage = () => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      <div className="col-span-2">
        <DynamicYourComponent />
      </div>
      <div className="col-span-1 m-2 dark:bg-slate-800 bg-slate-400  rounded-xl items-center justify-center h-auto">
        <div className="m-2 bg-slate-600 rounded-xl flex justify-between items-center">
          <h1 onClick={() => location.reload()} className="m-2 text-5xl text-left text-white font-bold">PlanFlow3D</h1>
          <button
            className="bg-slate-500 hover:bg-slate-700 text-white p-2 rounded-md m-2"
            onClick={() => setIsToggled(!isToggled)}
          >
            
            {isToggled ? "SingIn" : "SingUp" }
          </button>
        </div>

        {isToggled ? <Register /> : <Login />}
      </div>
    </div>
  );
};

export default MasterPage;
