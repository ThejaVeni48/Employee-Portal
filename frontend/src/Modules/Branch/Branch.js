import React from "react";
import BranchList from "./BranchList";
import AddBranch from "./AddBranch";
import { useSelector } from "react-redux";








const Branch = ()=>{

  const companyId = useSelector((state) => state.user.companyId);




   return (
  <div className="p-6 space-y-6">

    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900">
          Branches
        </h3>
        <p className="text-sm text-gray-500">
          Manage all branches in your organization
        </p>
      </div>

      <AddBranch />
    </div>

      <BranchList />

  </div>
);







}


export default Branch