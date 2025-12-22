export const loadUserFromLocalStorage = () => {
  // console.log("Loading from LS...");  
  try {
const storedData = localStorage.getItem("userState"); 
    console.log("Found:", storedData);

    if (!storedData) return null;

    return JSON.parse(storedData);
  } catch (err) {
    console.error("Failed to load userState:", err);
    return null;
  }
};
