import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";




const TableComponent = ({
  columns,
  data = [],
  keyField = "id",
  isLoading,
  emptyText = "No records found",
  actions,
}) => {
  if (isLoading) {
    return <div className="p-4 text-sm">Loading...</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">

      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.header}
                className="px-4 py-2 text-left text-sm font-semibold"
              >
                {col.header}
              </th>
            ))}

            {actions && (
              <th className="px-4 py-2 text-left">Action</th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center py-6 text-gray-500"
              >
                {emptyText}
              </td>
            </tr>
          )}

          {data.map((row) => (
            <tr
              key={row[keyField]}
              className="border-t hover:bg-gray-50"
            >
              {columns.map((col) => (
                <td key={col.header} className="px-4 py-2 text-sm">
                  {col.cell
                    ? col.cell(row)
                    : row[col.accessor]}
                </td>
              ))}

              {actions && (
                <td className="px-4 py-2">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};




export default TableComponent;
