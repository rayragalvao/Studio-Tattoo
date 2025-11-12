import React  from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import UserRoute from "./routes/UserRoute.jsx";
import { Home } from "./pages/home/Home.jsx";
import { Portfolio } from "./pages/portifolio/Portfolio.jsx";
import { Agendamento } from "./pages/agendamento/Agendamento.jsx";
import { Orcamento } from "./pages/orcamento/Orcamento.jsx";

// Páginas protegidas
import { Estoque } from "./pages/estoque/Estoque.jsx";

import "./styles/global.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/agendamento" element={
            <UserRoute>
              <Agendamento />
            </UserRoute>
          } />
          <Route path="/orcamento" element={<Orcamento />} />
          <Route path="/estoque" element={
            <AdminRoute>
              <Estoque />
            </AdminRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
