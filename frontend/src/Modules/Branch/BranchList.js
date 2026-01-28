import React,{useState} from "react";
import { useSelector } from "react-redux";
import { Button} from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";

import { getBranch } from "../../apis/Branch/getBranch";
import TableComponent from "../../components/Table/Table";
import DropDownComponent from "../../components/Dropdown/Dropdown";
import { useMutation, useQueryClient,useQuery } from "@tanstack/react-query";
import { updateBranch } from "../../apis/Branch/updateBranch";

import toast, { Toaster } from "react-hot-toast";



import AppModal from "../../components/Modals/AddModal";
import useModal from "../../components/hooks/useModal";
import FormLabel from "../../components/FormInput/FormInput";


const BranchList = () => {
  const companyId = useSelector((state) => state.user.companyId);
const [selectedBranch, setSelectedBranch] = React.useState(null);
const [status, setStatus] =useState("");
  const email = useSelector((state) => state.user.email);
  const navigation = useNavigate();

  const {
    data: branchList,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["branches", companyId],
    queryFn: () => getBranch(companyId),
    enabled: !!companyId,
  });

    const {open,openModal,closeModal} = useModal();


    const queryClient = useQueryClient();



const updateMutation = useMutation({
  mutationFn: updateBranch,

  onSuccess: () => {
    queryClient.invalidateQueries(["branches", companyId]);
    toast.success("Branch status updated successfully ✅");
    closeModal();
  },

  onError: (err) => {
    toast.error(err.message || "Update failed ❌");
  },
});

  if (isPending) {
    return <p className="p-4">Loading branches...</p>;
  }

  if (isError) {
    return (
      <p className="p-4 text-red-500">
        {error.message || "Something went wrong"}
      </p>
    );
  }

  const rows = branchList?.data || branchList || [];

  const columns = [
    { header: "Branch Name", accessor: "branch_name" },

    { header: "Branch Code", accessor: "branch_code" },

    { header: "City", accessor: "city" },

    { header: "State", accessor: "state" },

    {
      header: "Financial Year",
      cell: (row) =>
        `${row.finacial_start_month || "-"} - ${
          row.finacial_end_month || "-"
        }`,
    },

    {
      header: "Fiscal Year",
      cell: (row) =>
        `${row.fiscal_start_month || "-"} - ${
          row.fiscal_end_month || "-"
        }`,
    },

    {
      header: "Status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === "A"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status === "A" ? "Active" : "Inactive"}
        </span>
      ),
    },

    {
      header: "Created On",
      cell: (row) =>
        row.assigned_date
          ? new Date(row.assigned_date).toLocaleDateString()
          : "-",
    },

  ];





 const handleEdit = (row) => {
  console.log("row",row);
  
  setSelectedBranch(row.branch_id);
  setStatus(row.status);
  openModal();

 


};

const handleSelect = (val) => {
  setStatus(val);
};






  const handleUpdateBranch = ()=>{

    console.log("updateBranch");
    
    updateMutation.mutate({
  branchId: selectedBranch,
  orgId: companyId,
  email,
  status, 
});



  

  }


   const options = [
    {
      value:'A',label:'Active'},
      {
      value:'I',label:'Inactive'
    }
   ]


   console.log("isPending:", updateMutation.isPending);


 
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <TableComponent
        columns={columns}
        data={rows}
        keyField="branch_id"
        isLoading={isPending}
        emptyText="No branches found"
        actions={(row)=>(
          <>
          <button onClick={()=>handleEdit(row)}>Edit</button>
<button
  onClick={() => navigation("/branchDetails", { state: { row } })}
>
  View
</button>
          </>
        )}
      />
      <AppModal
      isOpen={open}
      onClose={closeModal}
      size="xl"
      title="Edit Branch"
      footer={
        <>
         <Button color="gray" onClick={closeModal}>
                Cancel
              </Button>
        
              <Button
  className="bg-[#1c3681]"
  onClick={handleUpdateBranch}
  disabled={updateMutation.isPending}
>
  {updateMutation.isPending ? (
    <div className="flex items-center gap-2">
      <svg
        className="h-4 w-4 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          d="M4 12a8 8 0 018-8"
          fill="currentColor"
        />
      </svg>
      Updating...
    </div>
  ) : (
    "Update Branch"
  )}
</Button>

        </>
      }
       >
        <div className="relative">
          <FormLabel text="Change Status"/>
         <DropDownComponent
  options={options}
  value={status}
  onChange={(val) => handleSelect(val)}
/>

        </div>

      </AppModal>

      


    </div>
  );
};

export default BranchList;
