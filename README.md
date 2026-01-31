# 💰 My Finance Dashboard

O **My Finance Dashboard** é uma aplicação completa de gestão financeira pessoal. Com uma interface moderna e intuitiva, permite o controle total de receitas e despesas, oferecendo visualizações gráficas e um sistema de autenticação robusto.



## 🚀 Funcionalidades

- **Autenticação Segura**: Sistema de login via Supabase Auth com persistência de sessão e proteção de rotas.
- **Gestão de Transações (CRUD)**: Adição, listagem, edição e exclusão de receitas e despesas de forma persistente.
- **Filtros e Ordenação**: Busca inteligente por categoria, tipo de transação (entrada/saída) e ordenação por data ou valor.
- **Dashboard Dinâmico**: Resumo de saldo total, receitas e despesas com cálculos automáticos e gráficos do Recharts.
- **Feedback Visual (Toasts)**: Notificações interativas para cada ação do usuário utilizando `react-hot-toast`.
- **Confirmações Customizadas**: Diálogos de exclusão profissionais que substituem os alertas nativos do navegador.
- **Interface Responsiva**: Design adaptável para diferentes tamanhos de tela com suporte a Dark Mode.

---

## 🛠️ Tecnologias e Ferramentas

### **Frontend**
- **React + TypeScript + Vite**: Base do projeto para alta performance e tipagem estática.
- **Tailwind CSS**: Estilização moderna através de utilitários.
- **React Icons**: Biblioteca de ícones (Font Awesome, HeroIcons, Material Design).
- **React Hot Toast**: Sistema de notificações interativas e toasts de confirmação.
- **Recharts**: Visualização de dados através de gráficos dinâmicos.
- **Axios**: Cliente HTTP para comunicação com o backend.

### **Backend**
- **Node.js + Express**: Servidor para processamento de regras de negócio e intermediação segura.
- **Supabase (PostgreSQL)**: Banco de dados relacional e serviço de autenticação.
- **Service Role Security**: Arquitetura que isola o acesso ao banco de dados, utilizando chaves administrativas apenas no servidor.
- **JWT (JSON Web Tokens)**: Validação de identidade nas requisições protegidas.

---

## 🔐 Arquitetura de Segurança

Diferente de aplicações que conectam o frontend diretamente ao banco de dados, este projeto utiliza uma **camada intermediária (Backend)** para maior segurança:



1. O **Frontend** realiza o login via Supabase e obtém um token de usuário.
2. Todas as requisições de dados passam pelo nosso servidor **Node.js**, que valida o token.
3. O Backend utiliza a `service_role_key` (chave mestra) para interagir com o Supabase. Isso garante que as políticas de **RLS (Row Level Security)** protejam os dados de acessos externos maliciosos, enquanto nossa API mantém controle total sobre as operações permitidas.

---

## 📦 Como Rodar o Projeto

### 1. Clonar o repositório
```bash
git clone [https://github.com/pedrolucasdeveloper/my-finance-dashboard.git](https://github.com/pedrolucasdeveloper/my-finance-dashboard.git)
cd my-finance-dashboard
