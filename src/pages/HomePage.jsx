import React from 'react';
import TopInfoBar from '../components/home/TopInfoBar';
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
      <TopInfoBar />
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