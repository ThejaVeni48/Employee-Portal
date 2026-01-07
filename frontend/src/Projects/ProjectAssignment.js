import React, { useState, useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { data, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IoIosAdd } from "react-icons/io";
import { Dialog } from "primereact/dialog";
import DatePicker from "react-datepicker";
import moment from "moment";
import { fetchRoles } from "../Redux/actions/roleActions";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Task from "../Tasks/Task";
import ProjectProfile from "./ProjectProfile";
import Approvals from "./Approvals";
import ProjectScheduler from "./ProjectScheduler";
import PHolidays from "./ProjectHolidays/PHolidays";
import ViewScheduledHours from "./ViewScheduledHours";
import './ProjectAssignmentStyles.css';


const ProjectAssignmnet = () => {
  const location = useLocation();
  const rowData = location.state?.rowData || {};
  // console.log("rowData", rowData);
  const [employees, setEmployees] = useState([]);
  const companyId = useSelector((state) => state.user.companyId);
  // const [selectedEmp, setSelectedEmp] = useState([]);
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmp, setSelectedEmp] = useState(null);
  // const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("Yes");
  const [approveAccess, setApproveAccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [contractStartDate, setContractStartDate] = useState(null);
  const [contractEndDate, setContractEndDate] = useState(null);
  const roles = useSelector((state) => state.roles.roleList);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedRoleCode, setSelectedRoleCode] = useState("");
  const accessCode = useSelector((state) => state.user.accessCode) || [];
  const [projEmployees, setProjEmployees] = useState([]);
  const email = useSelector((state) => state.user.email);
  const projectId = location.state?.rowData.PROJ_ID || "";
  const [modalVisible,setModalVisible] = useState(false);
const [selectedActionRow, setSelectedActionRow] = useState(null);
  const role = useSelector((state) => state.user.Role);
  const [inputs, setInputs] = useState({});
const [actionType, setActionType] = useState(""); // 'I' | 'E'

  const handleChange = (e) => {
    // const target = e.target;
    // const value = target.type === 'checkbox' ? target.checked : target.value;
    // const name = target.name;
    // setInputs(values => ({...values, [name]: value}))


    const target = e.target;

    const value = target.type ==='checkbox' ? target.checked : target.value;

    const name = target.name;

    setInputs(values=>({...values,[name]:value}))
  }

  console.log("ROLE", role);
  console.log("accessCode", accessCode);

  const Hierachy = location.state?.rowData.HIERARCHY === "Y";

  console.log("hierachy", Hierachy);

  useEffect(() => {
    getEmployees();
  }, [companyId]);

  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    setSelectedRoleId(roleId);

    // Find selected role object
    const roleObj = roles.find((r) => r.ROLE_ID.toString() === roleId);

    // Store ROLE_CODE also
    if (roleObj) {
      setSelectedRoleCode(roleObj.ROLE_CODE);
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (rowData) getProjectEmployee();
  }, []);

  const getProjectEmployee = async () => {
    // console.log("getProjectEmployeee");

    const projectId = rowData.PROJ_ID;

    // console.log("projectId",projectId);

    try {
      const res = await fetch(
        `http://localhost:3001/api/getProjectEmployee?companyId=${companyId}&projectId=${projectId}`
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      setProjEmployees(data.data);

      // console.log("data for project assignmnet",data);
    } catch (error) {
      console.error("Error occured", error);
    }
  };

  useEffect(() => {
    if (companyId) {
      dispatch(fetchRoles(companyId));
    }
  }, [companyId]);

  const getEmployees = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getEmployees?companyId=${companyId}`
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      //   console.log("data of employees",data);
      setEmployees(data.data);

      console.log("get all employees", data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // console.log("employees");

  const filteredEmployees = employees.filter((emp) =>
    emp.DISPLAY_NAME.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      fontSize: "0.9rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.2s ease-in-out",
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
      textAlign: "center",
    },
    cellStyle: {
      fontSize: "12px",
      borderBottom: "1px solid #e0e0e0",
    },
  };

  const handleAssignProject = async () => {
    // console.log("selectedRolecode",selectedRoleCode);
    // console.log("approveAccess",approveAccess);
    // console.log("SELECTED",selectedEmp);

    // console.log("handleAssignProject");
    try {
      const response = await fetch("http://localhost:3001/api/assignProject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empId: selectedEmp.EMP_ID,
          role: selectedRoleCode,
          status: isActive,
          startDate: moment(startDate).format("YYYY-MM-DD"),
          contractStart: moment(contractStartDate).format("YYYY-MM-DD"),
          contractEnd: moment(contractEndDate).format("YYYY-MM-DD"),
          approveAccess,
          email,
          orgId: companyId,
          projId: rowData.PROJ_ID,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Network response was not ok: ${errText}`);
      }

      const res = await response.json();
      getProjectEmployee();
      // console.log("Assign project response:", res);
      setVisible(false);
    } catch (error) {
      console.error("Error occured", error);
    }
  };

  const actionTemplate = (rowData) => (
    <button
      onClick={() => handleActionClick(rowData)}
      style={{
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        cursor: "pointer",
      }}
    >
      <HiOutlineDotsHorizontal />
    </button>
  );


 
