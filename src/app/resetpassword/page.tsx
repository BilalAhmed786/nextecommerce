'use client';
import { useMutation } from '@apollo/client';
import { reset_password } from '@/app/graphql/user';
import { useState,use } from 'react';

export default function ResetPasswordForm({searchParams}:{searchParams:Promise<{token:string}>}) {
  
  const {token} = use(searchParams)

  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');

  const [resetPassword, { loading }] = useMutation(reset_password, {
    onCompleted: (data) => setStatus(data.resetPassword.message),
    onError: (error) => setStatus(error.message),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return setStatus('Password is required');
    if (!token) return setStatus('Missing token');
    resetPassword({ variables: { token, newPassword } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        {status && <p className="text-center text-sm mb-4 text-blue-600">{status}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
