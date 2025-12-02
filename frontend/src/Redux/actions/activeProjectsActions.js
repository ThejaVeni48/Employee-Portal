import moment from "moment";

export const ActiveProjects = (companyId, empId) => {
  return async (dispatch) => {
    try {
      const formattedDate = moment().format("YYYY-MM-DD");

      const response = await fetch(
        `http://localhost:3001/api/empProjects?orgId=${companyId}&empId=${empId}&currentDate=${formattedDate}`
      );

      const result = await response.json();

      console.log("res for projects", result);

      dispatch({
        type: "GET_ACTIVEPROJECTS",
        payload: result.data || [], 
      });
    } catch (error) {
      console.error("Error occurred", error);
    }
  };
};
