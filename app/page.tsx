"use client";
import React, { useState } from "react";
import Login from "../components/login";
import Playgroud from "../components/playground";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="grid grid-cols-3 gap-4 h-full">

     
      <div className="col-span-2">
        <Playgroud/>
      </div>
      <div className=" flex col-span-1 m-2 dark:bg-slate-800 bg-slate-400  rounded-xl items-center justify-center h-auto">
        <Login /> {/* Helyezd el itt a Login komponenst */}
      </div>
      
    </div>
  );
};

export default LoginForm;
