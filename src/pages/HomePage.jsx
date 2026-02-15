// import React from 'react';
// import Hero from '../components/home/Hero';
// import Activities from '../components/home/Activities';
// import Philosophy from '../components/home/Philosophy';
// import Hotels from '../components/home/Hotels';
// import Partners from '../components/home/Partners';
// import Testimonials from '../components/home/Testimonial';
// import SearchBar from '../components/home/SearchBar';

// const HomePage = () => {
//   return (
//     <>
//       <Hero />
//       <Activities />
//       <Philosophy />
//       <Hotels />
//        <section className="relative z-30">
//         <SearchBar />
//       </section>
//       <Partners />
      
//       <Testimonials />

//     </>
//   );
// };

// export default HomePage;

import React from 'react';
import Hero from '../components/home/Hero';
import ServicesSection from '../components/home/ServiceSection';
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
      <ServicesSection />
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