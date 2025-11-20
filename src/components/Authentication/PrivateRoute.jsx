import { useContext } from 'react';
import { Navigate } from "react-router-dom";
import { AuthContext }  from "../../context/AuthContext";
import * as jwt_decode from 'jwt-decode';


const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  
//   const isTokenValid = () => {
//     if (!token) return false;

//     try {
//         console.log("Is Token Valid "+isTokenValid)
//         const decoded = jwt_decode.default(token);
//       const currentTime = Date.now() / 1000;
      
//       return decoded.exp > currentTime;
//     } catch (error) {
//       return false;
//     }

//   }
  if (!token) {
    return null;
  }

  return children;
};

export default PrivateRoute;