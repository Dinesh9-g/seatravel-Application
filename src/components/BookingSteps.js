
const BookingSteps = ({ currentStep }) => {
  const steps = [
    'Select Cabin',
    'Passenger Details',
    'Payment',
    'Confirmation',
  ];

  return (
    <div className="booking-steps">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        return (
          <div
            key={stepNumber}
            className={`step ${currentStep === stepNumber ? 'current' : ''} ${
              currentStep > stepNumber ? 'completed' : ''
            }`}
          >
            {stepNumber}. {label}
          </div>
        );
      })}
    </div>
  );
};

export default BookingSteps;
