
const BookingSteps = ({ currentStep }) => {
  const steps = [
    { label: 'Select Voyage', icon: '🧳' },
    { label: 'Select Cabin', icon: '🚪' },
    { label: 'Passengers', icon: '👥' },
    { label: 'Payment', icon: '💳' },
    { label: 'Confirmation', icon: '✅' }
  ];

  return (
    <div className="booking-steps">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        return (
          <div
            key={stepNumber}
            className={`step ${currentStep === stepNumber ? 'current' : ''} ${
              currentStep > stepNumber ? 'completed' : ''
            }`}
          >
            <span className="step-icon">{step.icon}</span>
            <span className="step-label">{stepNumber}. {step.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default BookingSteps;
