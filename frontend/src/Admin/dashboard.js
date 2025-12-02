import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUsers,FaBuilding, FaProjectDiagram } from "react-icons/fa";
import {fetchRoles} from '../Redux/actions/roleActions';


const AdminDashboard = () => {
  const companyId = useSelector((state) => state.companyId);

  
 


  const [counts, setCounts] = useState({
    empCount: 0,
    managerCount: 0,
    deptCount: 0,
    projectCount: 0,
  });

  useEffect(() => {
     const getDashboardData = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/getCount?companyId=${companyId}`);
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
    getDashboardData();
  }, [companyId]);

 

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Dashboard</h2>
      <p style={styles.subheading}>Overview of company operations</p>

      <div style={styles.cardsContainer}>
        <DashboardCard
          icon={<FaUsers size={26} color="#4B5D67" />}
          title="Total Employees"
          value={counts.empCount}
          bg="#E6EBF1"
        />
        {/* <DashboardCard
          icon={<FaUserTie size={26} color="#4B5D67" />}
          title="Total Managers"
          value={counts.managerCount}
          bg="#E9EFE6"
        /> */}
        <DashboardCard
          icon={<FaBuilding size={26} color="#4B5D67" />}
          title="Departments"
          value={counts.deptCount}
          bg="#F0ECE3"
        />
        <DashboardCard
          icon={<FaProjectDiagram size={26} color="#4B5D67" />}
          title="Active Projects"
          value={counts.projectCount}
          bg="#EDEBF5"
        />
      </div>

    </div>
  );
};

const DashboardCard = ({ icon, title, value, bg }) => (
  <div style={{ ...styles.card, backgroundColor: bg }}>
    <div style={styles.iconBox}>{icon}</div>
    <div>
      <p style={styles.cardTitle}>{title}</p>
      <h3 style={styles.cardValue}>{value}</h3>
    </div>
  </div>
);

const styles = {
  container: {
    padding: "40px",
    backgroundColor: "#F7F8FA",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },
  heading: {
    color: "#2F3E46",
    fontWeight: "700",
    fontSize: "26px",
    marginBottom: "5px",
  },
  subheading: {
    color: "#6C757D",
    marginBottom: "25px",
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    borderRadius: "14px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
    padding: "20px 25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "0.3s",
  },
  iconBox: {
    backgroundColor: "#FFFFFF",
    padding: "10px",
    borderRadius: "50%",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    color: "#5A5A5A",
    fontSize: "15px",
    margin: "0",
  },
  cardValue: {
    color: "#2F3E46",
    fontSize: "24px",
    fontWeight: "700",
    marginTop: "5px",
  },
  bottomSection: {
    marginTop: "40px",
  },
  sectionTitle: {
    fontSize: "20px",
    color: "#2F3E46",
    marginBottom: "15px",
  },
  quickLinks: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
  },
  linkBtn: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "1px solid #C0C4C8",
    backgroundColor: "#FFFFFF",
    color: "#4B5D67",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default AdminDashboard;
