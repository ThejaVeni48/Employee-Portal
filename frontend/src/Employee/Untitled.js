import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("To Do");
  const [project, setProject] = useState([]);
  const [assignee, setAssignee] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const companyId = useSelector((state) => state.companyId);
  const empId = useSelector((state) => state.empId);
  const [selectedProject,setSelectedProject] = useState('');

  const assigneesList = ["Abir Hasan", "John Smith", "Abir Ha"];

  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#f9fafc",
      fontFamily: "Arial, sans-serif",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "600",
      color: "#1c3681",
      marginBottom: "20px",
    },
    filtersRow: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "20px",
    },
    select: {
      padding: "8px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    },
    searchInput: {
      flex: 1,
      padding: "8px 10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    },
    addButton: {
      backgroundColor: "#1c3681",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "8px 16px",
      cursor: "pointer",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    },
    th: {
      textAlign: "left",
      padding: "12px",
      backgroundColor: "#f2f4f8",
      color: "#333",
      fontWeight: "600",
    },
    td: {
      padding: "12px",
      borderTop: "1px solid #eee",
    },
    dropdown: {
      position: "absolute",
      backgroundColor: "white",
      border: "1px solid #ddd",
      borderRadius: "8px",
      marginTop: "4px",
      width: "160px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      zIndex: 1,
    },
    dropdownItem: {
      padding: "8px 10px",
      cursor: "pointer",
    },
  };

  useEffect(()=>{
    const getActiveProjects = async()=>{
        try {
            const data = await fetch(`http://localhost:3001/api/activeProject?empId=${empId}&companyId=${companyId}`);

            if(!data.ok)
            {
                throw new Error("Network was not ok");
                
            }

            const response = await data.json();

            console.log("response ",response);
            setProject(response.data)
            

            
        } catch (error) {
            console.error("Error occured",error);
            
        }

    }
      getActiveProjects();
  },[empId,companyId])

  console.log("projects",project);
  





  return (
    <div style={styles.container}>
      <p style={styles.title}>Tasks</p>

      {/* Filters Row */}
      <div style={styles.filtersRow}>
<select
  style={styles.select}
  value={selectedProject}
  onChange={(e) => setSelectedProject(e.target.value)}
>
  <option value="">Select Project</option>
  {project.map((item, index) => (
    <option key={index} value={item.PROJECT_NAME}>
      {item.PROJECT_NAME}
    </option>
  ))}
</select>


        <div style={{ position: "relative" }}>
          <input
            style={styles.select}
            placeholder="Select Assignee"
            value={assignee}
            readOnly
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div style={styles.dropdown}>
              {assigneesList.map((a, i) => (
                <div
                  key={i}
                  style={styles.dropdownItem}
                  onClick={() => {
                    setAssignee(a);
                    setShowDropdown(false);
                  }}
                >
                  {a}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* <input
          style={styles.searchInput}
          placeholder="Search by task name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        /> */}

        <select
          style={styles.select}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>To Do</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <button style={styles.addButton}>+ Add Task</button>
      </div>

      {/* Task Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Task Name</th>
            <th style={styles.th}>Project</th>
            <th style={styles.th}>Time Worked</th>
            <th style={styles.th}>Assignees</th>
            <th style={styles.th}>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id}>
              <td style={styles.td}>{t.taskName}</td>
              <td style={styles.td}>{t.project}</td>
              <td style={styles.td}>{t.timeWorked}</td>
              <td style={styles.td}>{t.assignee || assignee || "—"}</td>
              <td style={styles.td}>{t.createdDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tasks;