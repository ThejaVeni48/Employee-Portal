import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const AllEmployees = () => {
  // const location = useLocation();
  const [empList, setEmpList] = useState([]);
  console.log("empList", empList);
  const empId = useSelector((state) => state.empId);
  const companyId = useSelector((state) => state.companyId);

  const [filteredData, setFilteredData] = useState(empList);
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);

    if (text.trim() === "") {
      setFilteredData(empList);
    } else {
      const filtered = empList.filter(
        (emp) =>
          emp.FIRST_NAME.toLowerCase().includes(text.toLowerCase()) ||
          emp.LAST_NAME.toLowerCase().includes(text.toLowerCase()) ||
          emp.ROLE.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };
  useEffect(() => {
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
      console.log("result", result);
      setEmpList(result.data);
      setFilteredData(result.data);
    } catch (err) {
      console.error("error occured", err);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f7f9fc",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h2
        style={{
          color: "#1c3681",
          marginBottom: "20px",
          fontWeight: "600",
          letterSpacing: "0.5px",
        }}
      >
        All Employees
      </h2>

      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "25px",
        }}
      >
        <input
          type="text"
          value={searchText}
          onChange={handleSearch}
          placeholder=" Search employee by name or role..."
          style={{
            width: "60%",
            padding: "12px 18px",
            borderRadius: "30px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "15px",
            boxShadow: "0 0 6px rgba(0,0,0,0.1)",
          }}
        />
      </div>

      {filteredData.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredData.map((emp, index) => (
            <div
              key={index}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  {emp.FIRST_NAME}
                  {emp.LAST_NAME}
                </h3>
                <span
                  style={{
                    backgroundColor:
                      emp.ROLE === "Admin" ? "#1c3681" : "#3b82f6",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  {emp.ROLE}
                </span>
              </div>

              {/* <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}>
                <strong>Gender:</strong> {emp.GENDER}
              </p> */}

              <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}>
                <strong>Email:</strong> {emp.EMAIL}
              </p>

              <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}>
                <strong>Department:</strong> {emp.DEPT_NAME || "—"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p
          style={{
            textAlign: "center",
            color: "#888",
            marginTop: "50px",
            fontSize: "16px",
          }}
        >
          No employees found.
        </p>
      )}
    </div>
  );
};

export default AllEmployees;
