import React from "react";
import Hero from "./components/Hero";
import Sobre from "./components/Sobre";
import Geolocalizacao from "./components/Geolocalizacao";
import Instagram from "./components/Instagram";
import FeedbackClientes from "./components/Feedback";
import Faq from "./components/Faq";
import Footer from "./components/Footer";

import "./styles/global.css";

function App() {
  return (
    <>
      <Hero />
      <Sobre />
      <Geolocalizacao />
      <Instagram />
      <FeedbackClientes />
      <Faq />
      <Footer />
    </>
  );
}

export default App;
