import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ accessCode, children }) => {
  const userAccess = useSelector((state) => state.user.accessCode); // ex: ["PROJ_VW"]

  const hasAccess = accessCode.some(code => userAccess.includes(code));

  return hasAccess ? children : <Navigate to="/adminDashboard/noaccess" />;
};



export default ProtectedRoute;
