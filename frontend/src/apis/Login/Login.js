export const categoryLoginApi = async ({
  email,
  password,
  id,
}) => {
  const res = await fetch(
    "http://localhost:3001/api/categoryLogin",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        id,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw data; // important for onError
  }

  return data;
};
