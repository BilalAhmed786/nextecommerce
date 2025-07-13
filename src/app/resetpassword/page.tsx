import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordForm';

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={<div>Loading reset form...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
