import React from "react";
import { useNavigate } from 'react-router-dom';
import { Search, CreditCard, UserCheck, Car, ChevronRight } from "lucide-react";

const HowItWorks = () => {
  const navigate = useNavigate();
  const steps = [
    {
      number: "01",
      icon: <Search className="h-6 w-6 md:h-7 md:w-7" />,
      title: "Search & Select",
      description:
        "Choose pickup, drop locations, date, and vehicle type.",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      number: "02",
      icon: <CreditCard className="h-6 w-6 md:h-7 md:w-7" />,
      title: "Book & Pay",
      description:
        "Confirm booking with secure payment or pay later.",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      number: "03",
      icon: <UserCheck className="h-6 w-6 md:h-7 md:w-7" />,
      title: "Driver Assigned",
      description:
        "Verified driver assigned with vehicle details.",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      number: "04",
      icon: <Car className="h-6 w-6 md:h-7 md:w-7" />,
      title: "Enjoy Ride",
      description:
        "Track your ride in real-time and travel safely.",
      color: "bg-yellow-100 text-yellow-700",
    },
  ];

  return (
    <section className="py-10 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-block px-3 py-1 bg-yellow-500 text-gray-900 rounded-full text-xs font-semibold mb-3">
            HOW IT WORKS
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Book Your Ride in 4 Easy Steps
          </h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-yellow-500 -translate-y-1/2"></div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 text-center relative z-10 hover:shadow-md hover:border-yellow-400 transition-shadow">
                  <div className="flex justify-center mb-3">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${step.color}`}
                    >
                      {step.icon}
                    </div>
                  </div>

                  <div className="text-2xl md:text-3xl font-bold text-yellow-500 mb-2">
                    {step.number}
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1">
                    {step.title}
                  </h3>

                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-2">
                    <ChevronRight className="h-5 w-5 text-yellow-500 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 md:mt-10 bg-gray-900 rounded-xl p-5 md:p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <h3 className="text-lg font-bold mb-1">
                Ready to Travel?
              </h3>
              <p className="text-gray-400 text-sm">
                Book your ride now
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => navigate("/book")}
                className="px-5 py-2.5 bg-yellow-500 text-gray-900 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors"
              >
                Book Now
              </button>
              <button onClick={() => navigate("/contact")}
               className="px-5 py-2.5 border-2 border-yellow-500 text-yellow-500 rounded-lg text-sm font-semibold hover:bg-yellow-500 hover:text-gray-900 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
