import { useSelector } from "react-redux";

const ProtectedRoute = ({ accessCode: requiredAccess, children }) => {
  const userRole = useSelector((state) => state.user.Role);
  const userAccessCode = useSelector((state) => state.user.accessCode);

  // Admin / Org Admin → allow everything
  if (userRole === "Admin" || userRole === "Org Admin") return children;

  // Access code ALL_R → allow everything
  if (userAccessCode?.includes?.("ALL_R")) return children;

  // No requiredAccess → allow
  if (!requiredAccess || requiredAccess.length === 0) return children;

  const userCodes = Array.isArray(userAccessCode)
    ? userAccessCode
    : typeof userAccessCode === "string"
    ? userAccessCode.split(",")
    : [];

  const hasAccess = requiredAccess.some((acc) => userCodes.includes(acc));

  return hasAccess ? children : <div>Access Denied</div>;
};

export default ProtectedRoute;
