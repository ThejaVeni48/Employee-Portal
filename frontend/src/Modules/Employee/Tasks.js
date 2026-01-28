import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { useSelector } from "react-redux";
import { IoIosAdd } from "react-icons/io";
import { Calendar } from "primereact/calendar";
import moment from "moment";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("To Do");
  const [project, setProject] = useState([]);
  const [assigneeList, setAssigneeList] = useState([]);
  const [assignee, setAssignee] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [visible, setVisible] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const companyId = useSelector((state) => state.companyId);
  const empId = useSelector((state) => state.empId);

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

  useEffect(() => {
  const fetchEmployeeTasks = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/EmpTask?empId=${empId}&companyId=${companyId}`
      );
      const data = await res.json();
      if (data.success) {
        // setTasks(data.data);
        console.log("Task",data);
        
      }
    } catch (error) {
      console.error("Error fetching employee tasks:", error);
    }
  };

  if (empId && companyId) fetchEmployeeTasks();
}, [empId, companyId]);

  useEffect(() => {
    const getActiveProjects = async () => {
      try {
        const data = await fetch(
          `http://localhost:3001/api/activeProject?empId=${empId}&companyId=${companyId}`
        );

        if (!data.ok) throw new Error("Network was not ok");

        const response = await data.json();
        console.log("Active Projects Response:", response);
        setProject(response.data);
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };

    if (empId && companyId) getActiveProjects();
  }, [empId, companyId]);

  const handleSelectProject = (e) => {
    const selectedProjectId = e.target.value;
    setSelectedProject(selectedProjectId);

    const selected = project.find(
      (p) => p.PROJECT_ID === parseInt(selectedProjectId)
    );
    if (selected) {
      setProjectCode(selected.PROJECT_CODE);
      getProjectEmployee(selected.PROJECT_ID, selected.PROJECT_CODE);
    }
  };

  const getProjectEmployee = async (projectId, projectCode) => {
    try {
      const data = await fetch(
        `http://localhost:3001/api/getProjectEmployee?companyId=${companyId}&projectId=${projectId}&projectCode=${projectCode}`
      );

      if (!data.ok) throw new Error("Network response was not ok");

      const response = await data.json();
      console.log("Project Employees Response:", response.data);
      setAssigneeList(response.data);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };
  useEffect(() => {
  const fetchTasks = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/getTasks?companyId=${companyId}&empId=${empId}`);
      const data = await res.json();
      if (data.success) setTasks(data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  if (companyId && empId) fetchTasks();
}, [companyId, empId]);


  // ✅ Handle Create Task
  const handleCreateTask = async () => {
    if (!selectedProject || !assignee || !taskName || !startDate || !endDate) {
      alert("Please fill all fields before submitting.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/createTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskName,
          startDate: moment(startDate).format("YYYY-MM-DD"),
          endDate: moment(endDate).format("YYYY-MM-DD"),
          assignee,
          companyId,
          empId,
          status,
          projectId: selectedProject,
          projectCode,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert("✅ Task created successfully!");
        setVisible(false);
        setTaskName("");
        setAssignee("");
        setStartDate(null);
        setEndDate(null);
        setSelectedProject("");
      } else {
        alert(result.message || "Failed to create task.");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Error occurred while creating the task.");
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={styles.title}>Tasks</div>

        <div style={styles.toolbar}>
          <button style={styles.button} onClick={() => setVisible(true)}>
            <IoIosAdd size={20} /> Add Task
          </button>
        </div>

        <DataTable
          value={tasks}
          paginator
          rows={8}
          stripedRows
          responsiveLayout="scroll"
          emptyMessage="No tasks found."
          style={styles.tableStyle}
        >
          <Column
            field="TASK_NAME"
            header="Task"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
          <Column
            field="PROJECT_NAME"
            header="Project"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
          <Column
            field="ASSIGNEE"
            header="Assignee"
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
            field="CREATED_DATE"
            header="Date"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
          <Column
            header="Action"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
        </DataTable>
      </Card>

      {/* ✅ Add Task Dialog */}
      <Dialog
        header="Add Task"
        visible={visible}
        style={{ width: "35vw", borderRadius: "12px" }}
        onHide={() => setVisible(false)}
      >
        <div style={styles.dialogBody}>
          <label>Select Project</label>
          <select
            style={styles.input}
            value={selectedProject}
            onChange={handleSelectProject}
          >
            <option value="">Select Project</option>
            {project.map((item, index) => (
              <option key={index} value={item.PROJECT_ID}>
                {item.PROJECT_NAME}
              </option>
            ))}
          </select>

          <label>Select Employee</label>
          <select
            style={styles.input}
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option value="">Select Employee</option>
            {assigneeList.map((item, index) => (
              <option key={index} value={item.EMP_ID}>
                {item.FIRST_NAME} {item.LAST_NAME}
              </option>
            ))}
          </select>

          <label>Start Date</label>
          <Calendar
            value={startDate}
            onChange={(e) => setStartDate(e.value)}
            showIcon
            style={{ width: "100%" }}
          />

          <label>Task Name</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            style={styles.input}
            placeholder="Enter task name"
          />

          <label>End Date</label>
          <Calendar
            value={endDate}
            onChange={(e) => setEndDate(e.value)}
            showIcon
            style={{ width: "100%" }}
          />

          <button style={styles.dialogButton} onClick={handleCreateTask}>
            Create Task
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default Tasks;
