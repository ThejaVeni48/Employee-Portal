import React, { useState, useEffect } from "react";
import { IoIosAdd } from "react-icons/io";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import {  useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { HiOutlineDotsHorizontal } from "react-icons/hi";





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

const Approvals = ({ employees = {} }) => {
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [isActive, setIsActive] = useState("Yes");
  const [employee, setEmployees] = useState([]);
  const [hierarchyLevel, setHierarchyLevel] = useState("");
  const companyId = useSelector((state) => state.user.companyId);
  const email = useSelector((state) => state.user.email);
const accessCode = useSelector((state) => state.user.accessCode);
 const role = useSelector((state) => state.user.Role);
      const [filteredData, setFilteredData] = useState([]);

  const [approver, setApprovals] = useState([]);


const projId = employees.projectId;

  console.log("projectId",employees.projectId);
  

  const filteredEmployees = employee.filter((emp) =>
    emp.DISPLAY_NAME.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("emplo");

  useEffect(() => {
    if (employees) {
      setEmployees(employees.employees);
    }
  }, [employees]);



  useEffect(() => {
    getApproverList();
  }, []);

  const getApproverList = async () => {
    try {
      const data = await fetch(
        `http://localhost:3001/api/getApproveHierarchy?projectId=${projId}&orgId=${companyId}`
      );

      if (!data.ok) {
        throw new Error("Network response was not ok");
      }

      const res = await data.json();

      console.log("res for approver hierarcy", res.data);
      setApprovals(res.data || []);
      setFilteredData(res.data || []);
    } catch (error) {
      console.error("Error occured", error);
    }
  };

  const handleSelectEmp = (emp) => {
    console.log("Selected Employee:", emp);
    setSelectedEmp(emp);
  };

  const handleHierarchyChange = (e) => {
    const value = e.target.value;
    console.log("value", value);
    setHierarchyLevel(value);
  };

  const handleAssign = async () => {
    console.log("add approval");
    console.log("selectedEMp", selectedEmp.EMP_ID);
    console.log("hierachylevel", hierarchyLevel);
    console.log("active", isActive);

    try {
      const data = await fetch("http://localhost:3001/api/approvalHierarchy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          empId: selectedEmp.EMP_ID,
          hierarchyLevel,
          orgId: companyId,
          status: isActive,
          email,
          projectId: employees.projectId,
        }),
      });

      console.log("data", data);
    } catch (error) {
      console.error("Error occured", error);
    }
  };

    const actionTemplate = (rowData) => (
        <button
          // onClick={() => handleActionClick(rowData)}
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
  

  return (
    <>
      <button style={styles.button} onClick={() => setVisible(true)}>
        <IoIosAdd size={20} /> Add New Approver
      </button>

      <p>Approvals</p>
      <Card>
                   <DataTable
                    value={filteredData}
                    paginator
                    rows={8}
                    stripedRows
                    responsiveLayout="scroll"
                    emptyMessage="No projects found."
                    style={styles.tableStyle}
                  >
                    <Column
            field="DISPLAY_NAME"
            header="Approver_Name"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
          <Column
                      field="APPROVER_ID"
                      header="Empid"
                      headerStyle={styles.headerStyle}
                      bodyStyle={styles.cellStyle}
                    />
                   
                   
                    <Column
                      field="LINE_NO"
                      header="Hierarchy"
                      headerStyle={styles.headerStyle}
                      bodyStyle={styles.cellStyle}
                    />
                    <Column
                      field="STATUS"
                      header="Status"
                      headerStyle={styles.headerStyle}
                      bodyStyle={styles.cellStyle}
                    />
                    
          
                  
                    {
            (accessCode.includes("ALL_R") || accessCode.includes("PROJ_APP_MD")) &&
            (
                    <Column
                      header="Action"
                      body={actionTemplate}
                      headerStyle={styles.headerStyle}
                      bodyStyle={styles.cellStyle}
                    />
            )}
                  </DataTable> 
      </Card>

      <Dialog
        header="Add Approver"
        visible={visible}
        style={{ width: "500px", borderRadius: "8px" }}
        onHide={() => setVisible(false)}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* SEARCH BAR */}
          <div>
            <label style={{ fontWeight: "500" }}>Search Approver *</label>
            <input
              type="text"
              placeholder="Search Approver..."
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
              value={hierarchyLevel}
              onChange={(e) => handleHierarchyChange(e)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginTop: "6px",
              }}
            >
              <option value="">Select Role</option>
              <option value="1">L1</option>
              <option value="2">L2</option>
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
          {/* <div>
      <label style={{ fontWeight: "500" }}>Start Date *</label>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="yyyy-MM-dd"
        placeholderText="Select start date"
      />
    </div> */}

          {/* <div style={{ display: "flex", alignItems: "center" }}>
      <input
        type="checkbox"
        checked={approveAccess}
        disabled={Hierachy}
        onChange={(e) => {setApproveAccess(e.target.checked);
          console.log("checked value",e.target.checked);
          
        }}
        style={{ marginRight: "10px" }}
      />
      <label>Approval Access</label>
    </div> */}

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
              onClick={handleAssign}
            >
              Add Approval
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Approvals;
