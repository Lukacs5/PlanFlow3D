import React, { useState } from "react";
import ErrorRenderer from "./inputHelpers/ErrorRenderer";
import ButtonTransfer from "./inputHelpers/buttonTransfer";


const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    email: "",
    privacyPolicy: false,
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    email: "",
    privacyPolicy: "",
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [token, setToken] = useState(null);

  const checkEmailAvailability = async (email: string) => {
    try {
      
      const response = await fetch(`/api/checkEmail?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
  
      if (data.isTaken) {
        return "Ez az e-mail cím már foglalt.";
      }
    } catch (error) {
      console.error("Hiba az e-mail cím ellenőrzése közben.");
    }
    return "";
  };
  
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let errorMessage = "";
  
    switch (name) {
      case "firstName":
      case "lastName":
        if (/[^a-zA-Z\sáÁéÉíÍóÓöÖőŐúÚüÜűŰ]/.test(value)) {
          errorMessage = "Nem megengedett karakter.";
        }
        break;
      case "privacyPolicy":
        if (!value) {
          errorMessage = "Az adatvédelmi nyilatkozat elfogadása kötelező.";
        }
        break;
      case "password":
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d-!@#$%^&*()_+[\]{};':"\\|,.<>/?áéíóöőúüűÁÉÍÓÖŐÚÜŰ]{8,}$/;
        if (!passwordRegex.test(value)) {
          errorMessage =
            "A jelszó minimum 8 karakter hosszú legyen, tartalmazzon legalább 1 nagybetűt, 1 kisbetűt és 1 számot.";
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          errorMessage = "A jelszavak nem egyeznek meg.";
        }
        break;
      case "email":
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          errorMessage = "Nem megfelelő formátum.";
        } else {
          errorMessage = await checkEmailAvailability(value);
        }
        break;
      default:
        break;
    }
  
    const updatedFormData = { ...formData, [name]: value };
    const updatedErrors = { ...errors, [name]: errorMessage };
    const hasErrors = Object.values(updatedErrors).some((error) => !!error);
  
    setFormData(updatedFormData);
    setErrors(updatedErrors);
    setHasError(hasErrors);
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

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);  // Állítsd be az állapotot a token értékével
        setRegistrationSuccess(true);
      }
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
      {registrationSuccess ? (
        <div className="text-center mt-4 text-white font-bold">
          {" "}
          Sikeres regisztráció! Üdvözlünk!
          <ButtonTransfer token={token} onRedirect={() => setRegistrationSuccess(true)} />

        </div>
      ) : (
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
            <label htmlFor="confirmPassword" className="mb-2 block text-white">
              Jelszó megerősítése:
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-4 rounded-full border border-gray-300"
            />
            {errors.confirmPassword && (
              <ErrorRenderer message={errors.confirmPassword} />
            )}
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
          <div className="mb-4">
            <input
              type="checkbox"
              id="privacyPolicy"
              name="privacyPolicy"
              required
            />
            <label
              htmlFor="privacyPolicy"
              className="ml-2 inline-block text-white"
            >
              Elfogadom az{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Adatvédelmi Nyilatkozatot
              </a>
              .
            </label>
            {errors.privacyPolicy && (
              <ErrorRenderer message={errors.privacyPolicy} />
            )}
          </div>
          <div className="flex justify-center items-center space-x-8 ">
            <button
              type="submit"
              disabled={hasError}
              className="bg-slate-500 hover:bg-slate-700 text-white p-4 rounded-full shadow-md hover:shadow-lg w-full"
            >
              Regisztráció
            </button>
            {hasError && <ErrorRenderer message={"hiányó adatok"} />}
          </div>
        </form>
      )}
    </div>
  );
};

export default Register;
