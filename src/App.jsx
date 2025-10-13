import React  from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Agendamento from "./pages/Agendamento";
import Orcamento from "./pages/Orcamento";

import "./styles/global.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/orcamento" element={<Orcamento />} />
      </Routes>
    </Router>
  );
}

export default App;
