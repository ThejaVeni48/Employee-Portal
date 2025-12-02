export const fetchTasks = (companyId, projectId) => {
  return async (dispatch) => {
    try {
      const data = await fetch(`http://localhost:3001/api/getTask?companyId=${companyId}&projectId=${projectId}`);
      const res = await data.json();
      console.log("res for tasks", res);

      dispatch({
        type: 'GET_TASKS',
        payload: res.data,
      });
    } catch (error) {
      console.error("fetch tasks error occurred", error);
    }
  };
};
