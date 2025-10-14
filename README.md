
# Sistema de Gestão de Reciclagem Têxtil ♻️

Uma aplicação web completa para gestão e rastreabilidade da coleta de tecidos, com cálculo de impacto ambiental (Peso e CO₂).

## 🚀 Sobre o Projeto

Este projeto é uma aplicação web completa desenvolvida para auxiliar organizações que trabalham com a reciclagem de tecidos, especificamente fardas e uniformes. O sistema permite um controlo detalhado da coleta dos materiais, rastreando a sua origem, e calcula automaticamente o impacto ambiental positivo gerado.

A aplicação foi desenhada para ser uma ferramenta de gestão interna, segura e de fácil utilização, permitindo que a organização quantifique e apresente o seu trabalho de forma clara e profissional.

## ✨ Funcionalidades Principais 

O sistema possui um conjunto completo de funcionalidades (CRUD) para uma gestão eficiente:

🔐 Autenticação Segura:

Registo e Login de utilizadores.

Proteção de rotas com Tokens JWT para acesso seguro.

📦 Gestão de Coletas:

Registar: Formulário intuitivo para lançar a origem e a quantidade de cada peça.

Ler: Histórico completo de todas as coletas em tabela organizada.

Atualizar: Edição de registos existentes para corrigir ou adicionar informações.

Apagar: Remoção de registos com janela de confirmação.

📊 Cálculo de Impacto:

Cálculo automático e em tempo real do Peso Total (kg) e CO₂ Evitado (kg).

🔍 Visualização de Detalhes:

# 🛠️ Tecnologias Utilizadas

A aplicação foi construída utilizando uma arquitetura moderna com separação entre frontend e backend.

<p align="center">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/HTML5-E34F26%3Fstyle%3Dfor-the-badge%26logo%3Dhtml5%26logoColor%3Dwhite" alt="HTML5"/>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Tailwind_CSS-38B2AC%3Fstyle%3Dfor-the-badge%26logo%3Dtailwind-css%26logoColor%3Dwhite" alt="Tailwind CSS"/>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/JavaScript-F7DF1E%3Fstyle%3Dfor-the-badge%26logo%3Djavascript%26logoColor%3Dblack" alt="JavaScript"/>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Node.js-339933%3Fstyle%3Dfor-the-badge%26logo%3Dnodedotjs%26logoColor%3Dwhite" alt="Node.js"/>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Express.js-000000%3Fstyle%3Dfor-the-badge%26logo%3Dexpress%26logoColor%3Dwhite" alt="Express.js"/>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/MongoDB-47A248%3Fstyle%3Dfor-the-badge%26logo%3Dmongodb%26logoColor%3Dwhite" alt="MongoDB"/>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Mongoose-880000%3Fstyle%3Dfor-the-badge%26logo%3Dmongoose%26logoColor%3Dwhite" alt="Mongoose"/>
</p>

### Como Configurar e Executar o Projeto

Siga os passos abaixo para ter a aplicação a funcionar na sua máquina.

Pré-requisitos
Node.js e npm: Certifique-se de que tem o Node.js instalado.

Conta no MongoDB Atlas: É necessário ter uma conta gratuita no MongoDB Atlas.

Passos de Instalação

1. Clone o Repositório (ou descarregue os ficheiros):
Coloque todos os ficheiros do projeto numa única pasta no seu computador.

2. Navegue para a Pasta do Projeto:
Abra o seu terminal e utilize o comando cd para entrar na pasta do projeto.

[ cd caminho/para/a/pasta ]


3. Instale as Dependências do Servidor:
Execute o comando abaixo para instalar todas as bibliotecas que o server.js precisa.

[npm install express mongoose cors bcryptjs jsonwebtoken]

4. Configure a String de Conexão:

Abra o ficheiro server.js.

Encontre a linha: const MONGO_URI = 'SUA_STRING_DE_CONEXAO_AQUI';

Substitua 'SUA_STRING_DE_CONEXAO_AQUI' pela sua string de conexão do MongoDB Atlas, lembrando-se de inserir a sua senha corretamente.

### Executar a Aplicação

1. Inicie o Servidor Backend:
No terminal, execute o comando: [ node server.js ]

Se tudo estiver correto, verá as mensagens "Servidor rodando na porta http://localhost:3000" e "Conectado ao MongoDB com sucesso!". Mantenha este terminal aberto.

2. Abra o Frontend:

Navegue para a pasta do projeto no seu explorador de ficheiros.

Abra o ficheiro login.html ou registro.html no seu navegador de internet.

A partir daí, pode criar a sua conta e começar a usar o sistema!


### Autor - Jeovan Bispo