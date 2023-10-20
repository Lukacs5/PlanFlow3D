import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    nickname: '',
    mobileNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      // További kód a válasz kezeléséhez (pl. hibaüzenetek, átirányítás, stb.)
    } catch (error) {
      console.error('Hiba a regisztráció közben:', error);
    }
  };

  return (
    <div className="p-8">
  <div className="by-white">
    <h2 className="text-3xl text-center text-white font-bold">Regisztráció</h2>
  </div>
  <form onSubmit={handleSubmit} className='text-black'>
    <div className="mb-4" >
      <label htmlFor="firstName" className="mb-2 block text-white">Keresztnév:</label>
      <input 
        type="text" 
        id="firstName" 
        name="firstName" 
        value={formData.firstName} 
        onChange={handleChange} 
        className="w-full p-4 rounded-full border border-gray-300"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="lastName" className="mb-2 block text-white">Vezetéknév:</label>
      <input 
        type="text" 
        id="lastName" 
        name="lastName" 
        value={formData.lastName} 
        onChange={handleChange} 
        className="w-full p-4 rounded-full border border-gray-300"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="password" className="mb-2 block text-white">Jelszó:</label>
      <input 
        type="password" 
        id="password" 
        name="password" 
        value={formData.password} 
        onChange={handleChange} 
        className="w-full p-4 rounded-full border border-gray-300"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="nickname" className="mb-2 block text-white">Becenév:</label>
      <input 
        type="text" 
        id="nickname" 
        name="nickname" 
        value={formData.nickname} 
        onChange={handleChange} 
        className="w-full p-4 rounded-full border border-gray-300"
      />
    </div>
    <div className="mb-8">
      <label htmlFor="mobileNumber" className="mb-2 block text-white">Mobil szám:</label>
      <input 
        type="text" 
        id="mobileNumber" 
        name="mobileNumber" 
        value={formData.mobileNumber} 
        onChange={handleChange} 
        className="w-full p-4 rounded-full border border-gray-300"
      />
    </div>
    <div className="flex justify-center items-center space-x-8 ">
      <button 
        type="submit" 
        className="bg-slate-500 hover:bg-slate-700 text-white p-4 rounded-full shadow-md hover:shadow-lg w-full"
      >
        Regisztráció
      </button>
    </div>
  </form>
</div>

  );
};

export default Register;
