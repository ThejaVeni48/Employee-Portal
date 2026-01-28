import React from "react";
import { useLocation } from "react-router-dom";
import { TabItem, Tabs } from "flowbite-react";
import { Badge, Button } from "flowbite-react";
import SuperUsers from "./SuperUsers";
import BranchHolidays from "./BranchHolidays";








const BranchDetails = () => {
  const location = useLocation();

  const branchData = location.state?.row || {};

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="bg-white max-w-7xl mx-auto rounded-xl shadow p-6">

        {/* 🔹 Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {branchData.branch_name || "Branch"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Branch Details & Management
            </p>
          </div>

          <Badge color={branchData.status === "A" ? "success" : "failure"}>
            {branchData.status === "A" ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* 🔹 Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-sm mb-6">
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
            Code: {branchData.branch_code}
          </span>

          {branchData.city && (
            <span className="text-gray-600">
              📍 {branchData.city}, {branchData.state}
            </span>
          )}
        </div>

        {/* 🔹 Tabs */}
        <Tabs aria-label="Branch tabs" variant="underline">

          <TabItem title="Super Users">
           <SuperUsers branchData={branchData}/>  
          </TabItem>

          <TabItem title="Holidays">
           <BranchHolidays branchData={branchData}/>
          </TabItem>

        </Tabs>

      </div>
    </div>
  );
};



export default BranchDetails