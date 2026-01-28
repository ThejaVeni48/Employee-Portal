import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FormDatePicker = ({
  selected,
  onChange,
  placeholder = "YYYY-MM-DD",
  dateFormat = "yyyy-MM-dd",
  disabled = false,
  className = "",
}) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat={dateFormat}
      placeholderText={placeholder}
      disabled={disabled}
      className={`w-full rounded-lg border px-3 py-2 text-xs placeholder:text-xs ${className}`}
    />
  );
};

export default FormDatePicker;
