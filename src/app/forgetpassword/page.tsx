'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { forget_password } from '@/app/graphql/user'; // Adjust path if needed

export default function ForgetPasswordForm() {
  const [email, setEmail] = useState('');
  const [validation, setValidation] = useState('');

  const [forgotPassword] = useMutation(forget_password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {data}  = await forgotPassword({ variables: { email } });

       setValidation(data.forgetpassword)

  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Send Reset Link
          </button>
          {validation? <div className='text-center text-red-500'>{validation}</div>:""}
        </form>
      </div>
    </div>
  );
}
