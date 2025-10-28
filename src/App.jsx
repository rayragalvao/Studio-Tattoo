import React  from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import UserRoute from "./components/UserRoute.jsx";
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
