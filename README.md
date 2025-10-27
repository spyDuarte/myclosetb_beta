# MyClosetB

Painel profissional para gestão de guarda-roupa digital, looks e marketplace de trocas. A aplicação foi redesenhada com foco em experiência do usuário, identidade visual consistente e fluxo de trabalho seguro para equipes.

## ✨ Destaques
- **Dashboard unificado:** visão clara de peças, looks, estatísticas e marketplace em abas responsivas.
- **Interface premium:** novo layout com layout shell, cabeçalhos contextuais, estados vazios elegantes e microinterações.
- **Marketplace inteligente:** filtros avançados, cartões detalhados, destaques numéricos e ações específicas para o proprietário do anúncio.
- **Estatísticas acionáveis:** distribuição por categoria, peças em destaque e histórico recente com visual refinado.
- **DX fortalecida:** variáveis de ambiente tipadas, estrutura em módulos reutilizáveis e README completo.

## 🧱 Stack
- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + design tokens customizados
- [shadcn/ui](https://ui.shadcn.com/) e Radix UI como kit de componentes
- [Supabase](https://supabase.com/) (auth, banco e storage)
- [TanStack Query](https://tanstack.com/query/latest) para estado assíncrono

## 🚀 Primeiros passos

### Requisitos
- Node.js 18 ou superior (recomendado instalar via [nvm](https://github.com/nvm-sh/nvm))
- Conta no [Supabase](https://app.supabase.com/) com projeto configurado

### Configuração
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie um arquivo `.env` baseado no `.env.example` e preencha com as credenciais do seu projeto Supabase:
   ```bash
   cp .env.example .env
   # edite o arquivo com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse `http://localhost:5173`.

### Scripts úteis
- `npm run dev` – modo desenvolvimento com HMR.
- `npm run build` – build de produção.
- `npm run preview` – servidor para inspecionar o build.
- `npm run lint` – análise estática com ESLint.

## 🗂️ Estrutura destacada
```
src/
  components/
    layout/        # AppShell, PageHeader e derivados
    ui/            # base shadcn/ui (tokens e utilitários)
    modals/        # fluxos de criação, compra e edição
    Marketplace.tsx
    Wardrobe.tsx
    Looks.tsx
    Statistics.tsx
  pages/
    Index.tsx      # dashboard principal com routing por abas
    Auth.tsx       # fluxo de autenticação
  integrations/
    supabase/      # cliente tipado e schemas
  lib/
    utils.ts       # helpers de estilo e mensagens
```

## 🔐 Variáveis de ambiente
| Variável                 | Descrição                                    |
|--------------------------|----------------------------------------------|
| `VITE_SUPABASE_URL`      | URL do projeto Supabase                      |
| `VITE_SUPABASE_ANON_KEY` | Chave pública (anon) do Supabase             |

> **Importante:** nunca comite chaves reais. Utilize `.env` apenas localmente e configure os valores correspondentes em ambientes de CI/CD ou hospedagem.

## ✅ Boas práticas
- Componentes compartilham layout e padrões de acessibilidade (atalhos de teclado, foco visível, leitores de tela).
- Estados de carregamento, erro e vazio possuem feedback consistente.
- Filtros e buscas utilizam `useMemo` para performance.
- Supabase client é inicializado com validação de ambiente para evitar build quebrado.

## 🔮 Próximos passos sugeridos
1. Revisar o fluxo de autenticação (`src/pages/Auth.tsx`) para alinhar ao novo design.
2. Implementar testes end-to-end (Playwright/Cypress) para fluxos críticos.
3. Configurar pipeline CI com lint + build para manter a qualidade.

---

Feito com cuidado para entregar uma experiência robusta e pronta para crescimento.
