import React, { useState } from "react";
import { TextInput } from "flowbite-react";

const HierarchyBuilder = ({ levels, onChange, employeesList }) => {
  const [searchText, setSearchText] = useState({});

  
  // searchText = { 0: "sa", 1: "ra" }

  // change number of levels
  const handleLevelCountChange = (count) => {
    const num = Number(count);

    const newLevels = Array.from({ length: num }, (_, i) => ({
      levelNo: i + 1,
      approver: null,
    }));

    onChange(newLevels);
    setSearchText({});
  };

  // filter employees per level
  const getFilteredEmployees = (idx) => {
    const term = searchText[idx] || "";

    return employeesList.filter((emp) =>
      emp.DISPLAY_NAME.toLowerCase().includes(term.toLowerCase())
    );
  };

  // select approver for level
  const handleApproverSelect = (idx, emp) => {
    const updated = [...levels];
    updated[idx].approver = emp;
    onChange(updated);

    setSearchText((prev) => ({ ...prev, [idx]: "" }));
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-white">
      <label className="label">Number of Approval Levels *</label>

      <select
        className="input max-w-xs"
        value={levels.length || ""}
        onChange={(e) => handleLevelCountChange(e.target.value)}
      >
        <option value="">Select Levels</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      {/* LEVELS */}
      {levels.map((lvl, idx) => (
        <div key={lvl.levelNo} className="space-y-2 relative">
          <label className="label">
            Level {lvl.levelNo} Approver *
          </label>

          <TextInput
            placeholder="Search employee..."
            value={lvl.approver?.DISPLAY_NAME || searchText[idx] || ""}
            onChange={(e) =>
              setSearchText((prev) => ({
                ...prev,
                [idx]: e.target.value,
              }))
            }
            required
          />

          {/* DROPDOWN */}
          {searchText[idx] && (
            <div className="absolute z-20 bg-white border w-full max-h-40 overflow-y-auto rounded shadow">
              {getFilteredEmployees(idx).length === 0 && (
                <p className="p-2 text-sm text-gray-500">
                  No employees found
                </p>
              )}

              {getFilteredEmployees(idx).map((emp) => (
                <div
                  key={emp.EMP_ID}
                  className="p-2 cursor-pointer hover:bg-blue-100 text-sm"
                  onClick={() =>
                    handleApproverSelect(idx, emp)
                  }
                >
                  {emp.DISPLAY_NAME}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HierarchyBuilder;
