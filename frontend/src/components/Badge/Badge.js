import clsx from "clsx";

const VARIANTS = {
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  info: "bg-blue-100 text-blue-700",
  danger: "bg-red-100 text-red-700",
  gray: "bg-gray-100 text-gray-700",
  indigo: "bg-indigo-100 text-indigo-700",
};

const SIZES = {
  sm: "text-xs px-2.5 py-0.5",
  md: "text-sm px-3 py-1",
};

const Badge = ({
  children,
  variant = "gray",
  size = "sm",
  className,
}) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-medium",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
