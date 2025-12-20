import {useContext, useState, useEffect} from "react";
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
          // null = not logged in means when user is null means 
      //token and userData are null the user is not logged in
      // const [token, setToken] = useState(() => localStorage.getItem("token"));
      //  const [user, setUser] = useState(null);
    // const [user, setUser] = useState(() => {
    //    setToken(localStorage.getItem("token"));
    //     const userData = localStorage.getItem("user");
    //     return token && userData ? JSON.parse(userData) : null;
    //   });
      const [token, setToken] = useState(null);
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        // Check for stored user on mount
        // sessionStorage.clear()
        const token = sessionStorage.getItem('token');
        if (token) {
          setToken(JSON.parse(token));
        }
        setLoading(false);
      }, []);

      const handleLogin = async (email, password) => {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/hotel/public/generateToken`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        console.log("------>", data.token)
        if (data.status==1 && data.user.role !=='CUSTOMER') {
          setToken(data.token)
          sessionStorage.setItem("token", JSON.stringify(data.token));
          sessionStorage.setItem("user", JSON.stringify(data.user));
          console.log(data.token)
          return { success: true };
        }else if (data.user.role ==='CUSTOMER') {
          return { success: false, message: 'User not authorized' };
        } else {
          console.log("Login failed");
          // sessionStorage.setItem("message", JSON.stringify(data.error));
          if(data.error === 'Bad credentials')
          return { success: false, message: 'Invalid e-Mail or Password' };
          else
            return {success: false, message: data.error}
        }
      };
    //   const loginApi = async (email, password) => {
    //     // Fake login. In reality, you'd send a real fetch request.
    //     if (username === "admin" && password === "admin") {
    //       return {
    //         token: "fake-jwt-token-1234567890",  // pretend this came from server
    //         user: { username: "admin", role: "admin" },
    //       };
    //     } else {
    //       throw new Error("Invalid credentials");
    //     }
    //   };
    
      const login = async (email, password) => {
        console.log(email, password)
        // Call API
        // const { token, user } = await handleLogin(email, password);
        return await handleLogin(email,password)
        // localStorage.setItem("token", token);
        // localStorage.setItem("user", JSON.stringify(user));
        // console.log('User is '+localStorage.getItem('user'))
        // setUser(user);
        // setToken(token)
      };
    
      const logout = () => {
        setToken(null);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      };
    
      // const isAuthenticated = !!token;
  
    return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
    );
  };
  export default AuthProvider;
//   export const useAuth = () => useContext(AuthContext);