import React, { useState } from "react";
import { Button } from "flowbite-react";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useModal from "../components/hooks/useModal";
import AppModal from "../components/Modals/AddModal";
import FormLabel from "../components/FormLabel/FormLabel";
import FormTextInput from "../components/FormInput/FormInput";
import FormDatePicker from "../components/DatePicker/DatePicker";
import DateFormat from "../utility/dateFormat";
import { createBranchHolidays } from "../apis/Branch/Holidays/createHoliday";

const AddBranchHolidays = ({ branchData = {} }) => {
  const companyId = useSelector((state) => state.user.companyId);
  const email = useSelector((state) => state.user.email);
  const branchId = branchData.branch_id;

  const [holidayData, setHolidayData] = useState({
    holName: "",
    holCode: "",
    branchId: branchData.branch_id || "",
    startDate: "",
    endDate: "",
  });

  const { open, openModal, closeModal } = useModal();
  const queryClient = useQueryClient();

  const handleChange = (key, value) => {
    setHolidayData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createBranchHolidays,

    onSuccess: () => {
      queryClient.invalidateQueries([
        "branch-holidays",
        companyId,
        branchData.branch_id,
      ]);

      toast.success("Holiday added successfully ");
      closeModal();
    },

    onError: (err) => {
      toast.error(err.message || "Failed to add holiday");
    },
  });


  const handleAddHoliday = () => {
    const payload = {
      ...holidayData,
      orgId: companyId,
      branchId,
       email,
      startDate: DateFormat(holidayData.startDate),
      endDate: DateFormat(
        holidayData.endDate || holidayData.startDate
      ),

    };

    mutate(payload);
  };

  return (
    <>
      <button
        onClick={openModal}
       disabled={branchData.status !== "A"}

        className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-25 disabled:cursor-not-allowed"
      >
        + Add Holiday
      </button>

      <AppModal
        isOpen={open}
        onClose={closeModal}
        size="lg"
        title="Add Branch Holiday"
        footer={
          <>
            <Button color="gray" onClick={closeModal}>
              Cancel
            </Button>

            <Button
              className="bg-[#1c3681]"
              onClick={handleAddHoliday}
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create Holiday"}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          {/* Holiday Name */}
          <div>
            <FormLabel text="Holiday Name" required />
            <FormTextInput
              value={holidayData.holName}
              onChange={(val) =>
                handleChange("holName", val)
              }
            />
          </div>

          {/* Holiday Code */}
          <div>
            <FormLabel text="Holiday Code" required />
            <FormTextInput
              value={holidayData.holCode}
              onChange={(val) =>
                handleChange("holCode", val)
              }
            />
          </div>

          {/* Start Date */}
          <div>
            <FormLabel text="Start Date" required />
            <FormDatePicker
              value={holidayData.startDate}
              onChange={(date) =>
                handleChange("startDate", date)
              }
            />
          </div>

          {/* End Date */}
          <div>
            <FormLabel text="End Date" />
            <FormDatePicker
              value={holidayData.endDate}
              onChange={(date) =>
                handleChange("endDate", date)
              }
            />
          </div>
        </div>
      </AppModal>
    </>
  );
};

export default AddBranchHolidays;







