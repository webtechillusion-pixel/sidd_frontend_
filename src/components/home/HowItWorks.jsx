import React from "react";
import { useNavigate } from 'react-router-dom';
import { Search, CreditCard, UserCheck, Car, ChevronRight } from "lucide-react";

const HowItWorks = () => {
  const navigate = useNavigate();
  const steps = [
    {
      number: "01",
      icon: <Search className="h-8 w-8" />,
      title: "Search & Select",
      description:
        "Choose your pickup, drop locations, date, and preferred vehicle type.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      number: "02",
      icon: <CreditCard className="h-8 w-8" />,
      title: "Book & Pay",
      description:
        "Confirm your booking with secure online payment or pay later option.",
      color: "bg-green-100 text-green-600",
    },
    {
      number: "03",
      icon: <UserCheck className="h-8 w-8" />,
      title: "Driver Assigned",
      description:
        "Verified driver assigned with vehicle details sent to your phone.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      number: "04",
      icon: <Car className="h-8 w-8" />,
      title: "Enjoy Your Ride",
      description:
        "Track your ride in real-time and reach your destination safely.",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            SIMPLE PROCESS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Book Your Ride in 4 Easy Steps
          </h2>
          <p className="text-lg text-gray-600">
            Experience hassle-free booking with our simple and transparent
            process.
          </p>
        </div>

        <div className="relative">
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-blue-200 -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center relative z-10 hover:shadow-xl transition-shadow">
                  <div className="flex justify-center mb-6">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${step.color}`}
                    >
                      {step.icon}
                    </div>
                  </div>

                  <div className="text-5xl font-bold text-gray-200 mb-4">
                    {step.number}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>

                  <p className="text-gray-600">{step.description}</p>
                </div>

                {/* Arrow for mobile/tablet */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-6">
                    <ChevronRight className="h-8 w-8 text-blue-400 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Experience Hassle-Free Travel?
              </h3>
              <p className="text-blue-100 mb-6">
                Join thousands of satisfied customers who trust us for their
                daily commutes and special journeys.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/book")}
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Book Your Ride
              </button>
              <button onClick={() => navigate("/contact")}
               className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
