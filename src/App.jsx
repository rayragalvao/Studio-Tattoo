import React  from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import RotaProtegida from "./components/RotaProtegida.jsx";

// Páginas públicas
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Agendamento from "./pages/Agendamento";
import Orcamento from "./pages/Orcamento";

// Páginas protegidas
import Estoque from "./pages/Estoque";

import "./styles/global.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/agendamento" element={<Agendamento />} />
          <Route path="/orcamento" element={<Orcamento />} />
          
          {/* Rota protegida - apenas o estoque requer login e admin */}
          <Route 
            path="/estoque" 
            element={
              <RotaProtegida requireAdmin={true}>
                <Estoque />
              </RotaProtegida>
            } 
          />

          {/* Rota padrão - redireciona para home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
