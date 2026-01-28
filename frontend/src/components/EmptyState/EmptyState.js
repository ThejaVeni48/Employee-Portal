import { MdInbox } from "react-icons/md";

const SIZE = {
  sm: "p-6",
  md: "p-10",
  lg: "p-16",
};

export default function EmptyState({
  title = "No Data",
  description,
  icon: Icon = MdInbox,
  actionLabel,
  onAction,
  size = "md",
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center text-gray-500 ${SIZE[size]} ${className}`}
    >
      <Icon className="text-5xl mb-4 text-gray-300" />

      <h3 className="text-lg font-semibold text-gray-700">
        {title}
      </h3>

      {description && (
        <p className="mt-1 text-sm">
          {description}
        </p>
      )}

      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-5 bg-indigo-600 text-white px-5 py-2 rounded-xl shadow hover:bg-indigo-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
