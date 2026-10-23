# 🛡️ Cyber Segurança

### Educação, conscientização e proteção no mundo digital

O **Cyber Segurança** é um projeto educacional desenvolvido para apresentar conceitos fundamentais de cibersegurança de maneira acessível, didática e interativa.

O site combina conteúdos explicativos, exemplos de ameaças digitais, simulações educativas, verificação básica de senhas e um quiz com sistema de pontuação e ranking.

O objetivo é incentivar boas práticas de segurança digital e ajudar estudantes e outros usuários a reconhecer riscos presentes na internet.

## 🌐 Acesse o projeto

**Site:** https://lightis4.github.io/Cyber_seguranca/cyber.html

**Repositório:** https://github.com/Lightis4/Cyber_seguranca

> A interface está publicada no GitHub Pages. As funcionalidades que dependem da API Node.js exigem que o backend também esteja disponível em um servidor público.

---

## 🎯 Objetivos do projeto

- Apresentar os fundamentos da cibersegurança.
- Explicar ameaças digitais e técnicas utilizadas por criminosos virtuais.
- Demonstrar a importância de senhas fortes e hábitos seguros.
- Conscientizar sobre golpes de phishing e engenharia social.
- Estimular a aprendizagem por meio de atividades interativas.
- Permitir a revisão do conteúdo utilizando um quiz.
- Disponibilizar acesso ao site por meio de QR Code.

## 🚀 Funcionalidades

### 📚 Conteúdo educativo

O site apresenta informações sobre:

- Conceitos de cibersegurança.
- Importância da proteção de dados.
- Segurança de redes e aplicações.
- Carreiras na área de cibersegurança.
- Engenharia social e phishing.
- Malware e ransomware.
- Roubo de identidade.
- Ataques de força bruta.
- Boas práticas para criação de senhas.

### 🔐 Verificador de força de senha

Ferramenta interativa que avalia critérios básicos de segurança de uma senha fictícia, considerando:

- Quantidade mínima de caracteres.
- Presença de letras maiúsculas.
- Presença de letras minúsculas.
- Utilização de números.
- Utilização de símbolos especiais.

A ferramenta apresenta indicadores visuais e orientações educativas.

**Observação:** o verificador não realiza uma auditoria completa de segurança. Recomenda-se não utilizar senhas reais durante a demonstração.

### 🎣 Simulador de phishing

Atividade educativa destinada a demonstrar como mensagens fraudulentas podem tentar enganar usuários.

A simulação apresenta situações para que o participante identifique sinais de possíveis golpes e compreenda os riscos da engenharia social.

### 🧠 Quiz interativo

O projeto conta com um quiz de cibersegurança contendo:

- 10 perguntas.
- Tempo limitado para responder.
- Pontuação por respostas corretas.
- Pontos adicionais conforme o tempo restante.
- Resultado ao finalizar a atividade.
- Integração com uma API para registrar resultados.

O quiz permite revisar os conhecimentos adquiridos durante a apresentação.

### 🏆 Ranking de participantes

Sistema de classificação que apresenta os resultados registrados pelos participantes.

A implementação utiliza uma API em Node.js e um banco de dados PostgreSQL hospedado no Neon.

A disponibilidade do ranking online depende do funcionamento do backend.

### 📱 QR Code

Página que permite gerar e baixar um QR Code para acessar o site pelo celular.

Também possui um gerador personalizado, no qual o usuário pode informar uma URL e criar seu próprio QR Code.

### 🎨 Interface responsiva

O projeto utiliza um tema escuro, com tons de azul e verde neon, buscando oferecer uma experiência visual consistente em computadores e dispositivos móveis.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização e responsividade |
| JavaScript | Interatividade e funcionalidades |
| Node.js | Ambiente de execução do backend |
| Express.js | Criação das rotas da API |
| PostgreSQL | Armazenamento dos resultados |
| Neon | Hospedagem do banco PostgreSQL |
| QRCode.js | Geração dos QR Codes |
| Git | Controle de versões |
| GitHub | Hospedagem do repositório |
| GitHub Pages | Publicação da interface |

## 📁 Estrutura do projeto

```text
Cyber_seguranca/
│
├── backend/
│   ├── db.js
│   ├── perguntas.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── cyber.html
├── style.css
├── script.js
│
├── quiz.html
├── quiz.js
│
├── ranking.html
├── ranking.js
│
├── qrcode.html
├── qrcode.js
│
├── extras.css
├── cyber2.0.png
├── Gemini_Generated_Image_8une9p8une9p8une.jpg
│
├── .gitignore
└── README.md
```

