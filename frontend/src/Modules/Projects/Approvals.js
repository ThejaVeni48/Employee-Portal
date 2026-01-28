import React, { useState } from "react";
import TableComponent from "../../components/Table/Table";
import AppModal from "../../components/Modals/AddModal";
import useModal from "../../components/hooks/useModal";
import { Button } from "flowbite-react";
import { useSelector } from "react-redux";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHierarchy } from "../../apis/Project/updateHierarchy";
import toast from "react-hot-toast";

const Approvals = ({ approvals = [], project, employeesList = [] }) => {


  console.log("project",project);
  
  const columns = [
    { header: "Approval Name", accessor: "DISPLAY_NAME" },
    { header: "Level No", accessor: "LEVEL_NO" },
    { header: "Start Date", accessor: "START_DATE" },
    {
      header: "Status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.STATUS === "A"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.STATUS === "A" ? "Active" : "Inactive"}
        </span>
      )
    }
  ];

  /* ---------------- MODAL ---------------- */

  const { openModal, open, closeModal } = useModal();
  const companyId = useSelector((state) => state.user.companyId);
  const email = useSelector((state) => state.user.email);

  /* ---------------- STATE ---------------- */

  const [selectedRow, setSelectedRow] = useState(null);
  const [newEmpId, setNewEmpId] = useState("");
  const [startDate, setStartDate] = useState("");

  /* ---------------- TANSTACK ---------------- */

  const queryClient = useQueryClient();

  const replaceMutation = useMutation({
    mutationFn: updateHierarchy,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["approverList", project?.ORG_ID, project?.PROJ_ID]
      });

      toast.success("Approver replaced successfully");

      closeModal();
    },

    onError: () => {
      toast.error("Failed to replace approver");
    }
  });

  const projectId = project[0].PROJ_ID;


  console.log("prjectId",projectId);
  

  /* ---------------- HANDLERS ---------------- */

  const handleEdit = (row) => {
    setSelectedRow(row);
    setNewEmpId("");
    setStartDate("");
    openModal();
  };

  const handleSaveReplace = () => {
    replaceMutation.mutate({
      projId: projectId,
      orgId: companyId,
      levelNo: selectedRow.LEVEL_NO,
      oldEmpId: selectedRow.EMP_ID,
      newEmpId,
      startDate
    });
  };

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <p className="mb-3 font-medium">Approvals</p>

      <TableComponent
        columns={columns}
        data={approvals}
        keyField="APPROVER_ID"
        emptyText="No Approvals"
        actions={(row) => (
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 underline text-sm"
          >
            Replace
          </button>
        )}
      />

      {/* ---------------- MODAL ---------------- */}

      <AppModal
        isOpen={open}
        onClose={closeModal}
        size="md"
        title={
          selectedRow
            ? `Replace Approver – Level ${selectedRow.LEVEL_NO}`
            : "Replace Approver"
        }
        footer={
          <>
            <Button color="gray" onClick={closeModal}>
              Cancel
            </Button>

            <Button
              className="bg-[#1c3681]"
              onClick={handleSaveReplace}
              disabled={
                replaceMutation.isPending ||
                !newEmpId ||
                !startDate
              }
            >
              {replaceMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </>
        }
      >
        {selectedRow && (
          <div className="space-y-4">

            <p className="text-sm text-gray-500">
              You are replacing approver for Level{" "}
              <strong>{selectedRow.LEVEL_NO}</strong>
            </p>

            <div>
              <label className="text-sm font-medium">
                New Employee
              </label>

              <select
                value={newEmpId}
                onChange={(e) => setNewEmpId(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">Select employee</option>

                {employeesList.map((emp) => (
                  <option key={emp.EMP_ID} value={emp.EMP_ID}>
                    {emp.DISPLAY_NAME}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        )}
      </AppModal>
    </>
  );
};

export default Approvals;
