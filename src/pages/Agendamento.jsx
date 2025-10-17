import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AgendamentoForm from "../components/AgendamentoForm";

const Agendamento = () => {
  return (
    <>
      <Navbar />
      <AgendamentoForm />
      <Footer />
    </>
  );
};

export default Agendamento;