import { useState, useEffect } from "react";

function LoginForm() {
  
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      console.log("Sikeres bejelentkezés");
      const data = await response.json();
      const token = data.token;  
      localStorage.setItem("token", token);
      localStorage.setItem('userEmail', data.email); 
      // Jelzés a navigációhoz
      setShouldNavigate(true);
      
    } else {
      console.log("Hiba a bejelentkezés során");
      setMessage("Hiba a bejelentkezés során. Próbáld újra!");
    }
  };

  useEffect(() => {
    if (shouldNavigate) {
      window.location.href = "/bluePrint";
    }
  }, [shouldNavigate]);



  return (
    <div className=" p-2">
      <div className="by-white">
      <h1 className="m-2 text-3xl text-center text-white font-bold ">LoginPage</h1>
        <h2 className="text-1xl mb-8 text-center">Rajzolja le otthonát</h2>
        {/* Ide tudod elhelyezni egyéb tartalmat, ha szükséges */}
      </div>
      <div className=" my-4 block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2 block">E-mail</label>
          <input
            type="text"
            placeholder="email"
            required
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="w-full p-4 rounded-lg border border-gray-300 text-black"  
          />
        </div>
        <div className="mb-8">
          <label className="mb-2 block">Jelszó</label>
          <input
            type="password"
            placeholder="Jelszó"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-lg border border-gray-300 text-black"
          />
        </div>
        <div className="flex justify-center items-center space-x-8 ">
          <button
            type="submit"
            className="bg-slate-500 hover:bg-slate-700 text-white p-4 rounded-lg shadow-md hover:shadow-lg w-full" 
          >
            SignIn
          </button>
          
          {message && <div className="mt-4 text-center">{message}</div>}

        </div>
      </form></div>
    </div>
  );
}

export default LoginForm;