const handleActionClick = (rowData) => {
  setSelectedActionRow(rowData);
  setModalVisible(true);
};

  const handleSelectEmp = (emp) => {
    // console.log("Selected Employee:", emp);
    setSelectedEmp(emp);
  };


  const handleSave = async()=>{
    console.log("clciked saved",selectedActionRow.EMP_ID);
    console.log("inputs.value saved",Object.keys(inputs).toString());


    

   try {
      const response = await fetch("http://localhost:3001/api/changeStatus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empId: selectedActionRow.EMP_ID,
          role: selectedRoleCode,
          status: isActive,
          contractStart: moment(contractStartDate).format("YYYY-MM-DD"),
          contractEnd: moment(contractEndDate).format("YYYY-MM-DD"),
          // approveAccess,
          email,
          orgId: companyId,
          projId: selectedActionRow.PROJ_ID,
          checkedValue:actionType,

          // checkedValue:Object.keys(inputs).toString()
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Network response was not ok: ${errText}`);
      }

      const res = await response.json();
      console.log("res",res);
      
      if(res.status === 200)
      {
alert(res.message)
        getProjectEmployee();
        // console.log("Assign project response:", res);
        setVisible(false);
      }
    }catch (error) {
      console.error("Error occured",error);
      
    }


    
  }
  

  return (
    <>
      <p>ProjectAssignmnet</p>
      <TabView>
        <TabPanel header="Project Profile">
          {(accessCode.includes("PROJ_PROF") ||
            accessCode.includes("ALL_R") ||
            role === "Org Admin") && <ProjectProfile rowData={rowData} />}
        </TabPanel>

        {(accessCode.includes("ALL_R") ||
          accessCode.includes("PROJ_ASSIGNEES") ||
          role === "Org Admin") && (
          <TabPanel header="Assignees">
            {(accessCode.includes("PROJ_CR") ||
              accessCode.includes("ALL_R") ||
              role === "Org Admin") && (
              <button style={styles.button} onClick={() => setVisible(true)}>
                <IoIosAdd size={20} /> Add New Assignee
              </button>
            )}

            <DataTable
              value={projEmployees}
              paginator
              rows={8}
              stripedRows
              responsiveLayout="scroll"
              emptyMessage="No projects found."
              style={styles.tableStyle}
            >
              <Column
                field="EMP_ID"
                header="Emp Id"
                headerStyle={styles.headerStyle}
                bodyStyle={styles.cellStyle}
              />

              <Column
                field="DISPLAY_NAME"
                header="Employee Name"
                headerStyle={styles.headerStyle}
                bodyStyle={styles.cellStyle}
              />

              <Column
                field="ROLE_NAME"
                header="Role"
                headerStyle={styles.headerStyle}
                bodyStyle={styles.cellStyle}
              />
              <Column
                field="START_DATE"
                header="Start Date"
                headerStyle={styles.headerStyle}
                bodyStyle={styles.cellStyle}
              />

              {!Hierachy && (
                <Column
                  field="TS_APPROVE_ACCESS"
                  header="Approval Access"
                  headerStyle={styles.headerStyle}
                  bodyStyle={styles.cellStyle}
                />
              )}

              
              <Column
                header="Action"
                body={actionTemplate}
                headerStyle={styles.headerStyle}
                bodyStyle={styles.cellStyle}
              />
            </DataTable>
            <Dialog
              header="Add Assignee"
              visible={visible}
              style={{ width: "500px", borderRadius: "8px" }}
              onHide={() => setVisible(false)}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {/* SEARCH BAR */}
                <div>
                  <label style={{ fontWeight: "500" }}>Search Assignee *</label>
                  <input
                    type="text"
                    placeholder="Search employee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      marginTop: "6px",
                    }}
                  />
                </div>

                {/* SUGGESTION LIST */}
                {searchTerm && filteredEmployees.length > 0 && (
                  <div
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      maxHeight: "150px",
                      overflowY: "auto",
                    }}
                  >
                    {filteredEmployees.map((emp) => (
                      <div
                        key={emp.EMP_ID}
                        onClick={() => {
                          handleSelectEmp(emp);
                          setSearchTerm("");
                        }}
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #eee",
                          cursor: "pointer",
                        }}
                      >
                        {emp.DISPLAY_NAME}
                      </div>
                    ))}
                  </div>
                )}

                {/* SELECTED EMPLOYEE */}
                {selectedEmp && (
                  <div
                    style={{
                      background: "#f1f5ff",
                      padding: "10px",
                      borderRadius: "6px",
                      fontWeight: "500",
                    }}
                  >
                    Selected: {selectedEmp.DISPLAY_NAME}
                  </div>
                )}

                {/* ROLE */}
                <div>
                  <label style={{ fontWeight: "500" }}>Role *</label>
                  <select
                    value={selectedRoleId}
                    onChange={handleRoleChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      marginTop: "6px",
                    }}
                  >
                    <option value="">Select Role</option>

                    {roles?.map((r) => (
                      <option key={r.ROLE_ID} value={r.ROLE_ID}>
                        {r.ROLE_NAME}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ACTIVE STATUS */}
                <div>
                  <label style={{ fontWeight: "500" }}>Active *</label>
                  <select
                    value={isActive}
                    onChange={(e) => setIsActive(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      marginTop: "6px",
                    }}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* START DATE */}
                <div>
                  <label style={{ fontWeight: "500" }}>Start Date *</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select start date"
                  />
                </div>

                {/* CONTRACT START DATE */}
                <div>
                  <label style={{ fontWeight: "500" }}>
                    {" "}
                    Contract Start Date *
                  </label>
                  <DatePicker
                    selected={contractStartDate}
                    onChange={(date) => setContractStartDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select start date"
                  />
                </div>

                {/* CONTRACT END DATE */}
                <div>
                  <label style={{ fontWeight: "500" }}>
                    Contract End Date *
                  </label>
                  <DatePicker
                    selected={contractEndDate}
                    onChange={(date) => setContractEndDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select start date"
                  />
                </div>

                {!Hierachy && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={approveAccess}
                      // disabled={Hierachy}
                      onChange={(e) => {
                        setApproveAccess(e.target.checked);
                        // console.log("checked value",e.target.checked);
                      }}
                      style={{ marginRight: "10px" }}
                    />
                    <label>Approval Access</label>
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    style={{
                      padding: "10px 25px",
                      backgroundColor: "#1c3681",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                    // onClick={() => {
                    //   console.log("Final Payload:", {
                    //
                    //   });
                    // }}
                    onClick={handleAssignProject}
                  >
                    Add Assignee
                  </button>
                </div>
              </div>
               {/* {setModalVisible && (
  <div className="upgrade-modal-overlay">
    <div className="upgrade-modal">
      <h3>Employee Limit Reached</h3>
      <p>
        You have reached the maximum employee limit for your current plan.
        Please upgrade your subscription to add more employees.
      </p>

      <div className="upgrade-modal-actions">
        <button
          className="upgrade-btn"

        >
          Upgrade Plan
        </button>

        <button
          className="cancel-btn"
          onClick={() => setModalVisible(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)} */}
 </Dialog>
{modalVisible && selectedActionRow && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        width: "420px",
        textAlign: "center",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>Employee Status</h3>
     
    <p>Name:{selectedActionRow.DISPLAY_NAME}</p>
    <p>Role:{selectedActionRow.ROLE_NAME}</p>

   <div>
  <input
    type="radio"
    name="action"
    value="I"
    checked={actionType === "I"}
    onChange={(e) => setActionType(e.target.value)}
  />
  <label style={{ marginLeft: "6px" }}>Exit</label>
</div>

<div>
  <input
    type="radio"
    name="action"
    value="E"
    checked={actionType === "E"}
    onChange={(e) => setActionType(e.target.value)}
  />
  <label style={{ marginLeft: "6px" }}>Extend Period</label>
</div>




{actionType === "E" && (
  <>
    <div>
      <label style={{ fontWeight: "500" }}>Role *</label>
      <select
        value={selectedRoleId}
        onChange={handleRoleChange}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginTop: "6px",
        }}
      >
        <option value="">Select Role</option>
        {roles?.map((r) => (
          <option key={r.ROLE_ID} value={r.ROLE_ID}>
            {r.ROLE_NAME}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label style={{ fontWeight: "500" }}>Contract Start Date *</label>
      <DatePicker
        selected={contractStartDate}
        onChange={(date) => setContractStartDate(date)}
        dateFormat="yyyy-MM-dd"
        placeholderText="Select start date"
      />
    </div>

    <div>
      <label style={{ fontWeight: "500" }}>Contract End Date *</label>
      <DatePicker
        selected={contractEndDate}
        onChange={(date) => setContractEndDate(date)}
        dateFormat="yyyy-MM-dd"
        placeholderText="Select end date"
      />
    </div>
  </>
)}


    
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <button
          style={{
            background: "#e65100",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={handleSave}
        >
          Save
        </button>

        <button
          style={{
            background: "#ccc",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={() => setModalVisible(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

           
          </TabPanel>
        )}

        {(accessCode.includes("ALL_R") ||
          accessCode.includes("PROJ_TASK") ||
          role === "Org Admin") && (
          <TabPanel header="Tasks">
            <Task projectId={{ projectId: projectId }} />
          </TabPanel>
        )}

        {Hierachy && (
          <TabPanel header="Approvals">
            <Approvals employees={{ employees, projectId, projEmployees }} />
          </TabPanel>
        )}

        <TabPanel header="Holidays">
          <PHolidays projectId={projectId} />
        </TabPanel>

        <TabPanel header="View Scheduled Hours">
          <ViewScheduledHours employees={projectId} />
        </TabPanel>

        <TabPanel header="Scheduler">
          <ProjectScheduler employees={projectId} />
        </TabPanel>
      </TabView>
    </>
  );
};

export default ProjectAssignmnet;
