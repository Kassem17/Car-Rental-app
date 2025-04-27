import React from "react";
import Hero from "../../components/Hero";
import CarList from "../../components/Cars/CarList";
import AddCars from "../adminPages/AddCars";
import ContactUs from "../../components/ContactUs";
import AboutUs from "../../components/AboutUs";
import Services from "../../components/Services";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div id="hero">
        <Hero />
      </div>
      <div id="cars">
        <CarList />
      </div>
      {/* <AddCars /> */}
      <div id="services">
        <Services />
      </div>

      <div id="about">
        <AboutUs />
      </div>
      <div id="contact">
        <ContactUs />
      </div>
    </div>
  );
};

export default Home;
