import { useState } from "react";
import Link from "next/link";

function LoginForm() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, password }),
    });

    if (response.ok) {
      console.log("Sikeres bejelentkezés");
    } else {
      console.log("Hiba a bejelentkezés során");
    }
  };

  return (
    <div className=" p-8">
      <div className="by-white">
      <h1 className="m-2 text-3xl text-center text-white font-bold ">LoginPage</h1>
        <h2 className="text-1xl mb-8 text-center">Draw your own home just login first</h2>
        {/* Ide tudod elhelyezni egyéb tartalmat, ha szükséges */}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2 block">Username</label>
          <input
            type="text"
            placeholder="Felhasználónév"
            required
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-4 rounded-full border border-gray-300"
          />
        </div>
        <div className="mb-8">
          <label className="mb-2 block">Password</label>
          <input
            type="password"
            placeholder="Jelszó"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-full border border-gray-300"
          />
        </div>
        <div className="flex justify-center items-center space-x-8 ">
          <button
            type="submit"
            className="bg-slate-500 hover:bg-slate-700 text-white p-4 rounded-full shadow-md hover:shadow-lg w-full" 
          >
            SingIn
          </button>
          
          
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
