import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AssignmentPage = () => {
  const [projectId,setProjectId] = useState('');
  const companyId = useSelector((state) => state.companyId);
  const empId = useSelector((state) => state.empId);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [projectName,setProjectName] = useState('');
    const role = useSelector((state) => state.Role);
  

    console.log("role",role);
    
   useEffect(() => {
        getProjects();
      }, []); 
      
       useEffect(() => {
    if (projectId) {
      getTasks();
    } else {
      setError("Missing required parameters (projectId, companyId, or empId)");
      setLoading(false);
    }
  }, [projectId]);
    
      const getProjects = async () => {
        try {
          const data = await fetch(
            `http://localhost:3001/api/getProjects?empId=${empId}&companyId=${companyId}`
          );
    
          if (!data.ok) {
            throw new Error("Network response was not ok");
          }
    
          const res = await data.json();
          console.log("res for get projects", res.data);
    setProjectId(res.data[0].PROJECT_NO)
    setProjectName(res.data[0].PROJECT_NAME)
        
        } catch (error) {
          console.error("Error occurred:", error);
        }
      };

  const getTasks = async () => {
    console.log("Fetching tasks..."); 
    console.log("Request sent at:", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
    try {
      setLoading(true);
const response = await fetch(
  `http://localhost:3001/api/getTask?projectId=${projectId}&companyId=${companyId}&empId=${empId}&role=${role}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        console.log("data",data.data);
        
        setTasks(data.data);
      } else {
        throw new Error(data.message || "Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError(error.message || "Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 

  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}> Tasks for Project {projectName}</h1>
    
      {tasks.length > 0 ? (
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>Task Name</th>
                <th style={styles.tableHeaderCell}>Start Date</th>
                <th style={styles.tableHeaderCell}>End Date</th>
                <th style={styles.tableHeaderCell}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index} style={styles.tableRow}>
                  <td style={styles.tableCell}>{task.TASK_NAME || "—"}</td>
                  <td style={styles.tableCell}>{task.TASK_START_DATE || "—"}</td>
                  <td style={styles.tableCell}>{task.TASK_END_DATE || "—"}</td>
                  <td style={styles.tableCell}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor:
                          task.TASK_STATUS === "Completed"
                            ? "#28a745"
                            : task.TASK_STATUS === "In Progress"
                            ? "#ffc107"
                            : "#6c757d",
                      }}
                    >
                      {task.TASK_STATUS || "Not Started"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button style={styles.button} onClick={handleBack}>
            ← Back to Projects
          </button>
        </div>
      ) : (
        !loading && !error && <p style={styles.noData}>No tasks available</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  tableHeader: {
    backgroundColor: "#ecf0f1",
  },
  tableHeaderCell: {
    padding: "12px",
    textAlign: "left",
    color: "#2c3e50",
    fontWeight: "600",
    borderBottom: "2px solid #ddd",
  },
  tableRow: {
    borderBottom: "1px solid #eee",
    transition: "background-color 0.2s",
  },
  
  tableCell: {
    padding: "12px",
    color: "#34495e",
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "12px",
    textAlign: "center",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600",
  },
 
  loading: {
    textAlign: "center",
    color: "#34495e",
    padding: "20px",
  },
  error: {
    color: "#e74c3c",
    textAlign: "center",
    padding: "10px",
    backgroundColor: "#fdecea",
    borderRadius: "5px",
    marginBottom: "15px",
  },
  noData: {
    textAlign: "center",
    color: "#7f8c8d",
    padding: "20px",
  },
};

export default AssignmentPage;