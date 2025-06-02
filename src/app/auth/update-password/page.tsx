import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const UpdatePasswordForm = dynamic(() => import('./UpdatePasswordForm'), {
  ssr: false
});

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdatePasswordForm />
    </Suspense>
  );
}
