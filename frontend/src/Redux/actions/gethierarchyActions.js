export const fetchHierarchy = (companyId, projectId, empId) => {

console.log("COMPANYiD get Hierarhcy",companyId);
  console.log("projectId get Hierarhcy",projectId);
  console.log("empId get Hierarhcy",empId);  
  return async (dispatch) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/getHierarchy?companyId=${companyId}&projectId=${projectId}&empId=${empId}`
      );

      const res = await response.json();
      console.log("Hierarchy response:", res);

      let levels = [];

      if (res.hasHierarchy) {
        if (res.levels) {
          // full hierarchy
          levels = res.levels;
          console.log("levels 21",levels);
          
        } else if (res.nextApprover) {
          // current approver is in hierarchy, show only next approver
          levels = [{ level: 1, approverId: res.nextApprover }];
        }
      } else {
        // hierarchy = NO
        levels = res.levels || [];
      }

      dispatch({
        type: "GET_HIERARCHY",
        payload: {
          hasHierarchy: res.hasHierarchy,
          levels
        }
      });

    } catch (error) {
      console.error("Hierarchy fetch error:", error);
    }
  };
};
