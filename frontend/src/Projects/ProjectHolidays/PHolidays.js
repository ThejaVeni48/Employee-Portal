import React from "react";
import CreateHolidays from "./CreatePHolidays";
import PHolidaysList from "./PHolidaysList";












const PHolidays = ({ projectId }) => {
  console.log("Project ID:", projectId);

  return (
    <>
      <CreateHolidays projectId={projectId} />
      <PHolidaysList projectId={projectId} />
    </>
  );
};




export default PHolidays