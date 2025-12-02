import React from "react";









const ProjectProfile = ({ rowData = {} }) => {

  console.log("rowData", rowData);
  console.log("Project Name:", rowData.PROJ_NAME);

  return (
    <>
      <p>ProjectProfile</p>

      <h2>Project name: {rowData.PROJ_NAME}</h2>
      <p>Client: {rowData.CLIENT_NAME}</p>
      <p>ClientId: {rowData.CLIENT_ID}</p>
      <p>Start Date: {rowData.START_DATE}</p>
      <p>End Date: {rowData.END_DATE}</p>
      <p>Support Identifier: {rowData.SUPPORT_IDENTIFIER}</p>
      <p>Billable: {rowData.BILLABLE}</p>
      <p>Hierarchy: {rowData.HIERARCHY}</p>
    </>
  )
}


export default ProjectProfile