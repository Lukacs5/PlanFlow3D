import React, { useState } from "react";
import ErrorRenderer from "./inputHelpers/ErrorRenderer";

const Register = () => {
    
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    nickname: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    password: "",
    nickname: "",
    email: "",
  });

  const [hasError, setHasError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors, [name]: errorMessage };
      // ellenőrizd, hogy vannak-e hibák
      const errorValues = Object.values(newErrors);
      const hasErrors = errorValues.some((error) => !!error);
      setHasError(hasErrors);
      return newErrors;
    });

    let errorMessage = "";

    switch (name) {
      case "firstName": 
        if (/[^a-zA-Z\sáÁéÉíÍóÓöÖőŐúÚüÜűŰ]/.test(value)) {
          errorMessage = "Nem megengedett karakter.";
        }
      case "lastName":
        if (/[^a-zA-Z\sáÁéÉíÍóÓöÖőŐúÚüÜűŰ]/.test(value)) {
          errorMessage = "Nem megengedett karakter.";
        }
        break;
      case "nickname":
        // Itt lehet API hívást is csinálni, hogy ellenőrizze az egyediséget
        break;
      case "email":
        // Az érvényes telefon szám formátum ellenőrzése
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          errorMessage = "Nem megfelelő formátum.";
        }
        break;
    }

    // Hiba állapot frissítése
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));

    // Adatok frissítése
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    

  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (hasError) {
      console.error("A form tartalmaz hibákat!");
      return;
    }

    
    try {
      const response = await fetch("/api/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      // További kód a válasz kezeléséhez (pl. hibaüzenetek, átirányítás, stb.)
    } catch (error) {
      console.error("Hiba a regisztráció közben:", "warning");
    }
  };

  return (
    <div className="p-8">
      <div className="by-white">
        <h2 className="text-3xl text-center text-white font-bold">
          Regisztráció
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="text-black">
        <div className="mb-4">
          <label htmlFor="firstName" className="mb-2 block text-white">
            Keresztnév:
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-4 rounded-full border border-gray-300"
          />
          {errors.firstName && <ErrorRenderer message={errors.firstName} />}
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="mb-2 block text-white">
            Vezetéknév:
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-4 rounded-full border border-gray-300"
          />
          {errors.lastName && <ErrorRenderer message={errors.lastName} />}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-white">
            Jelszó:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full p-4 rounded-full border border-gray-300"
          />
          {errors.password && <ErrorRenderer message={errors.password} />}
        </div>
        <div className="mb-4">
          <label htmlFor="nickname" className="mb-2 block text-white">
            Becenév:
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            required
            value={formData.nickname}
            onChange={handleChange}
            className="w-full p-4 rounded-full border border-gray-300"
          />
          {errors.nickname && <ErrorRenderer message={errors.nickname} />}
        </div>
        <div className="mb-8">
          <label htmlFor="email" className="mb-2 block text-white">
            Email:
          </label>
          <input
            type="text"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-4 rounded-full border border-gray-300"
          />
          {errors.email && <ErrorRenderer message={errors.email} />}
        </div>
        <div className="flex justify-center items-center space-x-8 ">
          <button
            type="submit"
            disabled={hasError}
            className="bg-slate-500 hover:bg-slate-700 text-white p-4 rounded-full shadow-md hover:shadow-lg w-full"
          >
            Regisztráció
          </button>
          { hasError &&<ErrorRenderer message={"hiányó adatok"} />}
        </div>
      </form>
    </div>
  );
};

export default Register;
