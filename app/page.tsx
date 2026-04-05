import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Metrics from "@/components/Metrics";
import Capabilities from "@/components/Capabilities";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import CtaBanner from "@/components/CtaBanner";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <AnimateOnScroll>
          <Metrics />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Capabilities />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Services />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <HowItWorks />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <CtaBanner />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <ContactForm />
        </AnimateOnScroll>
      </main>
      <Footer />
    </>
  );
}
