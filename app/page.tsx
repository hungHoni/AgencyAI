import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Metrics from "@/components/Metrics";
import Capabilities from "@/components/Capabilities";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import CtaBanner from "@/components/CtaBanner";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <>
      <ScrollToTop />
      <Nav />
      <main id="main-content">
        <Hero />
        <Metrics />
        <Capabilities />
        <Services />
        <HowItWorks />
        <CtaBanner />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
