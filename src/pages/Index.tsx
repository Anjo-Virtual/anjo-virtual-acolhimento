
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import Plans from "@/components/Plans";
import Testimonials from "@/components/Testimonials";
import Business from "@/components/Business";
import Community from "@/components/Community";
import Blog from "@/components/Blog";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <HowItWorks />
      <Plans />
      <Testimonials />
      <Business />
      <Community />
      <Blog />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
