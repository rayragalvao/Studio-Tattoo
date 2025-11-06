import React from "react";
import { Navbar } from "../../components/generalComponents/navbar/Navbar";
import { Hero } from "../../components/landingPageComponents/hero/Hero";
import { Sobre } from "../../components/landingPageComponents/sobre/Sobre";
import { Geolocalizacao } from "../../components/landingPageComponents/geolocalizacao/Geolocalizacao";
import { Instagram } from "../../components/landingPageComponents/instagram/Instagram";
import { FeedbackClientes } from "../../components/landingPageComponents/feedback/Feedback";
import { Faq } from "../../components/landingPageComponents/faq/Faq";
import { Footer } from "../../components/generalComponents/footer/Footer";

export const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Sobre />
      <Geolocalizacao />
      {/* <Instagram /> */}
      <FeedbackClientes />
      <Faq />
      <Footer />
    </>
  );
};