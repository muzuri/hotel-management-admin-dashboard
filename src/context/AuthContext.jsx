import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
          // null = not logged in means when user is null means 
      //token and userData are null the user is not logged in
      const [token, setToken] = useState(() => localStorage.getItem("token"));
       const [user, setUser] = useState(null);
    // const [user, setUser] = useState(() => {
    //    setToken(localStorage.getItem("token"));
    //     const userData = localStorage.getItem("user");
    //     return token && userData ? JSON.parse(userData) : null;
    //   });
   
      
      const handleLogin = async (email, password) => {
        const res = await fetch("http://localhost:8080/api/hotel/public/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
    
        const data = await res.json();
        // console.log(res.data)
        if (data.token) {
        setToken(data.token)
        localStorage.setToken("token", data.token);
        } else {
          alert("Login failed");
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
        // Call API
        // const { token, user } = await handleLogin(email, password);
        await handleLogin(email,password)
        // localStorage.setItem("token", token);
        // localStorage.setItem("user", JSON.stringify(user));
        // console.log('User is '+localStorage.getItem('user'))
        // setUser(user);
        // setToken(token)
      };
    
      const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
      };
    
      // const isAuthenticated = !!token;
  
    return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => useContext(AuthContext);