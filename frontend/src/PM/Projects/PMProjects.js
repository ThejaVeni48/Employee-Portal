import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { useSelector } from "react-redux";
import { IoIosAdd } from "react-icons/io";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { SlCalender } from "react-icons/sl";
import moment from "moment";
import { Calendar } from "primereact/calendar";
import { Accordion, AccordionTab } from "primereact/accordion";
import "./PMProjects.css";

const PMProjects = () => {
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [visible, setVisible] = useState(false);
  const companyId = useSelector((state) => state.companyId);
  const createdBy = useSelector((state) => state.createdBy);
  // const [refresh, setRefresh] = useState(false);
  const [client, setClient] = useState("");
  const [status, SetStatus] = useState("");
  const [projectLead, setProjectLead] = useState("");
  const empId = useSelector((state) => state.empId);
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState([]);
  const [sideBar, setSideBar] = useState(false);
  const [selectedProject, setSelectedProject] = useState([]);
  const roleId = 4;
  const [projectEmp, setProjectEmp] = useState([]);
  const [showMore, setShowMore] = useState(false);
  // const visibleEmp = projectEmp.slice(0,2);

  function getFormattedDate() {
    const date = new Date();

    const getDate = date.getDate();
    const getMonth = date.getMonth() + 1;
    const getYear = date.getFullYear();

    const xx = `${getDate}-${getMonth}-${getYear}`;

    setStartDate(xx);
  }

  // const date = new Date();

  // console.log("Date",date);

  const styles = {
    container: {
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
    },
    card: {
      borderRadius: "12px",
      backgroundColor: "transparent",
    },
    title: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#1c3681",
      marginBottom: "1rem",
    },
    toolbar: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      marginBottom: "1.5rem",
      flexWrap: "wrap",
      gap: "1rem",
    },
    button: {
      padding: "0.5rem 1rem",
      borderRadius: "8px",
      border: "none",
      background: "#cfdaf1",
      color: "#1c3681",
      // fontSize: "0.9rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.2s ease-in-out",
      fontSize: "12px",
    },
    tableStyle: {
      width: "100%",
      fontSize: "0.9rem",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },
    headerStyle: {
      backgroundColor: "#cfdaf1",
      color: "#1c3681",
      fontSize: "13px",
    },
    cellStyle: {
      textAlign: "left",
      fontSize: "12px",
      borderBottom: "1px solid #e0e0e0",
    },

    dialogContainer: {
      width: "90vw",
      height: "95vw",
      borderRadius: "10px",
      padding: "20px",
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#1c3681",
      marginBottom: "1rem",
    },

    dialogBodyContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      justifyContent: "space-between",
      padding: "10px 5px",
      // border:'3px solid red'
    },

    dialogBody: {
      // flex: "1 1 calc(50% - 20px)",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      // border:'3px solid red'
    },

    input: {
      width: "210px",
      padding: "8px 12px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "12px",
      outline: "none",
      transition: "0.2s ease",
    },

    inputFocus: {
      borderColor: "#1c3681",
    },

    dialogButtonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "20px",
    },

    dialogButton: {
      backgroundColor: "#1c3681",
      color: "white",
      border: "none",
      padding: "0.6rem 1.4rem",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
      transition: "0.3s",
    },
    dateContainer: {
      border: "1px solid #ccc",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    date: {
      border: "4px solid yellow !important",
    },
    required: {
      color: "red",
      // marginTop:0px'
    },
    btnStyle: {
      padding: "0.5rem 1rem",
      borderRadius: "8px",
      border: "none",
      background: "#cfdaf1",
      color: "#1c3681",
      fontSize: "0.9rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.2s ease-in-out",
    },
  };

  const actionTemplate = (rowData) => {
    console.log("rowData", rowData);
    setSelectedProject(rowData);
    const projectId = rowData.PROJECT_ID;
    const projectCode = rowData.PROJECT_CODE;
    return (
      <>
        <button
          onClick={() => openSideBar(projectId, projectCode)}
          style={{
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
        >
          <HiOutlineDotsHorizontal />
        </button>
      </>
    );
  };

  console.log("selectedProject", selectedProject.PROJECT_NAME);

  const openSideBar = (projectId, projectCode) => {
    setSideBar((prev) => !prev);
    getProjectEmployee(projectId, projectCode);
  
  };
  useEffect(() => {
    getEmployees();
    getFormattedDate();
    getProjects();
  }, []);

  console.log("sideBar", sideBar);

  const getProjects = async () => {
    try {
      const data = await fetch(
        `http://localhost:3001/api/getProject?companyId=${companyId}&createdBy=${createdBy}`
      );
      if (!data.ok) {
        throw new Error("Network response was not good");
      }

      const response = await data.json();

      setProjects(response.data);
    } catch (error) {
      console.error("error occured", error);
    }
  };

  const getEmployees = async () => {
    try {
      const data = await fetch(
        `http://localhost:3001/api/getEmployees?companyId=${companyId}&empId=${empId}&roleId=${roleId}`
      );

      if (!data.ok) {
        throw new Error("Network response was not ok");
      }

      const response = await data.json();

      console.log("response", response.data);
      setEmployees(response.data);
    } catch (error) {

      
      console.error("Error ocured", error);
    }
  };

  const createProject = async () => {
    console.log("triggered create Project");

    console.log("projectName", projectName);
    console.log("startDate", startDate);
    console.log("endDate", endDate);
    console.log("projectLead", projectLead);
    console.log("companyId", companyId);
    console.log("createdBy", createdBy);
    console.log("client", client);
    console.log("status", status);
    console.log("selectedEmp", selectedEmp);

    if (
      !projectName ||
      !startDate ||
      !endDate ||
      !projectLead ||
      !status ||
      !client
    ) {
      alert("Please enter all required fields");
      return;
    }
    const allAssigned = [...selectedEmp];
  const leadExists = allAssigned.some((emp) => emp.EMP_ID === projectLead);
  if (!leadExists) {
    const leadObj = employees.find((e) => e.EMP_ID === projectLead);
    if (leadObj) {
      allAssigned.push({
        EMP_ID: leadObj.EMP_ID,
        DEPARTMENT: leadObj.DEPT_NAME,
        DEPT_ID: leadObj.DEPT_ID,
      });
    }
  }
    try {
      const data = await fetch("http://localhost:3001/api/createProject1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName,
          startDate: moment(startDate).format("YYYY-MM-DD"),
          endDate: moment(endDate).format("YYYY-MM-DD"),
          projectLead,
          companyId,
          createdBy,
          client,
          status,
          selectedEmp: allAssigned, 
          empId
        }),
      });

      const response = await data.json();

      console.log("response", response);

      if (response.status === 201) {
        alert("Project created successfully.");
        setVisible(false);
      }
      setProjectName("");
      setProjectLead("");
      setClient("");
      setEndDate("");
      setStartDate("");
      getProjects();
    } catch (error) {
      console.error("Error occured", error);
    }
  };

  const handleSelectLead = (e) => {
    const xy = e.target.value;
    setProjectLead(xy);

    console.log("xy", xy);
  };

  const handleChange = (item) => {
    setSelectedEmp((prev) => {
      const exists = prev.find((emp) => emp.EMP_ID === item.EMP_ID);
      if (exists) return prev.filter((emp) => emp.EMP_ID !== item.EMP_ID);
      return [
        ...prev,
        {
          EMP_ID: item.EMP_ID,
          DEPARTMENT: item.DEPT_NAME,
          DEPT_ID: item.DEPT_ID,
        },
      ];
    });
    console.log("item", item.EMP_ID);

    // setSelectedEmp((prev) => {
    //   const present = prev.find((e) => e.EMP_ID === item.EMP_ID);
    //   if (present) return prev.filter((e) => e.EMP_ID !== item.EMP_ID);
    //   return [
    //     ...prev,
    //     {
    //       EMP_ID: item.EMP_ID,
    //       DEPT_ID: item.DEPT_ID,
    //     },
    //   ];
    // });
  };

  console.log("selectedEMp", selectedEmp);

  const getProjectEmployee = async (projectId, projectCode) => {
    const xy = projectId;
    const xx = projectCode;
    try {
      const data = await fetch(
        `http://localhost:3001/api/getProjectEmployee?companyId=${companyId}&projectId=${xy}&projectCode=${xx}`
      );

      if (!data.ok) {
        throw new Error("Network response was not ok");
      }
      const response = await data.json();

      console.log("response", response.data);
      setProjectEmp(response.data);
    } catch (error) {
      console.error("Error occured", error);
    }
  };

