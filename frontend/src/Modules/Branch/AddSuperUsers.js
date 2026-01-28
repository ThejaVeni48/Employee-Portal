import { Button } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import useModal from "../components/hooks/useModal";
import AppModal from "../components/Modals/AddModal";
import FormLabel from "../components/FormLabel/FormLabel";
import FormTextInput from "../components/FormInput/FormInput";
import FormDatePicker from "../components/DatePicker/DatePicker";

import { addSuperUserApi } from "../apis/Branch/addSuperUser";
import DateFormat from "../utility/dateFormat";

const AddSuperUsers = ({ branchData = {} }) => {
  const companyId = useSelector((state) => state.user.companyId);
  const email = useSelector((state) => state.user.email);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName:"",
    middleName:'',
    empId: "",
    email: "",
    contactno: "",
    role: "SUPER_USER",
    status: "A",
    branchId: branchData.branch_id || "",
    startDate: "",
  });

  const { open, openModal, closeModal } = useModal();

  const handleChange = (key, value) => {
    setUserData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const queryClient = useQueryClient();

  // ✅ mutation
  const { mutate, isPending } = useMutation({
    mutationFn: addSuperUserApi,

    onSuccess: () => {
      queryClient.invalidateQueries([
        "superusers",
        branchData.branch_id,
      ]);

      toast.success("Super User added successfully ✅");
      closeModal();
    },

    onError: (err) => {
      toast.error(err.message || "Failed to add user");
    },
  });

  const handleAddUser = () => {
    const payload = {
      ...userData,
      orgId: companyId,
      createdBy: email,
      startDate:DateFormat(userData.startDate)
    };
    console.log("paylo",payload);
    

    mutate(payload);
  };

  return (
    <>
      <button
        onClick={openModal}
         disabled={branchData.status !== "A"}
        className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-25 disabled:cursor-not-allowed"
      >
        + Add Super User
      </button>

      <AppModal
        isOpen={open}
        onClose={closeModal}
        size="xl"
        title="Add Super User"
        footer={
          <>
            <Button color="gray" onClick={closeModal}>
              Cancel
            </Button>

            <Button
              className="bg-[#1c3681]"
              onClick={handleAddUser}
              disabled={isPending}
          
            >
              {isPending ? "Creating..." : "Create User"}
            </Button>
          </>
        }
      >
        <div className="space-y-6">

          {/* Branch */}
          <div>
            <FormLabel text="Branch" />
            <input
              disabled
              value={branchData.branch_name || "Selected Branch"}
              className="w-full rounded-md border bg-gray-100 px-3 py-2 text-sm"
            />
          </div>

          {/* Name */}
          <div>
            <FormLabel text="first Name" required />
            <FormTextInput
              value={userData.firstName}
              onChange={(val) => handleChange("firstName", val)}
            />
          </div>

          <div>
            <FormLabel text="lastName " required />
            <FormTextInput
              value={userData.lastName}
              onChange={(val) => handleChange("lastName", val)}
            />
          </div>
          <div>
            <FormLabel text="middleName " required />
            <FormTextInput
              value={userData.middleName}
              onChange={(val) => handleChange("middleName", val)}
            />
          </div>

          {/* EmpId */}
          <div>
            <FormLabel text="Employee ID" required />
            <FormTextInput
              value={userData.empId}
              onChange={(val) => handleChange("empId", val)}
            />
          </div>

          {/* Email */}
          <div>
            <FormLabel text="Email" required />
            <FormTextInput
              value={userData.email}
              onChange={(val) => handleChange("email", val)}
            />
          </div>

          {/* Mobile */}
          <div>
            <FormLabel text="Mobile Number" />
            <FormTextInput
              value={userData.contactno}
              onChange={(val) => handleChange("contactno", val)}
            />
          </div>

          {/* Start Date */}
          <div>
            <FormLabel text="Start Date" />
            <FormDatePicker
              value={userData.startDate}
              onChange={(date) => handleChange("startDate", date)}
            />
          </div>

          {/* Status */}
          <div>
            <FormLabel text="Status" />
            <select
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={userData.status}
              onChange={(e) =>
                handleChange("status", e.target.value)
              }
            >
              <option value="A">Active</option>
              <option value="I">Inactive</option>
            </select>
          </div>
        </div>
      </AppModal>
    </>
  );
};

export default AddSuperUsers;
