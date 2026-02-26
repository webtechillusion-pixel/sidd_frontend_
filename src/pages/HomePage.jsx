import React from 'react';
import Hero from '../components/home/Hero';
import ServiceSection from '../components/home/ServiceSection';
import HowItWorks from '../components/home/HowItWorks';
import VehicleFleet from '../components/home/VehicleFleet';
import WhyChooseUs from '../components/home/WhyChooseUs';
import StatsSection from '../components/home/StatsSection';
import Testimonials from '../components/home/Testimonial';
import CTASection from '../components/home/CTASection';

const HomePage = () => {
  return (
    <>
      <Hero />
      <ServiceSection />
      <HowItWorks />
      <VehicleFleet />
      <WhyChooseUs />
      <StatsSection />
      <Testimonials />
      <CTASection />
    </>
  );
};

export default HomePage;