const handleUpdateStatus = async(projectId, projectCode)=>{

  console.log("projectId",projectId);
  console.log("projectCode",projectCode);
  
  console.log("status",status);
  console.log("companyId",companyId);
  
     try {
      const data = await fetch('http://localhost:3001/api/updatePStatus',{
        method:'PUT',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          status,
          companyId,
          projectCode,
          projectId
        })

      })

      console.log("data",data);
      
      
     } catch (error) {
      console.error("Error occured",error);
      
     }
}


  return (
    <>
      <div style={styles.container}>
        <Card style={styles.card}>
          <div style={styles.title}>Projects</div>

          <div style={styles.toolbar}>
            <button style={styles.button} onClick={() => setVisible(true)}>
              <IoIosAdd size={20} /> Add Project
            </button>
          </div>

          <DataTable
            value={projects}
            paginator
            rows={8}
            stripedRows
            emptyMessage="No Projects found."
            style={styles.tableStyle}
          >
            {/* <Column
            field="PROJECT_ID"
            header="Project_ID"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          /> */}
            <Column
              field="PROJECT_NAME"
              header="Project Name"
              headerStyle={styles.headerStyle}
              bodyStyle={styles.cellStyle}
            />
            <Column
              field="PROJECT_CODE"
              header="Project Code"
              headerStyle={styles.headerStyle}
              bodyStyle={styles.cellStyle}
            />
            {/* <Column
            field="TEAM_LEAD"
            header="Department Name"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          /> */}
            {/* <Column
            field="CLIENT"
            header="Client"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          /> */}
            <Column
              field="START_DATE"
              header="Start Date"
              headerStyle={styles.headerStyle}
              bodyStyle={styles.cellStyle}
            />
            <Column
              field="END_DATE"
              header="End Date"
              headerStyle={styles.headerStyle}
              bodyStyle={styles.cellStyle}
            />
            <Column
              field="STATUS"
              header="Status"
              headerStyle={styles.headerStyle}
              bodyStyle={styles.cellStyle}
            />
            <Column
              field="ASSIGNEES"
              header="Assignees"
              headerStyle={styles.headerStyle}
              bodyStyle={styles.cellStyle}
            />

            <Column
              header="Action"
              body={actionTemplate}
              headerStyle={styles.headerStyle}
              bodyStyle={styles.cellStyle}
            />
          </DataTable>
        </Card>

        <Dialog
          header="Add Project"
          visible={visible}
          style={styles.dialogContainer}
          onHide={() => setVisible(false)}
        >
          <div style={styles.dialogBodyContainer}>
            {/* project name */}
            <div style={styles.dialogBody}>
              <label
                style={{
                  fontWeight: "600",
                  color: "#2e3e50",
                  fontSize: "13px",
                }}
              >
                <span style={styles.required}>*</span>
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                style={styles.input}
                placeholder="Enter project name"
              />
            </div>
            {/* client */}
            <div style={styles.dialogBody}>
              <label
                style={{
                  fontWeight: "600",
                  color: "#2e3e50",
                  fontSize: "13px",
                }}
              >
                <span style={styles.required}>*</span>
                Client
              </label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                style={styles.input}
                placeholder="Enter client name"
              />
            </div>

            {/* startDate */}
            <div style={styles.dialogBody}>
              <label
                style={{
                  fontWeight: "600",
                  color: "#2e3e50",
                  fontSize: "13px",
                }}
              >
                <span style={styles.required}>*</span>
                Start Date
              </label>
              <div style={styles.dateContainer}>
                <Calendar
                  value={startDate}
                  onChange={(e) => setStartDate(e.value)}
                  showIcon
                  style={{ width: "200px", backgroundColor: "teal" }}
                />
              </div>
            </div>

            {/* deadline */}

            <div style={styles.dialogBody}>
              <label
                style={{
                  fontWeight: "600",
                  color: "#2e3e50",
                  fontSize: "13px",
                }}
              >
                <span style={styles.required}>*</span>
                End Date
              </label>
              <div style={styles.dateContainer}>
                <Calendar
                  value={endDate}
                  onChange={(e) => setEndDate(e.value)}
                  showIcon
                  style={{ width: "200px" }}
                />
              </div>
            </div>

            {/* status */}
            <div style={styles.dialogBody}>
              <label
                style={{
                  fontWeight: "600",
                  color: "#2e3e50",
                  fontSize: "13px",
                }}
              >
                <span style={styles.required}>*</span>
                Status
              </label>
              {/* <input
                type="text"
                value={status}
                onChange={(e) => SetStatus(e.target.value)}
                style={styles.input}
                placeholder="Enter status"
              /> */}
              <select value={status} onChange={(e)=>SetStatus(e.target.value)}   style={styles.input}>
                <option>---Choose Status---</option>
                <option value='active'>Active</option>
                <option value='hold'>Hold</option>
                <option value='completed'>Completed</option>
              </select>
            </div>

            {/* lead */}
            <div style={styles.dialogBody}>
              <label
                style={{
                  fontWeight: "600",
                  color: "#2e3e50",
                  fontSize: "13px",
                }}
              >
                <span style={styles.required}>*</span>
                Lead
              </label>

              <select
                value={projectLead}
                onChange={(e) => handleSelectLead(e)}
                style={{
                  ...styles.input,
                  cursor: "pointer",
                  backgroundColor: "white",
                }}
              >
                <option value="">Select Lead</option>
                {employees.map((emp) => (
                  <option key={emp.EMP_ID} value={emp.EMP_ID}>
                    {emp.DISPLAY_NAME}
                  </option>
                ))}
              </select>
            </div>

            {/* <button style={{ ...styles.btnStyle, margin: "auto" }} onClick={createProject}>Save</button> */}
          </div>

          {/* Accordion container */}
          <div style={{ marginTop: "20px",}}>
            <Accordion
              style={{
                backgroundColor: "transparent",
                border: "none",
                boxShadow: "none",
                padding:0
               
              }}
            >
              <AccordionTab
                header="Assign Employees"
                style={{
                  // backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  padding:'10px'
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f0f4ff" }}>
                      <th style={styles.headerStyle}>
                        Select
                      </th>
                      <th style={styles.headerStyle}>
                        Name
                      </th>
                      <th style={styles.headerStyle}>
                        Department
                      </th>
                      <th style={styles.headerStyle}>
                        Employee ID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.EMP_ID}>
                        <td style={styles.cellStyle}>
                          <input
                            type="checkbox"
                            onChange={() => handleChange(emp)}
                            checked={selectedEmp.some(
                              (e) => e.EMP_ID === emp.EMP_ID
                            )}
                          />
                        </td>
                          <td style={styles.cellStyle}>{emp.DISPLAY_NAME}</td>
                          <td style={styles.cellStyle}>{emp.DEPT_NAME}</td>
                          <td style={styles.cellStyle}>{emp.EMP_ID}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AccordionTab>
            </Accordion>
          </div>


     {/* button */}

          <div>
            <button
              onClick={createProject}
              style={{...styles.button,float:'right',marginTop:'20px'}}
            >
              Create Project
            </button>
          </div>
        </Dialog>
      </div>
      {sideBar && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "320px",
            height: "100vh",
            background: "#f0f4ff",
            boxShadow: "0 0 15px rgba(0,0,0,0.2)",
            zIndex: 2000,
            padding: "20px",
            overflowY: "auto",
            transition: "right 0.3s ease",
            borderRadius: "10px 0 0 10px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ color: "#1c3681", margin: 0, fontSize: "0.9rem" }}>
              {selectedProject.PROJECT_NAME}
            </h3>
            <button
              onClick={() => setSideBar(false)}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "20px",
                cursor: "pointer",
                color: "#1c3681",
              }}
            >
              ✕
            </button>
          </div>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "row",
              gap: "12px",
              fontSize: "12px",
            }}
          >
            <p style={{ color: "#1c3681" }}>Client: </p>
            <p style={{ color: "#374151" }}>{selectedProject.CLIENT}</p>
          </div>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "row",
              gap: "12px",
              fontSize: "12px",
            }}
          >
            <p style={{ color: "#1c3681" }}>Team Lead:</p>
            <p style={{ color: "#374151" }}>
              {" "}
              {selectedProject.PROJECT_LEAD_NAME}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "20px",
            }}
          >
            <p style={{ margin: 0, fontSize: "12px", color: "#1c3681" }}>
              Assignees:
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              {projectEmp.slice(0, 2).map((emp, index) => {
                const initials =
                  (emp.FIRST_NAME?.[0]?.toUpperCase() || "") +
                  (emp.LAST_NAME?.[0]?.toUpperCase() || "");
                return (
                  <div
                    key={index}
                    title={`${emp.FIRST_NAME} ${emp.LAST_NAME}`}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: "#1c3681",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "600",
                      fontSize: "13px",
                      position: "relative",
                      left: `${index * -10}px`,
                      border: "2px solid #f0f4ff",
                      zIndex: projectEmp.length - index,
                    }}
                  >
                    {initials}
                  </div>
                );
              })}

              {projectEmp.length > 2 && (
                <button
                  onClick={() => setShowMore((prev) => !prev)}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "#cfdaf1",
                    color: "#1c3681",
                    fontWeight: "600",
                    fontSize: "13px",
                    border: "2px solid #f0f4ff",
                    position: "relative",
                    left: `${2 * -10}px`,
                    cursor: "pointer",
                  }}
                >
                  +{projectEmp.length - 2}
                </button>
              )}
            </div>
          </div>

          {showMore && (
            <div style={{ marginTop: "12px", marginLeft: "70px" }}>
              {projectEmp.slice(2).map((emp, index) => {
                const initials =
                  (emp.FIRST_NAME?.[0]?.toUpperCase() || "") +
                  (emp.LAST_NAME?.[0]?.toUpperCase() || "");
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        backgroundColor: "#1c3681",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "600",
                        fontSize: "13px",
                        marginRight: "10px",
                      }}
                    >
                      {initials}
                    </div>
                    <span style={{ fontWeight: "500", fontSize: "12px" }}>
                      {emp.FIRST_NAME} {emp.LAST_NAME}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "25px",
            }}
          >
            <p style={{ margin: 0, fontSize: "12px", color: "#1c3681" }}>
              Status:
            </p>
            <select
              style={{
                flex: 1,
                padding: "6px 8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                background: "white",
                color: "#1c3681",
                fontWeight: "500",
                outline: "none",
                fontSize: "12px",
              }}
            >
              <option value={selectedProject.STATUS}>
                {selectedProject.STATUS}
              </option>
              <option value="Hold">Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Save Button */}
          <button
            style={{ ...styles.button, margin: "55px" }}
            onClick={()=>handleUpdateStatus(selectedProject.PROJECT_ID,selectedProject.PROJECT_CODE)}
          >
            Save Changes
          </button>
        </div>
      )}
    </>
  );
};

export default PMProjects;
