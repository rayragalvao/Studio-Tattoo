import React from "react";
import { Navbar } from "../../components/generalComponents/navbar/Navbar";
import { Footer } from "../../components/generalComponents/footer/Footer";
import { AgendamentoForm } from "../../components/agendamentoComponents/agendamentoForm/AgendamentoForm";

export const Agendamento = () => {
  return (
    <>
      <Navbar />
      <AgendamentoForm />
      <Footer />
    </>
  );
};