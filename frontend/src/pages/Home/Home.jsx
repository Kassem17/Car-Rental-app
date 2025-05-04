import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

import Hero from "../../components/Hero";
import CarList from "../../components/Cars/CarList";
import ContactUs from "../../components/ContactUs";
import AboutUs from "../../components/AboutUs";
import Services from "../../components/Services";
import ReviewForm from "../../components/Review/ReviewForm";
import ReviewsDisplay from "../../components/Review/ReviewsDisplay ";

// Fade-up animation variant
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.25, 0.8, 0.25, 1],
    },
  },
};

// Reusable section wrapper with scroll-based animation
const AnimatedSection = ({ children, id }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeUp}
      className="px-6"
    >
      {children}
    </motion.section>
  );
};

const Home = () => {
  return (
    <div className="flex flex-col  bg-neutral-50">
      <AnimatedSection id="hero">
        <Hero />
      </AnimatedSection>

      <AnimatedSection id="cars">
        <CarList />
      </AnimatedSection>
      <AnimatedSection id="services">
        <Services />
      </AnimatedSection>

      <AnimatedSection id="about">
        <AboutUs />
      </AnimatedSection>

      <AnimatedSection id="contact">
        <ContactUs />
      </AnimatedSection>
      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatedSection>
            <div className="bg-white rounded-2xl shadow-md p-6 h-full">
              <ReviewForm />
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="bg-white rounded-2xl shadow-md p-6 h-full">
              <ReviewsDisplay />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default Home;
