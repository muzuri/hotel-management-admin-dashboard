import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
          // null = not logged in means when user is null means 
      //token and userData are null the user is not logged in
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        return token && userData ? JSON.parse(userData) : null;
      });
      const loginApi = async (username, password) => {
        // Fake login. In reality, you'd send a real fetch request.
        if (username === "admin" && password === "admin") {
          return {
            token: "fake-jwt-token-1234567890",  // pretend this came from server
            user: { username: "admin", role: "admin" },
          };
        } else {
          throw new Error("Invalid credentials");
        }
      };
    
      const login = async (username, password) => {
        // Call API
        const { token, user } = await loginApi(username, password);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        console.log('User is '+localStorage.getItem('user'))
        setUser(user);
      };
    
      const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      };

    // const login = (userData) => setUser(userData);
    // const logout = () => setUser(null);
  
    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => useContext(AuthContext);