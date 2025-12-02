export const hasAccess = (accessCode, role = '', requiredCode) => {
  // Normalize accessCode to always be an array
  let codes = [];

  if (Array.isArray(accessCode)) {
    codes = accessCode;
  } else if (typeof accessCode === 'string') {
    codes = accessCode.split(',').map((c) => c.trim());
  }

  // Role-based override
  if (role === 'Org Admin') return true;

  if (codes.length === 0) return false;

  // Full access
  if (codes.includes('ALL_R')) return true;
  if (codes.includes('P_T')) return true;

  // Check specific permission
  return codes.includes(requiredCode);
};
