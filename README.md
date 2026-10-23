# CodeCam — Da lousa ao aprendizado

> Sprint 4 · Front-End Design + Web Development (entrega conjunta) · FIAP · Turma 1ESPW-26

O **CodeCam** transforma o conteúdo de uma aula em material de estudo: **resumos**, **tópicos** e **flashcards**.
Esta entrega é a **evolução do projeto da Sprint 3**: a Landing Page (HTML/CSS) foi migrada para **React + Tailwind CSS** e integrada ao aplicativo web (geração de resumos e flashcards a partir da API da Wikipédia), agora com **autenticação, rotas públicas e privadas, hooks customizados e consumo de APIs**.

- **Repositório Git:** `COLE_AQUI_O_LINK_DO_REPOSITORIO`
- **Deploy (Vercel):** `COLE_AQUI_O_LINK_DA_VERCEL`

---

## Tecnologias utilizadas

| Tecnologia | Uso |
| --- | --- |
| React 19 | Componentização, props, hooks nativos e customizados |
| Vite 8 | Bundler e servidor de desenvolvimento |
| React Router DOM 7 | Rotas públicas e privadas (SPA) |
| Tailwind CSS 4 | Estilização 100% por classes utilitárias + tema (`@theme`) |
| Wikipédia API (pt) | API pública de terceiros (sem chave): busca de temas e geração de resumos e flashcards |
| MockAPI | (Opcional) API mockada da Comunidade e do contato; sem ela, funciona em modo local |
| Web Speech API | Leitura em voz alta dos resumos (acessibilidade) |
| localStorage | Sessão, histórico e preferências de acessibilidade |
| Git + Vercel | Versionamento e deploy |

---

## Requisitos da Sprint × onde estão no projeto

| Requisito | Onde |
| --- | --- |
| Integração da Landing Page ao React | `src/components/landing/*` e `src/pages/LandingPage.jsx` |
| Componentização e props | `src/components/{layout,ui,landing,app}` |
| Rotas públicas | `/`, `/explorar`, `/login`, `/registrar` (`src/App.jsx`) |
| Rotas privadas | `/app`, `/gerar`, `/historico`, `/comunidade` via `ProtectedRoute` |
| Hooks nativos | `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useContext` |
| Hooks customizados | `src/hooks/*` (ver lista abaixo) |
| Lógica separada da parte visual | Páginas só renderizam; a lógica vive em hooks e `services/` |
| Consumo de API | API pública da Wikipédia (principal) e MockAPI (opcional) |
| Tailwind CSS | `src/index.css` (tema) + classes utilitárias nos componentes |
| Responsividade | Desktop, tablet e mobile (breakpoints `sm`, `md`, `lg`; barra de navegação inferior no mobile) |
| Deploy | Git + Vercel (`vercel.json` com rewrite para SPA) |

### Hooks customizados

`useAuth`, `useLocalStorage`, `useDebounce`, `useInView`, `useCarousel`, `useTyping`, `usePrefersReducedMotion`,
`useAccessibility`, `useSpeech`, `useHistory`, `useGenerator`, `useFlashcardSession`, `useWikiSearch`, `useCommunity`, `useContactForm`.

---

## Como instalar as dependências

Pré-requisitos: **Node.js 22 LTS (mínimo 20.19)** e **npm ≥ 9**.

```bash
npm install
```

## Como executar o projeto

```bash
npm run dev
```

Abra **http://localhost:5173**.

Build de produção:

```bash
npm run build
npm run preview
```

## Servidores / Back-end

Não há back-end próprio. Tudo roda no navegador e consome APIs externas. **Não é necessário subir nenhum servidor**, além do `npm run dev`.

## Variáveis de ambiente (opcionais)

O projeto **funciona sem nenhuma variável** e a API da Wikipédia **não exige chave**. Só se quiser conectar a Comunidade e o formulário de contato a um MockAPI, copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

| Variável | Para quê |
| --- | --- |
| `VITE_MOCKAPI_URL` | URL base do seu MockAPI. Sem ela, a Comunidade e o contato funcionam em modo local. |

> Reinicie o `npm run dev` após alterar o `.env`. Na Vercel, cadastre a variável em *Settings → Environment Variables*.

## Usuários e senhas para teste

| Tipo | E-mail | Senha |
| --- | --- | --- |
| Conta de teste | `demo@codecam.com` | `codecam123` |

Também é possível criar uma conta em **/registrar** (autenticação simulada, salva no navegador com senha em hash SHA-256).

## Mapa de rotas

| Rota | Acesso | Descrição |
| --- | --- | --- |
| `/` | Pública | Landing Page completa |
| `/explorar` | Pública | Busca de temas na Wikipédia (API) |
| `/login`, `/registrar` | Pública (só deslogado) | Autenticação |
| `/app` | **Privada** | Painel com estatísticas e sequência de estudo |
| `/gerar` | **Privada** | Gerar resumo e/ou flashcards |
| `/historico` | **Privada** | Histórico, filtros e revisão |
| `/comunidade` | **Privada** | Baralhos compartilhados (API) |

## Diferenciais criativos

- Efeito de digitação na lousa do Hero e carrossel de telas controlável (autoplay, pausa, setas).
- **Acessibilidade viva**: alto contraste, fonte para dislexia e tamanho de texto ajustáveis no site inteiro, além de **leitura em voz alta** do resumo.
- **Flashcards de lacuna** ("complete a lacuna") e resumos montados em tempo real a partir da API da Wikipédia, sem chave e sem back-end.
- Sequência de estudo (streak), estatísticas e histórico filtrável.
- Comunidade de baralhos com curtidas.

## Uso de Inteligência Artificial no projeto

A ferramenta **Claude (Anthropic)** foi utilizada na Sprint 4 como apoio ao **desenvolvimento**: para analisar o código da Sprint 3, propor a arquitetura da migração da Landing Page para React + Tailwind, gerar a estrutura inicial dos componentes, das rotas públicas/privadas, dos hooks customizados e dos serviços de API, e para redigir este README. O grupo revisou, testou e ajustou o código, definiu a identidade visual e as regras de negócio (herdadas das Sprints 2 e 3) e configurou o deploy. **O produto em execução não usa nenhuma IA generativa**: os resumos e flashcards são montados por algoritmos próprios (divisão de frases, escolha de palavra-chave para as lacunas e embaralhamento Fisher-Yates) a partir da API pública da Wikipédia. Na Sprint 3, o Kiro havia sido usado como ferramenta de apoio para dúvidas e ajustes pontuais.

## Estrutura de pastas

```
src/
├─ components/
│  ├─ landing/   # seções da Landing Page
│  ├─ layout/    # headers, footer, layouts e rotas protegidas
│  ├─ app/       # SummaryView, FlashcardDeck, StatCard...
│  └─ ui/        # Reveal, Phone, Icon, AccessibilityMenu...
├─ context/      # AuthProvider
├─ hooks/        # hooks customizados
├─ pages/        # páginas (uma por rota)
├─ services/     # wikipedia, wikipediaStudy, communityApi, authService
└─ utils/        # math e stats
```

## Integrantes

Veja `INTEGRANTES.TXT`.
