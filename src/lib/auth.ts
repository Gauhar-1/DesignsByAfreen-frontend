import { jwtDecode } from 'jwt-decode';


export function getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
  if (!token || token.split('.').length !== 3) {
    console.warn('Invalid or missing token');
    return null;
  }

  try {
    const decoded = jwtDecode<{ id: string }>(token);
    if(!decoded.id){
      console.log("Couldn't get the decoded userId")
      return null;
    }
    return decoded.id;
  } catch (e) {
    console.error('Failed to decode token', e);
    return null;
  }
}


export function getUserRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
  if (!token || token.split('.').length !== 3) {
    console.warn('Invalid or missing token');
    return null;
  }

  try {
    const decoded = jwtDecode<{ role: string }>(token);
    if(!decoded.role){
      console.log("Couldn't get the decoded Role")
      return null;
    }
    return decoded.role;
  } catch (e) {
    console.error('Failed to decode token', e);
    return null;
  }
}
