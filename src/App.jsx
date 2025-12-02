import React  from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminRoute from "./routes/AdminRoute.jsx";
import UserRoute from "./routes/UserRoute.jsx";
import { Home } from "./pages/home/Home.jsx";
import { Portfolio } from "./pages/portifolio/Portfolio.jsx";
import { Agendamento } from "./pages/agendamento/Agendamento.jsx";
import { Orcamento } from "./pages/orcamento/Orcamento.jsx";
import { MenuCliente } from "./pages/menuCliente/MenuCliente.jsx";
import AdminOrcamentos from "./pages/admin/Orcamentos.jsx";
import AdminAgendamentos from "./pages/admin/Agendamentos.jsx";

// Páginas protegidas
import { Estoque } from "./pages/estoque/Estoque.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";


import "./styles/global.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/agendamento" element={
          <UserRoute>
            <Agendamento />
          </UserRoute>
        } />
        <Route path="/meu-perfil" element={
          <UserRoute>
            <MenuCliente />
          </UserRoute>
        } />
        <Route path="/dashboard" element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          } />
        <Route path="/orcamento" element={<Orcamento />} />
        <Route path="/estoque" element={
          <AdminRoute>
            <Estoque />
          </AdminRoute>
        } />
        <Route path="/admin/orcamentos" element={
          <AdminRoute>
            <AdminOrcamentos />
          </AdminRoute>
        } />
        <Route path="/admin/agendamentos" element={
          <AdminRoute>
            <AdminAgendamentos />
          </AdminRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;