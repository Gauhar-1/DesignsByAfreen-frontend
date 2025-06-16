
import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});
export type LoginInput = z.infer<typeof loginSchema>;

// Base schema for signup form data
const signupObjectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
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

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address. Please enter a valid email to reset your password.'),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Admin New User Schema
export const adminNewUserSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.enum(["Customer", "Admin"]).default("Customer"),
});
export type AdminNewUserInput = z.infer<typeof adminNewUserSchema>;

// Admin Edit User Schema (Password is not included for edit form simplicity)
export const adminEditUserSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  role: z.enum(["Customer", "Admin"], { required_error: "Role is required." }),
});
export type AdminEditUserInput = z.infer<typeof adminEditUserSchema>;
