import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: string;
  exp: number;
  iat: number;
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getUserIdFromToken(): string | null {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.userId;
  } catch (e) {
    console.error('Failed to decode token', e);
    return null;
  }
}
