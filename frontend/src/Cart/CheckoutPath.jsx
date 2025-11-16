// src/components/CheckoutPath.jsx
import React from "react";
import {
  LocalShipping,
  LibraryAddCheck,
  AccountBalance,
} from "@mui/icons-material";

const CheckoutPath = ({ activeStep }) => {
  const steps = [
    {
      label: "Shipping Details",
      icon: <LocalShipping />,
    },
    {
      label: "Confirm Order",
      icon: <LibraryAddCheck />,
    },
    {
      label: "Payment",
      icon: <AccountBalance />,
    },
  ];

  return (
    <div className="w-full flex justify-center mt-20">
      <div className="flex items-center gap-10 md:gap-20">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            {/* Step Number Circle */}
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full text-white text-xl
          ${
            activeStep === index
              ? "bg-blue-600 shadow-lg scale-110"
              : activeStep > index
              ? "bg-green-600"
              : "bg-gray-300"
          }
        `}
            >
              {step.icon}
            </div>

            {/* Label */}
            <p
              className={`mt-2 text-sm md:text-base font-medium 
          ${activeStep === index ? "text-blue-700" : "text-gray-600"}
        `}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutPath;
