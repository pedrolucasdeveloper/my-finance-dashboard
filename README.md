# 💰 My Finance Dashboard

Dashboard financeiro pessoal com autenticação, transações, orçamentos por categoria e gráficos. O frontend React acessa o Supabase diretamente; as políticas de Row Level Security (RLS) garantem que cada usuário veja e altere apenas os próprios dados.

## Arquitetura

- React 19, TypeScript, Vite e Tailwind CSS
- Supabase Auth e PostgreSQL
- RLS para isolamento dos dados por usuário
- Deploy estático na Vercel, sem servidor Express separado

O diretório `backend/` contém a implementação anterior e não é usado pelo frontend atual. A chave `service_role` não é necessária e nunca deve ser exposta no navegador.

## Recuperar o projeto após excluir o Supabase

### 1. Criar um projeto Supabase

Crie um projeto em [supabase.com/dashboard](https://supabase.com/dashboard). Quando ele estiver pronto, abra o **SQL Editor**, copie todo o conteúdo de [`supabase/migrations/20261110000000_initial_schema.sql`](supabase/migrations/20261110000000_initial_schema.sql) e execute uma vez.

Essa migration cria as tabelas `transactions` e `budgets`, índices, permissões mínimas e todas as políticas RLS.

### 2. Configurar as variáveis locais

No painel do Supabase, abra o diálogo **Connect** e copie a **Project URL** e a **Publishable key**. Depois:

```bash
cd frontend
cp .env.example .env.local
```

Preencha `frontend/.env.local`:

```dotenv
VITE_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publicavel
```

O nome antigo `VITE_SUPABASE_ANON_KEY` ainda é aceito para compatibilidade. Não use `service_role` no frontend.

### 3. Rodar localmente

```bash
cd frontend
npm install
npm run dev
```

Em **Supabase → Authentication → URL Configuration**, adicione `http://localhost:5173/**` às **Redirect URLs**. Abra a URL indicada pelo Vite, selecione **Ainda não tenho uma conta** e faça o cadastro. Se a confirmação de e-mail estiver habilitada no Supabase, confirme a mensagem recebida antes do primeiro login.

Como este é um dashboard pessoal, depois de criar sua conta você pode desabilitar novos cadastros nas configurações do provedor de e-mail do Supabase.

## Deploy na Vercel

1. Importe este repositório na Vercel. O `vercel.json` da raiz já define instalação, build, saída e fallback das rotas do React.
2. Em **Settings → Environment Variables**, adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` para Production, Preview e Development.
3. Faça o deploy. Se alterar uma variável depois, gere um novo deploy para que ela entre no bundle do Vite.
4. Em **Supabase → Authentication → URL Configuration**, defina a URL da Vercel como **Site URL** e adicione `https://seu-dominio.vercel.app/**` em **Redirect URLs**.

Também é possível configurar `frontend` como **Root Directory** na Vercel; nesse caso, o `frontend/vercel.json` fornece o fallback das rotas.

## Validação

```bash
cd frontend
npm run lint
npm run build
```

Arquivos `.env`, builds e dependências estão ignorados pelo Git.
