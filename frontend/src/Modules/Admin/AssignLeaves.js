import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {  useLocation } from "react-router-dom";

const AssignLeaves = () => {
  const [employees, setEmployees] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedLeaveType, setSelectedLeaveType] = useState([]); // multiple leaves
  const companyId = useSelector((state) => state.companyId);
  const location = useLocation();
  const createdBy = location.state?.createdBy || "";

  console.log("createdBy",createdBy);
  

  useEffect(() => {
    getAllEmployees();
    getLeavesTypes();
  }, []);

  const getAllEmployees = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/showEmployeesL?companyId=${companyId}`
      );
      if (!res.ok) throw new Error("Network error while fetching employees");

      const result = await res.json();
      console.log("Employees result:", result);
      setEmployees(result.data);
    } catch (err) {
      console.error("Error occurred while fetching employees:", err);
    }
  };

  const getLeavesTypes = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getLeaveTypes?companyId=${companyId}`
      );
      if (!res.ok) throw new Error("Network error while fetching leave types");

      const response = await res.json();
      setLeaveTypes(response.data);
      console.log("Leave Types:", response.data);
    } catch (error) {
      console.error("Error occurred while fetching leave types:", error);
    }
  };

  const handleChange = (leaveId) => {
    setSelectedLeaveType((prev) =>
      prev.includes(leaveId)
        ? prev.filter((id) => id !== leaveId)
        : [...prev, leaveId]
    );
  };

  const handleLeaves = async () => {
    console.log("Selected Employee:", selectedEmployee);
    console.log("Selected Leave Types:", selectedLeaveType);

    if (!selectedEmployee || selectedLeaveType.length === 0) {
      alert("Please select both Employee and at least one Leave Type.");
      return;
    }
    if(selectedLeaveType.length !==leaveTypes.length )
    {
      alert("please select all leaves");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/assignLeaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedEmployee,
          companyId,
          selectedLeaveType,
          createdBy
        }),
      });

      const result = await res.json();
      console.log("Assign Leaves result:", result);

      if (res.ok) {
        alert("Leaves assigned successfully!");
        setSelectedEmployee("");
        setSelectedLeaveType([]);
        getAllEmployees(); 
      } else {
        alert("Failed to assign leaves. Check console for details.");
      }
    } catch (error) {
      console.error("Error occurred while assigning leaves:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <h2>Assign Leaves</h2>
      <p>Select Employee</p>
      <select
        style={{ width: 200, marginBottom: 20 }}
        value={selectedEmployee}
        onChange={(e) => setSelectedEmployee(e.target.value)}
      >
        <option value="" disabled>
          Choose Employee
        </option>
        {employees.map((item) => (
          <option key={item.EMP_ID} value={item.EMP_ID}>
            {item.FIRST_NAME} {item.LAST_NAME}
          </option>
        ))}
      </select>
      <p>Select Leave Types</p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: 20,
        }}
      >
        {leaveTypes.length === 0 ? (
          <p>No leave types found.</p>
        ) : (
          leaveTypes.map((item) => (
            <label key={item.LEAVE_ID} style={{ marginBottom: 5 }}>
              <input
                type="checkbox"
                value={item.LEAVE_ID}
                checked={selectedLeaveType.includes(item.LEAVE_ID)}
                onChange={() => handleChange(item.LEAVE_ID)}
              />
              {item.LEAVE_NAME}
            </label>
          ))
        )}
      </div>

      <button onClick={handleLeaves}>Assign Leaves</button>

      <p style={{ marginTop: 30, color: "gray" }}>
        Employees shown here are newly registered and haven’t been assigned
        leaves yet.
      </p>
    </>
  );
};

export default AssignLeaves;
