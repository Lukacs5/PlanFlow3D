import { useState } from "react";
import Link from "next/link";


function LoginForm() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      console.log("Sikeres bejelentkezés");
      setMessage("Sikeres bejelentkezés!");
      const data = await response.json();
      const token = data.token;  

      localStorage.setItem("token", token);
    } else {
      console.log("Hiba a bejelentkezés során");
      setMessage("Hiba a bejelentkezés során. Próbáld újra!");
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
            value={email}
            onChange={(e) => setemail(e.target.value)}
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
          
          {message && <div className="mt-4 text-center">{message}</div>}

        </div>
      </form>
    </div>
  );
}

export default LoginForm;
