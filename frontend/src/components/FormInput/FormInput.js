import { TextInput } from "flowbite-react";

const FormTextInput = ({
  placeholder,
  value,
  onChange,
  type = "text",
  disabled = false,
}) => {
  return (
    <div className="space-y-1">
    
      {/* Input */}
      <TextInput
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />

    
    </div>
  );
};

export default FormTextInput;
