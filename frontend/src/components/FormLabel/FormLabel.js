const FormLabel = ({ text, required }) => {
  return (
    <label className="label">
      {required && <span className="text-red-500 ml-1">*</span>}
      {text}
    </label>
  );
};



export default FormLabel