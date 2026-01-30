# My Finance Dashboard

O **My Finance Dashboard** é uma ferramenta pessoal para gerenciamento de finanças, projetada para ajudar a controlar e visualizar as receitas e despesas de maneira prática e eficiente. O projeto foi desenvolvido utilizando **React**, **TypeScript**, **Vite** no frontend e **Node.js** com **Express** no backend.

## Funcionalidades

- **Visão Geral das Finanças**: Mostra uma visão geral das receitas e despesas.
- **Tabelas de Gastos**: Exibe as transações financeiras de forma detalhada, com filtros por categoria e data.
- **Gráficos**: Representação visual dos gastos por categoria.
- **Adicionar/Editar/Excluir Despesas e Receitas**: Permite o usuário cadastrar e gerenciar transações financeiras.
- **Alertas**: Notifica o usuário sobre gastos excessivos ou saldo baixo.

## Estrutura do Repositório

O repositório está dividido em duas partes principais:

- **Frontend**: Pasta `frontend` contém o código do cliente (React + TypeScript + Vite).
- **Backend**: Pasta `backend` contém a API (Node.js + Express).

## Tecnologias Utilizadas

- **Frontend**:
  - React
  - TypeScript
  - Vite
  - Axios (para requisições HTTP)
  - Chakra UI (para componentes de interface)
  
- **Backend**:
  - Node.js
  - Express
  - SQLite (ou outro banco de dados, dependendo da sua escolha)
  - CORS

## Como Rodar o Projeto

### 1. **Instalar as Dependências**

Clone o repositório e instale as dependências para o **frontend** e **backend**:

```bash
# Clone o repositório
git clone https://github.com/SEU-USUARIO/my-finance-dashboard.git
cd my-finance-dashboard

# Instale as dependências do frontend
cd frontend
npm install

# Instale as dependências do backend
cd ../backend
npm install
