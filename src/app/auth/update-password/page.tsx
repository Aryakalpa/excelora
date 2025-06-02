import { Suspense } from 'react';
import UpdatePasswordForm from './UpdatePasswordForm';
import SearchParamsHandler from './SearchParamsHandler';

export default function UpdatePasswordPage() {
  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler onError={(error) => console.error(error)} />
      </Suspense>
      <UpdatePasswordForm />
    </>
  );
}
