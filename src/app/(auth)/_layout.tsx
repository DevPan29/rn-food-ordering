import { uesAuth } from '@/providers/AuthProvider';
import {  Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { session } = uesAuth();

  // Auth Guard
  if (session) {
    return <Redirect href={'/'} />;
  }

  return <Stack />;
};