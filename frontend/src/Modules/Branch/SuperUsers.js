import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "flowbite-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import AddSuperUsers from "./AddSuperUsers";
import TableComponent from "../components/Table/Table";
import AppModal from "../components/Modals/AddModal";
import useModal from "../components/hooks/useModal";
import FormLabel from "../components/FormLabel/FormLabel";
import DropDownComponent from "../components/Dropdown/Dropdown";

import { getSuperUsersByBranch } from "../apis/Branch/getSuperUsersByBranch";
import { updateSuperUserStatus } from "../apis/Branch/deactivateSuperUser";

const SuperUsers = ({ branchData = {} }) => {
  const branchId = branchData.branch_id;
  const companyId = useSelector((state) => state.user.companyId);

  const [selectedUser, setSelectedUser] = useState(null);
  const [status, setStatus] = useState("");

  const { open, openModal, closeModal } = useModal();

  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["superusers", companyId, branchId],
    queryFn: () =>
      getSuperUsersByBranch(companyId, branchId),
    enabled: !!companyId && !!branchId,
  });

  const rows = data?.data || [];

  const updateMutation = useMutation({
    mutationFn: updateSuperUserStatus,

    onSuccess: () => {
      queryClient.invalidateQueries([
        "superusers",
        companyId,
        branchId,
      ]);
      toast.success("Super user updated successfully");
      closeModal();
    },

    onError: (err) => {
      toast.error(err.message || "Update failed");
    },
  });

  const handleDeactivateClick = (row) => {
    setSelectedUser(row);
    setStatus(row.ASSIGNMENT_STATUS);
    openModal();
  };

  const handleUpdateStatus = () => {
    updateMutation.mutate({
      empId: selectedUser.EMP_ID,
      branchId,
      orgId: companyId,
      status,
    });
  };

  const options = [
    { value: "A", label: "Active" },
    { value: "I", label: "Inactive" },
  ];

  const columns = [
    { header: "Employee ID", accessor: "EMP_ID" },
    {
      header: "Name",
      cell: (row) =>
        `${row.FIRST_NAME} ${row.LAST_NAME || ""}`,
    },
    { header: "Email", accessor: "EMAIL" },
    { header: "Mobile", accessor: "MOBILE_NUMBER" },
    {
      header: "Status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.ASSIGNMENT_STATUS === "A"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.ASSIGNMENT_STATUS === "A"
            ? "Active"
            : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <button
          className="text-red-600 text-sm"
          onClick={() => handleDeactivateClick(row)}
        >
          Change Status
        </button>
      ),
    },
  ];

  if (isPending) return <p>Loading super users...</p>;
  if (isError)
    return <p className="text-red-500">{error.message}</p>;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Super Users
        </h2>

        <AddSuperUsers branchData={branchData} />
      </div>

      <TableComponent
        columns={columns}
        data={rows}
        keyField="EMP_ID"
        emptyText="No super users found"
      />

      {/* 🔥 Status Modal */}
      <AppModal
        isOpen={open}
        onClose={closeModal}
        size="md"
        title="Update Super User Status"
        footer={
          <>
            <Button color="gray" onClick={closeModal}>
              Cancel
            </Button>

          <Button
  className={`bg-[#1c3681] ${
    branchData.status !== "A"
      ? "opacity-50 cursor-not-allowed"
      : ""
  }`}
  onClick={handleUpdateStatus}
  disabled={
    updateMutation.isPending ||
    branchData.status !== "A"
  }
>

              {updateMutation.isPending
                ? "Updating..."
                : "Update"}
            </Button>
          </>
        }
      >
        <FormLabel text="Status" />
        <DropDownComponent
          options={options}
          value={status}
          onChange={(val) => setStatus(val)}
        />
      </AppModal>
    </>
  );
};

export default SuperUsers;
