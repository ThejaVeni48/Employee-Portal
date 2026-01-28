export const createHolidays = async (payload) => {

    console.log("payload",payload);
    
  const response = await fetch(
    "http://localhost:3001/api/addProject",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add user");
  }

  return data;
};
