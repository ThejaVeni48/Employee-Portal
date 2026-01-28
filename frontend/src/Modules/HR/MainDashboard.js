import React, { useState, useEffect } from "react";

import { Card } from "primereact/card";

import { Toast } from "primereact/toast";
import "./MainDashboard.css";
import { useSelector } from "react-redux";

const HRDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const companyId = useSelector((state) => state.companyId);
  const empId = useSelector((state) => state.empId);
  // const [newEmp, setNewEmp] = useState({ name: "", role: "", department: "", status: "Active" });
  const toast = React.useRef(null);

  const [counts, setCounts] = useState({
    empCount: 0,
    managerCount: 0,
    deptCount: 0,
    projectCount: 0,
  });

  useEffect(() => {
    getDashboardData();
    getAllEmployees();
  }, []);
  const getAllEmployees = async () => {
    console.log("employees tr");

    try {
      const res = await fetch(
        `http://localhost:3001/api/getEmp?companyId=${companyId}&empId=${empId}`
      );
      if (!res) {
        throw new Error("Network was not ok");
      }
      const result = await res.json();
      console.log("result for empoyees", result);
      setEmployees(result.data);
      // setFilteredData(result.data);
    } catch (err) {
      console.error("error occured", err);
    }
  };

  const getDashboardData = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getCount?companyId=${companyId}`
      );
      const data = await res.json();
      setCounts({
        empCount: data.employeeCount,
        managerCount: data.managerCount,
        deptCount: data.departmentCount,
        projectCount: data.projectCount,
      });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
  };
  // const statusBody = (rowData) => (
  //   <Tag
  //     value={rowData.status}
  //     severity={rowData.status === "Active" ? "success" : "danger"}
  //   />
  // );

  return (
    <div className="hr-dashboard">
      <Toast ref={toast} />

      <div className="dashboard-header"></div>

      <div className="cards-row">
        <Card title="Total Employees" className="stat-card">
          {counts.empCount}
        </Card>
        <Card title="Active Projects" className="stat-card">
          {counts.projectCount}
        </Card>
        <Card title="Departments" className="stat-card">
          {counts.deptCount}
        </Card>
      </div>

      <div className="table-section">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>ID</th>
              {/* <th>Status</th> */}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>
                  {emp.FIRST_NAME} {emp.LAST_NAME}
                </td>

                <td>{emp.ROLE}</td>
                <td>{emp.EMP_ID}</td>
                {/* <td>{statusBody(emp)}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Dialog */}
    </div>
  );
};

export default HRDashboard;
