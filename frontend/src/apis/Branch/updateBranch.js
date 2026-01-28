export const updateBranch = async ({
  orgId,
  branchId,
  email,
  status,
}) => {
  const response = await fetch(
    "http://localhost:3001/api/updateBranch",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orgId,
        branchId,
        email,
        status,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to update branch");
  }

  return response.json();
};
