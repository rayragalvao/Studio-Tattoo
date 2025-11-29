import React, { useState } from "react";
import { Navbar } from "../../components/generalComponents/navbar/Navbar";
import { Footer } from "../../components/generalComponents/footer/Footer";
import { PerfilUsuario } from "./perfilUsuario/PerfilUsuario";
import { MeusOrcamentos } from "./meusOrcamentos/MeusOrcamentos";
import { MeusAgendamentos } from "./meusAgendamentos/MeusAgendamentos";
import "./menuCliente.css";

export const MenuCliente = () => {
  const [activeSection, setActiveSection] = useState("perfil");

  const menuItems = [
    {
      id: "perfil",
      label: "Meu perfil",
      description: "Visualizar e editar informações pessoais"
    },
    {
      id: "agendamentos",
      label: "Meus agendamentos",
      description: "Gerenciar seus agendamentos"
    },
    {
      id: "orcamentos",
      label: "Meus orçamentos",
      description: "Visualizar seus orçamentos"
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "perfil":
        return <PerfilUsuario />;
      case "agendamentos":
        return <MeusAgendamentos />;
      case "orcamentos":
        return <MeusOrcamentos />;
      default:
        return <PerfilUsuario />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="menu-cliente-page">
        <div className="menu-cliente-layout">
          {/* Menu Lateral */}
          <aside className="menu-cliente-sidebar">
            <div className="menu-cliente-header">
              <h1>Menu</h1>
            </div>
            
            <nav className="menu-cliente-nav">
              <ul className="menu-cliente-list">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      className={`menu-cliente-link ${activeSection === item.id ? 'active' : ''}`}
                      onClick={() => setActiveSection(item.id)}
                    >
                      <span className="menu-item-label">{item.label}</span>
                      <span className="menu-item-description">{item.description}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className="menu-cliente-content">
            {renderContent()}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};
