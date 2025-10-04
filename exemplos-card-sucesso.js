// Exemplo de uso do CardSucesso em outros contextos

// 1. Para agendamento confirmado:
<CardSucesso
  titulo="Agendamento confirmado!"
  mensagem="Sua sessão foi agendada com sucesso. Você receberá um e-mail de confirmação em breve."
  codigo="AGD-2024-002"
  botaoTexto="Ver meus agendamentos"
  onClose={handleFecharCard}
/>

// 2. Para contato enviado:
<CardSucesso
  titulo="Mensagem enviada!"
  mensagem="Recebemos sua mensagem. Nossa equipe responderá em até 24 horas."
  botaoTexto="Voltar ao início"
  onClose={handleFecharCard}
/>

// 3. Para newsletter cadastrada:
<CardSucesso
  titulo="Inscrição realizada!"
  mensagem="Você foi inscrito em nossa newsletter. Fique por dentro das novidades e promoções."
  botaoTexto="Explorar portfólio"
  onClose={handleFecharCard}
  className="card-personalizado"
/>

// 4. Com ícone customizado (futuras melhorias):
<CardSucesso
  titulo="Upload concluído!"
  mensagem="Sua imagem foi enviada com sucesso."
  codigo="IMG-2024-003"
  botaoTexto="Enviar outra imagem"
  icone="upload" // para futuras implementações
  onClose={handleFecharCard}
/>