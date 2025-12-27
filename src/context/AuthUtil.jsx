import {jwtDecode} from 'jwt-decode';

export const isTokenExpired=(token)=>{
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
}

export const handleRole=()=>{
      const userObj = sessionStorage.getItem('user');
      if(!userObj) return;
      const user = JSON.parse(userObj);
      return user
}