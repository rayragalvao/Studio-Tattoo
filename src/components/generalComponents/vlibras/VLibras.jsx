// src/components/VLibras.jsx
import { useEffect } from "react";

export function VLibras() {
  useEffect(() => {
    // Garante que o script só é adicionado uma vez
    if (document.getElementById("vlibras-script")) return;

    // Adiciona o script oficial
    const script = document.createElement("script");
    script.id = "vlibras-script";
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.defer = true;

    // Depois que o script carrega, inicializa o widget
    script.onload = () => {
      // Aguarda um pequeno tempo para garantir que o DOM e o objeto estão prontos
      setTimeout(() => {
        if (window.VLibras) {
          new window.VLibras.Widget("https://vlibras.gov.br/app");
          console.log("✅ VLibras inicializado com sucesso!");
        } else {
          console.error("⚠️ VLibras não foi encontrado na janela.");
        }
      }, 500);
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div
      id="vlibras-container"
      dangerouslySetInnerHTML={{
        __html: `
          <div vw className="enabled">
            <div vw-access-button className="active"></div>
            <div vw-plugin-wrapper>
              <div className="vw-plugin-top-wrapper"></div>
            </div>
          </div>
        `,
      }}
    />
  );
}
