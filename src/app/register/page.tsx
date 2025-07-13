'use client'
import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { register_user } from "../graphql/user";
import { useRouter } from "next/navigation";


interface FormData {
  name: string;
  email: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  
  const router = useRouter()
  const [error, setError] = useState<string>("");
  const [registerUser] = useMutation(register_user);
  const [validation,setValidation]= useState('')

  

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

  setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    try{

        const result = await registerUser({

            variables:formData
        })
        if(result.data.registerUser.message){

          setValidation(result.data.registerUser.message)
        }else{
        
            router.push('/authorize/login')

        }

    }catch(error){


        console.log(error)
    }
  


  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="w-full px-4 py-2 border rounded-md"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full px-4 py-2 border rounded-md"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full px-4 py-2 border rounded-md"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
            />
          </div>
         {validation ? <div className="text-center text-red-500">{validation}</div>:""}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
