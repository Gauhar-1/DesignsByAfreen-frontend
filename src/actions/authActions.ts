
'use server';

import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});
export type LoginInput = z.infer<typeof loginSchema>;

// Signup Schema
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters.'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'], // Path of error
});
export type SignupInput = z.infer<typeof signupSchema>;


export async function loginUser(data: LoginInput) {
  console.log('Server Action: Login attempt with', data.email);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  // TODO: Implement actual Firebase login
  // For now, let's simulate a success or failure
  if (data.password === 'password') { // Mock success
    return { success: true, message: 'Logged in successfully!', token: 'mock-jwt-token' };
  } else {
    return { success: false, message: 'Invalid email or password.' };
  }
}

export async function signupUser(data: Omit<SignupInput, 'confirmPassword'>) {
  console.log('Server Action: Signup attempt for', data.name, 'with email', data.email);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  // TODO: Implement actual Firebase signup
  // For now, let's simulate success
  return { success: true, message: 'Account created successfully! Please log in.', userId: 'mock-user-id' };
}

export async function logoutUser() {
  console.log('Server Action: Logout attempt');
  // TODO: Implement actual Firebase logout & client-side token removal
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: 'Logged out successfully.' };
}
