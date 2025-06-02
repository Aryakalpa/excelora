"use client";

import type React from 'react';

// This component can be expanded to include context providers (e.g., Supabase session context if needed for client components deeply)
// For now, it just passes children through. Supabase auth state can often be read directly in components.
const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default AppProviders;
