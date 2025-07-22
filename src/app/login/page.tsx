'use client';
import { signIn,getSession} from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage = () => {

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [validation, setValidation] = useState('');
  const router = useRouter();
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

        if(res?.ok){

      const session = await getSession();
      
      const role = session?.user?.role;

          if(role === "ADMIN"){

            router.push('/authorize/admin/dashboard')
          
          }else if(role === "CUSTOMER"){

            router.push('/authorize/client/dashboard')

          }


        }else{
          if(res?.error){
              
            setValidation(res?.error)
          }
        }

      
    } catch (error) {
      console.error(error);
    }
  };



 

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {validation && (
          <p className="text-red-500 text-center text-sm mb-4">{validation}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 text-white py-2 rounded-md hover:bg-amber-700 transition duration-300"
          >
            Sign In
          </button>
          forget password? <Link className='underline text-blue-500' href='/forgetpassword'>Forget password</Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
