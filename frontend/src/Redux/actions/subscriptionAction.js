import moment from "moment";

export const ActiveSubscription = (companyId, empId) => {
  return async (dispatch) => {
    try {

      const response = await fetch(
        `http://localhost:3001/api/activeSubscription?orgId=${companyId}`
      );

      const result = await response.json();

      console.log("res for activeSubscription", result);

      dispatch({
        type: "GET_ACTIVESUBSCRIPTION",
        payload: result.data || [], 
      });
    } catch (error) {
      console.error("Error occurred", error);
    }
  };
};
