import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";
import { useSelector } from "react-redux";
import styles from "./company.module.css";

const CompaniesList = () => {
  const userId = useSelector((state) => state.user.userId);
  const [companies, setCompanies] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    getAllCompanies();
  }, []);

  const getAllCompanies = async () => {
    try {
      const data = await fetch("http://localhost:3001/api/CompaniesList");
      const response = await data.json();
      setCompanies(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error occurred", error);
    }
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);

    if (status === "All") {
      setFilteredData(companies);
      return;
    }

    const statusMap = {
      Approved: "A",
      Pending: "P",
      Rejected: "R",
    };

    setFilteredData(
      companies.filter((item) => item.STATUS === statusMap[status])
    );
  };

  const openModal = (rowData) => {
    setSelectedCompany(rowData);
    setRemarks("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCompany(null);
    setRemarks("");
  };

  const updateStatus = async (status) => {
    console.log("companyId", selectedCompany.ORG_ID);
    console.log("status", status);


    try {
      await fetch("http://localhost:3001/api/approveRejectOrg", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: selectedCompany.ORG_ID,
          status,
          remarks,
          userId,
        }),
        
      });

      closeModal();
      getAllCompanies();

    } catch (error) {
      console.error("Error occurred", error);
    }
  };

  const actionTemplate = (rowData) => (
    <button
      onClick={() => openModal(rowData)}
      style={{
        border: "none",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      <HiOutlineDotsHorizontal size={18} />
    </button>
  );

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.buttonGroup}>
          {["All", "Approved", "Pending", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`${styles.button} ${
                filterStatus === status ? styles.activeButton : ""
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        value={filteredData}
        paginator
        rows={8}
        stripedRows
        className={styles.tableStyle}
      >
        <Column field="ORG_NAME" header="Organization" />
        <Column field="ORG_STATUS" header="Status" />
        <Column field="START_DATE" header="Start Date" />
        <Column field="END_DATE" header="End Date" />
        <Column field="A_R_BY" header="Approved / Rejected By" />
        <Column header="Action" body={actionTemplate} />
      </DataTable>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3>Approval Action</h3>
              <button onClick={closeModal} className={styles.closeBtn}>
                <IoIosClose size={24} />
              </button>
            </div>

            <textarea
              placeholder="Enter remarks..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className={styles.remarksInput}
            />

            <div className={styles.modalActions}>
              <button
                className={styles.approveBtn}
                onClick={() => updateStatus("A")}
              >
                Approve
              </button>
              <button
                className={styles.rejectBtn}
                onClick={() => updateStatus("R")}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompaniesList;
