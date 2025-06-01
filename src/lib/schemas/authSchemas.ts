
import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
  phoneNumber: z.string().min(7, 'Phone number must be at least 7 digits.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});
export type LoginInput = z.infer<typeof loginSchema>;

// Base schema for signup form data
const signupObjectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters.'),
});

// Type for the data argument in the refine callback
type SignupObjectInput = z.infer<typeof signupObjectSchema>;

// Validation function for password confirmation
const validatePasswords = (data: SignupObjectInput) => {
  return data.password === data.confirmPassword;
};

// Signup Schema with refined validation
export const signupSchema = signupObjectSchema.refine(validatePasswords, {
  message: "Passwords don't match.",
  path: ['confirmPassword'], // Path of error
});
export type SignupInput = z.infer<typeof signupSchema>;
