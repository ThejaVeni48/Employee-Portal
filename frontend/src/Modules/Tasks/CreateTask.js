import React, { useState } from "react";
import { useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";


  const styles = {
    container: { minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
    card: { borderRadius: "12px", backgroundColor: "transparent" },
    title: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#1c3681",
      marginBottom: "1rem",
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
      flexWrap: "wrap",
      gap: "1rem",
    },
    buttonGroup: { display: "flex", gap: "0.75rem" },
    button: {
      padding: "0.5rem",
      borderRadius: "8px",
      border: "none",
      background: "#cfdaf1",
      color: "white",
      fontSize: "0.9rem",
      cursor: "pointer",
      transition: "background 0.2s ease-in-out",
    },
    tableStyle: {
      width: "100%",
      fontSize: "0.9rem",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      backgroundColor:'red'
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
    dialogBody: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      padding: "10px",
    },
    input: {
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
      outline: "none",
    },
    dialogButton: {
      alignSelf: "flex-end",
      backgroundColor: "#1c3681",
      color: "white",
      border: "none",
      padding: "0.6rem 1.2rem",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
    },
  };


const CreateTask = ({projectId,taskCreated})=>{

    const [taskType,setTaskType] = useState('');
    const [description, setDescription] = useState("");
        const [code,setCode] = useState('');
    
     const companyId = useSelector((state) => state.user.companyId);
 const email = useSelector((state) => state.user.email);
  const role = useSelector((state) => state.user.Role);
  const [visible, setVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const projId = projectId.projectId;

console.log("projId",projId);
//   console.log("projectid",projectId);
  




  const handleCreateTask = async()=>{
         try {
           const res = await fetch
           ("http://localhost:3001/api/createTask", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
               taskType,
               description,
               code,
               projectId:projId.projectId,
               companyId,
               email,
             }),
           });
     
           const data = await res.json();
           console.log("DATA",data);
           taskCreated();
           
         
         } catch (error) {
      console.error("Error occured",error);
      
    }
    
  }

    return(
        <div style={styles.container}>
       
             
              
                          <Card style={styles.card}>
               <div style={styles.title}>Task Management</div>
       
               <div style={styles.toolbar}>
                 <div style={styles.buttonGroup}>
                   <div style={{ display: "flex", gap: "10px" }}>
                     <button onClick={() => setVisible(true)} style={styles.button}>
                       <IoIosAdd size={20} /> New Task
                     </button>
                   <button
         style={styles.button}
         onClick={() => document.getElementById("fileInput").click()}
       >
         <MdOutlineFileUpload size={20} /> Upload File
       </button>
       
       <input
         id="fileInput"
         type="file"
         accept=".csv, .xlsx"
         style={{ display: "none" }}
        //  onChange={handleFileChange}
       />
       
                   </div>
                 </div>
               </div>
       
               
             </Card>
             <Dialog
               header="Add Role"
               visible={visible}
               style={{ width: "35vw", borderRadius: "12px" }}
               onHide={() => setVisible(false)}
             >
               <div style={styles.dialogBody}>
                 <span style={{ color: "red" }}>*</span>
                 <label style={{ fontWeight: "600", color: "#2e3e50" }}>
                   Task Name
                 </label>
                 <input
                   type="text"
                   value={taskType}
                   onChange={(e) => setTaskType(e.target.value)}
                   style={styles.input}
                   placeholder="Enter department name"
                 />
                 <span style={{ color: "red" }}>*</span>
          <label style={{ fontWeight: "600", color: "#2e3e50" }}>
            Task Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
            placeholder="Enter Description"
          />

           <span style={{ color: "red" }}>*</span>
          <label style={{ fontWeight: "600", color: "#2e3e50" }}>
            Task Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={styles.input}
            placeholder="Enter Role Code"
          />
                 
                 <button style={styles.dialogButton} onClick={handleCreateTask}>
                   Add Task
                 </button>
               </div>
             </Dialog>
             
           </div>
    )






}


export default CreateTask