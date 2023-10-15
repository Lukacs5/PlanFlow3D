"use client";
import React, { useState } from "react";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
      <div className=" p-8">
        <div className="by-white">
          <h1 className="text-5xl mb-1 text-center">PlanFlow3D</h1>
          <h2 className="text-1xl mb-8 text-center">Draw your own home</h2>
          {/* Ide tudod elhelyezni egyéb tartalmat, ha szükséges */}
        </div>

        <div className="mb-4">
          <label className="mb-2 block">User Name</label>
          <input
            type="text"
            placeholder="Felhasználónév"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 rounded-full border border-gray-300"
          />
        </div>
        <div className="mb-8">
          <label className="mb-2 block">Password</label>
          <input
            type="password"
            placeholder="Jelszó"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-full border border-gray-300"
          />
        </div>
        <div className="flex justify-center items-center space-x-8 ">
          <button className="bg-slate-500 hover:bg-slate-700 text-white p-4 rounded-full shadow-md hover:shadow-lg">
            SingIn
          </button>

          <button className="bg-slate-500 hover:bg-slate-700 text-white p-4 rounded-full shadow-md hover:shadow-lg">
            SingUP
          </button>
        </div>
      </div>
  );
};

export default LoginForm;
