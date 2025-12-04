import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { Dialog } from "primereact/dialog";
import {  useSelector } from "react-redux";

// ----------------- STYLES -----------------
const styles = {
  container: { minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  button: {
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "none",
    background: "#cfdaf1",
    color: "#1c3681",
    fontSize: "12px",
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
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  headerStyle: { backgroundColor: "#cfdaf1", color: "#1c3681", fontSize: "13px" },
  dialogContainer: { width: "90vw", borderRadius: "10px", padding: "20px" },
  input: {
    width: "210px",
    padding: "8px 12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "12px",
    outline: "none",
    transition: "0.2s ease",
  },
};

const Approvals = ({ employees = {} }) => {
  const location = useLocation();
  const rowData = location.state?.rowData || {};
 const email = useSelector((state) => state.user.email);
  const empId = useSelector((state) => state.user.empId);
  const [employee, setEmployee] = useState([]);
  const [projEmployee, setProjEmployees] = useState([]);
  const [visible, setVisible] = useState(false);
  const [hierarchyEmp,setHierarchyEmp] = useState([]);

  const [searchEmp, setSearchEmp] = useState("");
  const [selectedEmp, setSelectedEmp] = useState([]);

  const [levels, setLevels] = useState([
    { name: "L1", selectedApprover: [], search: "" },
    { name: "L2", selectedApprover: [], search: "" },
    { name: "L3", selectedApprover: [], search: "" },
  ]);

  useEffect(() => {
    if (employees) {
      setEmployee(employees.employees);
      setProjEmployees(employees.projEmployee);
    }
  }, [employees]);

  const actionTemplate = () => (
    <button style={{ border: "none", background: "transparent", cursor: "pointer" }}>
      <HiOutlineDotsHorizontal />
    </button>
  );

  const handleSelectEmp = (item) => {
    const empId = item.EMP_ID;
    if (!selectedEmp.includes(empId)) {
      setSelectedEmp((prev) => [...prev, empId]);
    } else {
      setSelectedEmp((prev) => prev.filter((id) => id !== empId));
    }
  };

  const handleLevelSelect = (item, index) => {
    const copy = [...levels];
    if (!Array.isArray(copy[index].selectedApprover)) copy[index].selectedApprover = [];

    if (!copy[index].selectedApprover.includes(item.EMP_ID)) {
      copy[index].selectedApprover.push(item.EMP_ID);
    } else {
      copy[index].selectedApprover = copy[index].selectedApprover.filter(id => id !== item.EMP_ID);
    }

    setLevels(copy);
  };

  const handleAddLevel = () => {
    setLevels((prev) => [
      ...prev,
      { name: `L${prev.length + 1}`, selectedApprover: [], search: "" },
    ]);
  };


  // console.log("levels",levels);


 useEffect(()=>{
  getHierarchy();
 },[]);


 const getHierarchy = async()=>{
  try {

    const data = await fetch(`http://localhost:3001/api/getApproveHierarchy?projectId=${rowData.PROJ_ID}&orgId=${rowData.ORG_ID}`);

    if(!data.ok)
    {
      throw new Error("Network response wasn not ok");
      
    }
    const res = await data.json();

    console.log("res",res);
    setHierarchyEmp(res.data)
    
  } catch (error) {
    console.error("Error occured",error);
    
  }
 }

  const handleApply = async()=>{

    const payload = {
      projectId:rowData.PROJ_ID,
      orgId:rowData.ORG_ID,
      empId:selectedEmp,
      levels:levels.map((level,index)=>({
        line:index+1,
        name:level.selectedApprover

      })),
      createdBy:email
    }
    console.log("payload",payload);

    try {
      
    const res = await fetch("http://localhost:3001/api/approvalHierarchy", {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(payload),

      });

       const data = await res.json();

       console.log("data",data);
       


    } catch (error) {
      console.error("Error occured",error);
      
    }
    
  }

  const handleApplyForAll = async()=>{
    console.log("handleApplyForAll");
     const payload = {
      projectId:rowData.PROJ_ID,
      orgId:rowData.ORG_ID,
      empId:selectedEmp,
      levels:levels.map((level,index)=>({
        line:index+1,
        name:level.selectedApprover

      })),
      createdBy:email
    }
    console.log("payload",payload);

      try {
      
    const res = await fetch("http://localhost:3001/api/hierarchyforAll", {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(payload),

      });

       const data = await res.json();

       console.log("data",data);
       


    } catch (error) {
      console.error("Error occured",error);
      
    }

    
  }

  
  return (
    <div style={styles.container}>
      <p>Approvals</p>

      <button style={styles.button} onClick={() => setVisible(true)}>
        <IoIosAdd size={20} /> Add Approvers
      </button>

      <DataTable
        value={hierarchyEmp}
        paginator
        rows={8}
        stripedRows
        responsiveLayout="scroll"
        style={styles.tableStyle}
      >
        <Column field="EMP_ID" header="Emp Id" headerStyle={styles.headerStyle} />
        <Column field="APPROVER_ID" header="APPROVER ID" headerStyle={styles.headerStyle} />
        <Column field="LINE_NO" header="LINE" headerStyle={styles.headerStyle} />
        <Column field="STATUS" header="STATUS" headerStyle={styles.headerStyle} />
        <Column header="Action" body={actionTemplate} headerStyle={styles.headerStyle} />
      </DataTable>

      <Dialog
        header="Add Project Approvers"
        visible={visible}
        style={styles.dialogContainer}
        onHide={() => setVisible(false)}
      >
        <div>
          <input
            type="text"
            style={styles.input}
            value={searchEmp}
            onChange={(e) => setSearchEmp(e.target.value)}
            placeholder="Search Employee"
          />

          {searchEmp && employee.filter(emp => emp.DISPLAY_NAME.toLowerCase().includes(searchEmp.toLowerCase())).length > 0 && (
            <div style={{ border: "1px solid #ddd", maxHeight: "150px", overflowY: "auto", marginTop: "5px" }}>
              {employee
                .filter(emp => emp.DISPLAY_NAME.toLowerCase().includes(searchEmp.toLowerCase()))
                .map(item => (
                  <label key={item.EMP_ID} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="checkbox"
                      checked={selectedEmp.includes(item.EMP_ID)}
                      onChange={() => handleSelectEmp(item)}
                    />
                    <span>{item.DISPLAY_NAME}</span>
                  </label>
                ))}
            </div>
          )}
        </div>

        {levels.map((level, index) => {
          const filteredEmployees = employee.filter(emp =>
            emp.DISPLAY_NAME.toLowerCase().includes(level.search.toLowerCase())
          );

          return (
            <div key={index} style={{ marginTop: "20px" }}>
              <label>Select {level.name}</label>
              <input
                type="text"
                style={styles.input}
                value={level.search}
                onChange={(e) => {
                  const copy = [...levels];
                  copy[index].search = e.target.value;
                  setLevels(copy);
                }}
                placeholder="Search Approver"
              />

              {level.search && filteredEmployees.length > 0 && (
                <div style={{ border: "1px solid #ddd", maxHeight: "150px", overflowY: "auto", marginTop: "5px" }}>
                  {filteredEmployees.map(item => (
                    <label key={item.EMP_ID} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="checkbox"
                        checked={level.selectedApprover.includes(item.EMP_ID)}
                        onChange={() => handleLevelSelect(item, index)}
                      />
                      <span>{item.DISPLAY_NAME}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <button style={{ ...styles.button, marginTop: "10px" }} onClick={handleAddLevel}>
          Add Level
        </button>
        <button onClick={handleApply}>Apply</button>

        <button onClick={handleApplyForAll}>Apply for all</button>
      </Dialog>
    </div>
  );
};

export default Approvals;
