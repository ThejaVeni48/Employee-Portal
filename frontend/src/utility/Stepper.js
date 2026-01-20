const Stepper = ({ currentStep }) => {
  const steps = [
    "Organization Details",
    "Select Plan",
    "Review & Confirm",
  ];

  return (
    <div className="flex items-center w-full mb-8">
      {steps.map((label, index) => {
        const step = index + 1;
        const isCompleted = currentStep > step;
        const isActive = currentStep === step;

        return (
          <div key={label} className="flex items-center flex-1">
            {/* Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-medium
                ${
                  isCompleted
                    ? "bg-blue-600 border-blue-600 text-white"
                    : isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-gray-300 text-gray-400"
                }`}
            >
              {step}
            </div>

            {/* Label */}
            <div className="ml-3 hidden sm:block">
              <p
                className={`text-sm ${
                  isActive || isCompleted
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Step {step}
              </p>
              <p className="text-xs text-gray-600">{label}</p>
            </div>

            {/* Line */}
            {step !== steps.length && (
              <div
                className={`flex-1 h-[2px] mx-4 ${
                  isCompleted ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
