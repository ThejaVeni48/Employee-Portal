import React, { useState } from "react";

const HierarchyBuilder = ({ levels, setLevels }) => {
  const [count, setCount] = useState(levels.length || 1);

  const handleLevelCountChange = (value) => {
    const num = Number(value);
    setCount(num);

    const newLevels = Array.from({ length: num }, (_, i) => ({
      level: i + 1,
      approverId: "",
    }));

    setLevels(newLevels);
  };

  const handleApproverChange = (index, value) => {
    const updated = [...levels];
    updated[index].approverId = value;
    setLevels(updated);
  };

  return (
    <div className="space-y-4 bg-white border border-gray-200 rounded-lg p-4">
      <label className="label">Number of Approval Levels *</label>

      <select
        className="input max-w-xs"
        value={count}
        onChange={(e) => handleLevelCountChange(e.target.value)}
      >
         <option value=''>Select Level</option>
        {[1,2,3,4,5,6,7].map(n => (
           
          <option key={n} value={n}>{n} Level{n > 1 && "s"}</option>
        ))}
      </select>

      {/* APPROVERS */}
      <div className="space-y-3">
        {levels.map((lvl, index) => (
          <div key={lvl.level}>
            <label className="label">
              Level {lvl.level} Approver *
            </label>
            <input
              className="input"
              placeholder={`Approver for L${lvl.level}`}
              value={lvl.approverId}
              onChange={(e) =>
                handleApproverChange(index, e.target.value)
              }
              required
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HierarchyBuilder;
