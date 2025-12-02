// not in use


import React, { useEffect, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const ProjectsEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState([]);
  const [projectEmp, setProjectEmp] = useState([]);
  const companyId = useSelector((state) => state.companyId);
  const location = useLocation();
  const { item = {}, createdBy = "" } = location.state || {};
  const projectId = item.PROJECT_NO;

  useEffect(() => {
    showEmployees();
    projectEmployees();
  }, []);

  const showEmployees = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/showDeptEmp?companyId=${companyId}`
      );
      const data = await res.json();
      setEmployees(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const projectEmployees = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/assignedEmpP?projectId=${projectId}&companyId=${companyId}`
      );
      const data = await res.json();
      setProjectEmp(data.data || []);
    } catch (err) {
      console.error(err);
    }
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
  };

  const handleAssignProject = async () => {
    if (selectedEmp.length === 0) return alert("Select at least one employee");
    try {
      const res = await fetch("http://localhost:3001/api/assignProject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, selectedEmp, projectId, createdBy }),
      });
      const data = await res.json();
      if (data.status === 201) {
        alert("Employees assigned successfully!");
        setSelectedEmp([]);
        projectEmployees();
        showEmployees();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const styles = {
    container: {
      padding: "30px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      textAlign: "center",
      fontSize: "28px",
      fontWeight: "600",
      color: "#1c3681",
      marginBottom: "25px",
    },
    tabNav: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      marginBottom: "15px",
    },
    tab: {
      padding: "8px 20px",
      borderRadius: "8px 8px 0 0",
      backgroundColor: "#c3c8e0",
      color: "#1c3681",
      fontWeight: "500",
      cursor: "pointer",
      transition: "0.3s",
    },
    tabActive: {
      backgroundColor: "#1c3681",
      color: "#fff",
    },
    tabPanel: {
      padding: "20px",
      borderRadius: "0 0 8px 8px",
      backgroundColor: "#f7f8fc",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "15px",
    },
    th: {
      padding: "12px",
      backgroundColor: "#c3c8e0",
      color: "#1c3681",
      fontWeight: "600",
      textAlign: "left",
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #eee",
      fontSize: "14px",
    },
    assignBtn: {
      padding: "10px 20px",
      backgroundColor: "#1c3681",
      color: "#fff",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
      marginTop: "10px",
      border: "none",
      transition: "0.3s",
    },
    selectedList: {
      marginTop: "15px",
      padding: "10px",
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },
    selectedItem: { padding: "5px 0", borderBottom: "1px solid #eee" },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Project Employee Assignment</h2>

      <div style={styles.tabPanel}>
        <TabView>
          <TabPanel header="Available Employees">
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Select</th>
                  <th style={styles.th}>Employee Name</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Employee Id</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.EMP_ID}>
                    <td style={styles.td}>
                      <input
                        type="checkbox"
                        onChange={() => handleChange(emp)}
                        checked={selectedEmp.some(
                          (e) => e.EMP_ID === emp.EMP_ID
                        )}
                      />
                    </td>
                    <td style={styles.td}>{emp.DISPLAY_NAME}</td>
                    <td style={styles.td}>{emp.DEPT_NAME}</td>
                    <td style={styles.td}>{emp.EMP_ID}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button style={styles.assignBtn} onClick={handleAssignProject}>
              Assign Selected
            </button>

            {selectedEmp.length > 0 && (
              <div style={styles.selectedList}>
                <h4>Selected Employees:</h4>
                {selectedEmp.map((emp) => (
                  <div key={emp.EMP_ID} style={styles.selectedItem}>
                    {emp.EMP_ID} — {emp.DEPARTMENT}
                  </div>
                ))}
              </div>
            )}
          </TabPanel>

          <TabPanel header="Assigned Employees">
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Employee Name</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Employee Id</th>
                  <th style={styles.th}>Assigned Date</th>
                </tr>
              </thead>
              <tbody>
                {projectEmp.map((emp) => (
                  <tr key={emp.EMP_ID}>
                    <td style={styles.td}>{emp.DISPLAY_NAME}</td>
                    <td style={styles.td}>{emp.DEPARTMENT}</td>
                    <td style={styles.td}>{emp.EMP_ID}</td>
                    <td style={styles.td}>{emp.ASSIGNED_DATE}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default ProjectsEmployee;
