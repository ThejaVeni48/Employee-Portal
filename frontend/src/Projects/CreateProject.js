import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import {  useSelector } from "react-redux";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineFileUpload } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";




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



const CreateProject = ()=>{


 const email = useSelector((state) => state.user.email);
  const empId = useSelector((state) => state.user.empId);
const accessCode = useSelector((state) => state.user.accessCode);
  const companyId = useSelector((state) => state.user.companyId);
  const [visible, setVisible] = useState(false);
const [projectCode,setProjectCode] = useState('');
  const [supportId,setSupportId] = useState('');
  const [projDesc,setProjDesc] = useState('');
  const [approverId,setApproverId] = useState('');
  const [status,setStatus] = useState('');
  const [clientId,setClientId] = useState('');
  const [clientName,setClientName] = useState('');
  const [billable,setBillable] = useState('');
  const [hierachy,setHierachy] = useState('');
const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [notes,setNotes] = useState('');


    // ---------- Create Project ----------
    const handleCreateProject = async () => {
      if (!projectName || !startDate || !endDate ) {
        alert("Please fill required details");
        return;
      }
  
      try {
        const res = await fetch
        ("http://localhost:3001/api/addProject", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectName,
            startDate: moment(startDate).format("YYYY-MM-DD"),
            endDate: moment(endDate).format("YYYY-MM-DD"),
            projectCode,
            projDesc,
            supportId,
            status,
            clientId,
            clientName,
            billable,
            hierachy,
            companyId,
            email,
            notes
          }),
        });
  
        const data = await res.json();
        console.log("DATA",data);
        
      
      } catch (err) {
        console.error(err);
      }
    };

    const resetForm = () => {
        setProjectName("");
        setStartDate(null);
        setEndDate(null);
        // setSelectedPM("");
      };
    
    return(
        <>
      
        <div style={styles.toolbar}>
                 <button style={styles.button} onClick={() => setVisible(true)}>
                   <IoIosAdd size={20} /> Add New Projectsssss
                 </button>
                 <button style={styles.button}>
                   <MdOutlineFileUpload size={20} /> Upload File
                 </button>
               </div>
       
        
        
        <Dialog
  header="Add Project"
  visible={visible}
  style={{ width: "500px", borderRadius: "8px" }}
  onHide={() => setVisible(false)}
>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      padding: "10px 0",
    }}
  >
    {/* Project Name */}
    <div style={{ display: "flex", alignItems: "center" }}>
      <label style={{ width: "130px", fontWeight: "500", color: "#333" }}>
        Project Name <span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        placeholder="Enter project name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          fontSize: "14px",
        }}
      />
    </div>

    {/* Project Code */}
    <div style={{ display: "flex", alignItems: "center" }}>
      <label style={{ width: "130px", fontWeight: "500", color: "#333" }}>
        Project Code <span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        placeholder="Enter project code"
        value={projectCode}
        onChange={(e) => setProjectCode(e.target.value)}
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          fontSize: "14px",
        }}
      />
    </div>

    {/* Project Description */}
    <div style={{ display: "flex", alignItems: "center" }}>
      <label style={{ width: "130px", fontWeight: "500", color: "#333" }}>
        Project Desc <span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        placeholder="Enter project desc"
        value={projDesc}
        onChange={(e) => setProjDesc(e.target.value)}
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          fontSize: "14px",
        }}
      />
    </div>

    {/* Support Identifier */}
    <div style={{ display: "flex", alignItems: "center" }}>
      <label style={{ width: "130px", fontWeight: "500", color: "#333" }}>
        Support Identifier <span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        placeholder="Enter Support Identifier"
        value={supportId}
        onChange={(e) => setSupportId(e.target.value)}
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          fontSize: "14px",
        }}
      />
    </div>

    {/* Current Status (Dropdown) */}
    <div style={{ display: "flex", alignItems: "center" }}>
      <label style={{ width: "130px", fontWeight: "500", color: "#333" }}>
        Current Status <span style={{ color: "red" }}>*</span>
      </label>

      <Dropdown
        value={status}
        options={[
          { label: "Active", value: "ACTIVE" },
          { label: "On Hold", value: "ON_HOLD" },
          { label: "Completed", value: "COMPLETED" },
        ]}
        onChange={(e) => setStatus(e.value)}
        placeholder="Select status"
        style={{ flex: 1 }}
      />
    </div>

    {/* Client ID */}
    <div style={{ display: "flex", alignItems: "center" }}>
      <label style={{ width: "130px", fontWeight: "500", color: "#333" }}>
        Client ID <span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        placeholder="Enter client ID"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          fontSize: "14px",
        }}
      />
    </div>

    {/* Client Name */}
    <div style={{ display: "flex", alignItems: "center" }}>
      <label style={{ width: "130px", fontWeight: "500", color: "#333" }}>
        Client Name <span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        placeholder="Enter client name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          fontSize: "14px",
        }}
      />
    </div>

    {/* Billable (Checkbox) */}
    <div style={{ display: "flex", alignItems: "center" }}>
      <label style={{ width: "130px", fontWeight: "500", color: "#333" }}>
        Billable <span style={{ color: "red" }}>*</span>
      </label>

      <Checkbox
        checked={billable === "YES"}
        onChange={(e) => setBillable(e.checked ? "YES" : "NO")}
      />
      <span style={{ marginLeft: "8px" }}>{billable === "YES" ? "YES" : "NO"}</span>
    </div>
        {/* Notes */}
     <div style={{ display: "flex", alignItems: "center" }}>
      <label style={{ width: "130px", fontWeight: "500", color: "#333" }}>
        Notes <span style={{ color: "red" }}>*</span>
      </label>

      <Checkbox
        checked={notes === "YES"}
        onChange={(e) => setNotes(e.checked ? "YES" : "NO")}
      />
      <span style={{ marginLeft: "8px" }}>{notes === "YES" ? "YES" : "NO"}</span>
    </div>

    {/* Hierarchy (Checkbox) */}
    <div style={{ display: "flex", alignItems: "center" }}>
      <label style={{ width: "130px", fontWeight: "500", color: "#333" }}>
        Hierarchy <span style={{ color: "red" }}>*</span>
      </label>

      <Checkbox
        checked={hierachy === "YES"}
        onChange={(e) => setHierachy(e.checked ? "YES" : "NO")}
      />
      <span style={{ marginLeft: "8px" }}>{hierachy === "YES" ? "YES" : "NO"}</span>
    </div>

    {/* Start Date */}
    <div style={{ display: "flex", alignItems: "center" }}>
      <label style={{ width: "130px", fontWeight: "500", color: "#333" }}>
        Start Date <span style={{ color: "red" }}>*</span>
      </label>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="yyyy-MM-dd"
        placeholderText="Select start date"
      />
    </div>

    {/* End Date */}
    <div style={{ display: "flex", alignItems: "center" }}>
      <label style={{ width: "130px", fontWeight: "500", color: "#333" }}>
        End Date <span style={{ color: "red" }}>*</span>
      </label>
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        dateFormat="yyyy-MM-dd"
        placeholderText="Select end date"
      />
    </div>

    {/* Submit Button */}
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
          transition: "0.3s",
        }}
        onClick={handleCreateProject}
      >
        Create Project
      </button>
    </div>
  </div>
</Dialog>
        </>
    )








}


export default CreateProject