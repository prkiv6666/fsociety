import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Stores from "@/components/Stores";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Vouches from "@/components/Vouches";
import WhyChooseUs from "@/components/WhyChooseUs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SiteTour from "@/components/SiteTour";
import IntroScreen from "@/components/IntroScreen";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import StoreTicker from "@/components/StoreTicker";
import MobileContactBar from "@/components/MobileContactBar";

function Divider() {
  return (
    <div className="container-x">
      <div className="divider-x" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <IntroScreen />
      <Background />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <StoreTicker />
        <Divider />
        <Stores />
        <Divider />
        <Services />
        <Divider />
        <HowItWorks />
        <Divider />
        <Vouches />
        <Divider />
        <WhyChooseUs />
        <Divider />
        <Contact />
      </main>
      <Footer />
      <SiteTour />
      <BackToTop />
      <MobileContactBar />
    </>
  );
}