O arquivo `.env`, utilizado para configurações privadas, não deve ser publicado no repositório.

---

## 💻 Como executar o projeto localmente

### 1. Pré-requisitos

É recomendado ter instalado:

- Visual Studio Code.
- Git.
- Node.js e npm.
- Extensão Live Server no VS Code.

### 2. Clonar o repositório

Abra o terminal e execute:

```bash
git clone https://github.com/Lightis4/Cyber_seguranca.git
```

Entre na pasta:

```bash
cd Cyber_seguranca
```

### 3. Executar a interface

Abra a pasta no VS Code:

```bash
code .
```

Localize o arquivo `cyber.html`, clique com o botão direito e selecione **Open with Live Server**.

A interface será aberta no navegador.

### 4. Instalar as dependências do backend

No terminal:

```bash
cd backend
npm install
```

### 5. Configurar o banco de dados

O backend utiliza PostgreSQL por meio do Neon.

É necessário configurar as variáveis de ambiente conforme a implementação de `db.js`, utilizando um arquivo `.env` local.

Exemplo ilustrativo:

```env
DATABASE_URL=postgresql://USUARIO:SENHA@HOST/BANCO?sslmode=require
PORT=3000
```

Os nomes das variáveis devem corresponder aos utilizados pelo código do backend.

**Nunca publique credenciais reais ou arquivos `.env` no GitHub.**

### 6. Iniciar o servidor

Na pasta `backend`, execute:

```bash
node server.js
```

Na configuração local utilizada durante o desenvolvimento, a API é executada na porta `3000`.

Para que o quiz e o ranking funcionem, o backend precisa estar conectado corretamente ao banco de dados.

---

## 🔄 Funcionamento da aplicação

A arquitetura do projeto é dividida em três partes principais:

**Frontend:** responsável pela apresentação dos conteúdos, navegação, interações e interface do quiz.

**Backend:** responsável pelo processamento das requisições, gerenciamento das perguntas e operações relacionadas aos resultados.

**Banco de dados:** responsável pelo armazenamento persistente dos resultados dos participantes.

Fluxo simplificado:

```text
Usuário
   |
   v
Interface HTML, CSS e JavaScript
   |
   v
API Node.js + Express
   |
   v
PostgreSQL (Neon)
   |
   v
Resultados e Ranking
```

## 🌍 Publicação

O frontend é publicado utilizando o GitHub Pages:

https://lightis4.github.io/Cyber_seguranca/cyber.html

O GitHub Pages hospeda arquivos estáticos, mas não executa servidores Node.js.

Para disponibilizar o quiz com persistência e o ranking online, é necessário hospedar o backend separadamente, configurar as variáveis de ambiente no servidor e utilizar a URL pública da API no frontend.

## 🔒 Segurança

O projeto possui finalidade educacional.

Entre os cuidados recomendados durante o desenvolvimento estão:

- Manter credenciais do banco fora do repositório.
- Utilizar arquivos `.env` para configurações privadas.
- Configurar corretamente o `.gitignore`.
- Utilizar HTTPS em serviços publicados.
- Validar dados recebidos pela API.
- Restringir o acesso ao banco de dados.
- Não utilizar senhas reais nas demonstrações educativas.

## 📈 Possíveis melhorias futuras

- Hospedagem pública do backend.
- Aprimoramento do sistema de ranking.
- Inclusão de novos quizzes e níveis de dificuldade.
- Expansão do conteúdo educativo.
- Implementação de novas simulações de segurança.
- Melhorias de acessibilidade.
- Testes automatizados.
- Aprimoramento da experiência em dispositivos móveis.

## 🎓 Finalidade acadêmica

O Cyber Segurança foi desenvolvido como projeto de aprendizagem e apresentação de conceitos relacionados à segurança da informação.

A proposta busca unir conhecimentos de desenvolvimento web, programação, integração com banco de dados e conscientização digital em uma aplicação prática.

## 👨‍💻 Desenvolvimento

**Repositório:** [Lightis4/Cyber_seguranca](https://github.com/Lightis4/Cyber_seguranca)

**GitHub:** [@Lightis4](https://github.com/Lightis4)

---

**Cyber Segurança — Conhecimento também é uma forma de proteção digital.**
