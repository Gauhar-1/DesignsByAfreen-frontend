
'use server';

import type { LoginInput, SignupInput, ForgotPasswordInput, AdminNewUserInput, AdminEditUserInput } from '@/lib/schemas/authSchemas';
import { addUser as apiAddUser, updateUserById as apiUpdateUser, blockUserById as apiBlockUser, unblockUserById as apiUnblockUser } from '@/lib/api';

export async function loginUser(data: LoginInput) {
  console.log('Server Action: Login attempt with phone number', data.phoneNumber);
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (data.password === 'password') { 
    return { success: true, message: 'Logged in successfully!', token: 'mock-jwt-token' };
  } else {
    return { success: false, message: 'Invalid phone number or password.' };
  }
}

export async function signupUser(data: Omit<SignupInput, 'confirmPassword'>) {
  console.log('Server Action: Signup attempt for', data.name, 'with email', data.email);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: 'Account created successfully! Please log in.', userId: 'mock-user-id' };
}

export async function logoutUser() {
  console.log('Server Action: Logout attempt');
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: 'Logged out successfully.' };
}

export async function requestPasswordReset(data: ForgotPasswordInput) {
  console.log('Server Action: Password reset requested for email', data.email);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: 'If an account with this email exists, a password reset link has been sent.' };
}

export async function adminCreateUser(data: AdminNewUserInput) {
  console.log('Server Action: Admin attempting to create user:', data);
  try {
    // The password from AdminNewUserInput is for initial setup; apiAddUser might hash it or handle it.
    // For our mock, we just pass the core user data.
    const { password, ...userData } = data; 
    const newUser = await apiAddUser(userData);
    return { success: true, message: `User ${newUser.name} created successfully with role ${newUser.role}.`, user: newUser };
  } catch (error) {
    console.error('Error in adminCreateUser:', error);
    return { success: false, message: 'Failed to create user. An unexpected error occurred.' };
  }
}

export async function adminUpdateUser(userId: string, data: AdminEditUserInput) {
  console.log('Server Action: Admin attempting to update user:', userId, data);
  try {
    const updatedUser = await apiUpdateUser(userId, data);
    if (updatedUser) {
      return { success: true, message: `User ${updatedUser.name} (ID: ${userId}) updated successfully.`, user: updatedUser };
    }
    return { success: false, message: 'User not found or failed to update.' };
  } catch (error) {
    console.error('Error in adminUpdateUser:', error);
    return { success: false, message: 'Failed to update user. An unexpected error occurred.' };
  }
}

export async function adminBlockUser(userId: string) {
  console.log('Server Action: Admin attempting to BLOCK user:', userId);
  try {
    const user = await apiBlockUser(userId);
    if (user) {
      return { success: true, message: `User ID "${userId}" has been blocked.`, user };
    }
    return { success: false, message: `User ID "${userId}" not found.` };
  } catch (error) {
    console.error('Error in adminBlockUser:', error);
    return { success: false, message: 'An unexpected error occurred while blocking user.' };
  }
}

export async function adminUnblockUser(userId: string) {
  console.log('Server Action: Admin attempting to UNBLOCK user:', userId);
   try {
    const user = await apiUnblockUser(userId);
    if (user) {
      return { success: true, message: `User ID "${userId}" has been unblocked.`, user };
    }
    return { success: false, message: `User ID "${userId}" not found.` };
  } catch (error) {
    console.error('Error in adminUnblockUser:', error);
    return { success: false, message: 'An unexpected error occurred while unblocking user.' };
  }
}
