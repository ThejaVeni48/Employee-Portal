import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import AddBranchHolidays from "./AddBranchHolidays";
import TableComponent from "../components/Table/Table";
import { getBranchHolidays } from "../apis/Branch/Holidays/getHolidays";

const BranchHolidays = ({ branchData = {} }) => {
  const branchId = branchData.branch_id;
  const companyId = useSelector((state) => state.user.companyId);

  const {
    data,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["branch-holidays", companyId, branchId],
    queryFn: () =>
      getBranchHolidays(companyId, branchId),
    enabled: !!companyId && !!branchId,
  });

  const rows = data?.data || [];

  console.log("rows",rows);
  

  const columns = [
    { header: "Holiday Name", accessor: "hol_name" },
    { header: "Holiday Code", accessor: "hol_code" },
    { header: "Year", accessor: "year" },
    {
      header: "From",
      cell: (row) =>
        new Date(row.start_date).toLocaleDateString(),
    },
    {
      header: "To",
      cell: (row) =>
        new Date(row.end_date).toLocaleDateString(),
    },
    // {
    //   header: "Actions",
    //   cell: () => (
    //     <div className="flex gap-2">
    //       <button className="text-blue-600 text-sm">
    //         Edit
    //       </button>
    //       <button className="text-red-600 text-sm">
    //         Delete
    //       </button>
    //     </div>
    //   ),
    // },
  ];

  if (isPending)
    return <p className="p-4">Loading holidays...</p>;

  if (isError)
    return (
      <p className="p-4 text-red-500">
        {error.message}
      </p>
    );

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Branch Holidays
        </h2>

        <AddBranchHolidays branchData={branchData} />
      </div>

      <TableComponent
        columns={columns}
        data={rows}
        keyField="hol_id"
        emptyText="No holidays found"
      />
    </>
  );
};

export default BranchHolidays;
