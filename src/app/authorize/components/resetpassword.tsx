'use client';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { change_password } from '@/app/graphql/user';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [oldpassword, setOldpassword] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const { data: session, status } = useSession();
  const [resetPassword, { loading }] = useMutation(change_password);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) return


    try {
      const { data } = await resetPassword({
        variables: {
          id: session?.user.id,
          oldpassword,
          newpassword,
        },
      });

      setMessage(data.changePassword?.message);

      if (data.resetPassword?.message === 'Password updated successfully.') {

        setNewPassword('')
        setOldpassword('')


      }


    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow w-[80%]">
      <h1 className="text-xl font-bold mb-4 text-center text-blue-700">Reset Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Old password"
          className="w-full px-4 py-2 border rounded"
          value={oldpassword}
          onChange={(e) => setOldpassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full px-4 py-2 border rounded"
          value={newpassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-amber-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Reset Password'}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      {message === 'Incorrect old password' ? (
        <div className="flex justify-center items-center gap-2 text-blue-700 mt-3">
          <p className='text-lg text-black'>Forget password?</p>
          <Link
            className="inline-block px-4 py-2 bg-amber-600 text-white rounded"
            href="http://localhost:3000/forgetpassword"
          >
           Forget password
          </Link>
        </div>
      ) : null}
    </div>
  );
}
