const DropDownComponent = ({
  value,
  onChange,
  className,
  children,
  ...props
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={className}
      {...props}
    >
      {children}
    </select>
  );
};

export default DropDownComponent;
