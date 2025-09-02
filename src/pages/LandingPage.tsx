import Hero from '../components/LandingPage/Hero';
import Testimonials from '../components/LandingPage/Testimonials';
import Footer from '../components/LandingPage/Footer';
import About1 from '../components/LandingPage/About1';
import Service from '../components/LandingPage/Service';
import Navbar from '../components/LandingPage/Navbar';
import PricingSliderSection from '../components/LandingPage/PricingSliderSection';

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Service />
      <About1 />
      <PricingSliderSection />
      <Testimonials />
      <Footer />
    </div>
  );
}
