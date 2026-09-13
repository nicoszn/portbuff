# Portbuff — Technical Planner Prompt

> This document is written so that any AI agent — even one that has never seen this codebase and even if it wants to use a different framework (Next.js, Astro, Vite+React, SvelteKit, etc.) — can build the complete Portbuff product from this spec alone.

---

## 1. What Portbuff Is

Portbuff is an **investment platform landing page + authenticated web app** that gives investors access to global investment opportunities across agriculture, minerals, energy, real estate, technology, and infrastructure.

Two audiences:
1. **Visitors / prospective investors** — see the public landing page, then sign up or log in.
2. **Signed-in users** — access a dashboard, investment plans, deposit/withdraw flows, transaction history, settings, and chat with admin.
3. **Admins** — separate admin panel for user/plan/investment/transaction/chat/language management.

The product should feel premium, trustworthy, and global — dark navy + gold/amber accents, crisp typography, subtle motion, and clean data-heavy UI for the dashboard/admin areas.

---

## 2. Product Requirements (must build)

### 2.1 Public landing page (`/` or equivalent root)

Must immediately explain what the product is and funnel visitors into auth. Include these sections in order:

- **Navbar** — logo, anchor links (Features, Plans, Dashboard preview), language switcher, Log In / Sign Up CTAs, mobile menu.
- **Hero** — value proposition headline + subheadline, two CTAs ("Start Investing Today" → auth, "Explore Opportunities" → features), and 4 social-proof stats (Active Investors, Total Invested, Avg Annual Return, Countries).
- **Features section** — 6 sectors: Agriculture, Minerals & Mining, Energy & Renewables, Real Estate, Technology, Infrastructure. Each with icon + description.
- **Plans section** — 3 tiers: Starter ($500 min), Growth ($5,000 min, "Most Popular"), Premium ($25,000 min, "For Serious Investors"). Each shows price, highlight label, feature checklist, CTA.
- **Dashboard preview** — a mock browser chrome showing 4 metric cards (Total Portfolio Value, Total Return, Active Investments, Monthly Income), a "Recent Activity" list (3 items: Agriculture Fund, Solar Project Alpha, Gold Mining Venture with returns), and a "Portfolio Allocation" segment bar + legend. This is illustrative only — not real data.
- **CTA section** — final gradient banner: "Ready to Grow Your Wealth?" + "Create Free Account" button.
- **Footer** — brand block, Platform links, Company links, Legal links, copyright + risk disclaimer.

### 2.2 Auth (`/auth` or equivalent)

- Toggle between Sign In / Sign Up.
- Sign In: email + password, demo credentials affordances, error + success feedback.
- Sign Up: first name, last name, email, password, confirm password, validation, success + redirect.
- Redirect after login:
  - admin → admin dashboard
  - user → main dashboard
- Signed-in users visiting `/auth` should be redirected to their dashboard.
- Auth is session-based and persistent across reloads.

### 2.3 Main dashboard (`/dashboard` and sub-routes)

Protected for signed-in users. Include:

- Welcome header.
- 4 stat cards: Account Balance, Total Invested, Current Profit, Total Earned.
- Portfolio overview chart (area chart of balance/profit over time).
- Active investments pie/donut chart with legend.
- Profit trend chart.
- Active investments list with progress bars.
- Recent transactions table with type/amount/date/status.

### 2.4 Investment plans (`/dashboard/plans`)

- List available plans (min/max capital, daily %, duration, description, color, icon).
- Click "Invest Now" → modal to enter amount.
- Show available balance, estimated profit, total return live as user types amount.
- Validate amount against min/max and balance.
- Confirmation modal summarizing investment (amount, daily %, days, start/end dates, estimated profit).
- On confirm, deduct from balance, record investment, show success feedback.

### 2.5 Transactions (`/dashboard/transactions`)

- Table of deposits and withdrawals for the current user.
- Show type, amount, date, status (pending / approved / rejected).
- Empty state when none.

### 2.6 Settings (`/dashboard/settings`)

- Personal info: first name, last name, email.
- Crypto info: crypto name, network, address.
- Save changes with success feedback.
- Language selection (ties into i18n — see Section 4).

### 2.7 Chat (`/dashboard/settings` or floating chat widget)

- User can send messages to admin.
- Admin can reply.
- Show message history scoped to the user-admin pair.
- Mark messages read.

### 2.8 Admin panel (`/admin` and sub-routes)

Protected for admin role only. Include:

- **Admin dashboard** — total users, active investments, pending deposits, pending withdrawals, total revenue; revenue-by-plan chart; recent activity list.
- **Users** — list, search, create/edit/block/unblock/delete. Manual user creation with first/last name, email, password, role, balance, status.
- **Plans** — list with color/icon, create/edit/delete.
- **Investments** — list with user + plan context, edit amount/daily%/days/status, delete.
- **Transactions** — tabs for All / Deposits / Withdrawals; approve/reject pending items; approving a deposit credits the user's balance and total invested.
- **Chats** — list of user conversations, select one, message back and forth.
- **Languages** — list configured languages with enable/disable toggle, create/edit/delete, open a translation editor. Built-in default languages cannot be deleted.

### 2.9 Translation editor (admin → Languages → Translate)

- Shows all translatable keys grouped by section (app, auth, nav, dashboard, plans, deposit, withdraw, transactions, settings, chat, admin, common).
- Each key shows the English source (read-only) + editable translation field.
- Progress bar: translated count / total keys.
- Search across keys and values.
- Fill all with English, reset to saved, export JSON, import JSON.
- Saving registers translations at runtime into i18next and persists them.

---

## 3. Data Model

Use these types as the source of truth. An agent may rename fields to fit its framework, but must preserve meaning and relationships.

### User
```
id, firstName, lastName, email, password, role (user|admin),
balance, totalInvested, totalEarned, currentProfit,
cryptoAddress?, cryptoNetwork?, cryptoName?,
status (active|blocked), createdAt, investmentId?
```

### Plan
```
id, name, minCapital, maxCapital, dailyPercentage, days,
description, color, icon
```

### Investment
```
id, userId, planId, amount, dailyPercentage, days,
startDate, endDate, estimatedProfit, currentProfit,
status (active|completed|cancelled)
```

### Transaction
```
id, userId, type (deposit|withdrawal), amount,
cryptoName, cryptoNetwork, cryptoAddress,
status (pending|approved|rejected),
createdAt, processedAt?, adminNote?
```

### ChatMessage
```
id, senderId, receiverId, message, createdAt, read
```

### DepositAddress
```
id, name, address, network
```

### Language
```
code, name, nativeName, enabled, translations (Record<string, string>)
```

---

## 4. i18n Requirements

- Use an i18n library appropriate to the framework (react-i18next / next-intl / Astro i18n routing / etc.).
- Default locale: `en-US`. Secondary: `es-ES`. Both must be fully translated.
- All user-facing strings must live in translation files — no hardcoded UI copy outside them.
- The landing page strings must live under a `landing.*` namespace/key group, same as the app strings live under `auth.*`, `nav.*`, `dashboard.*`, `plans.*`, `deposit.*`, `withdraw.*`, `transactions.*`, `settings.*`, `chat.*`, `admin.*`, `common.*`.
- Provide a default translations source (a TS const or JSON structure) that lists every key with its English value — this is the fallback and the starting point for new language translation.
- Language switching must:
  - Persist choice.
  - Update the `<html lang>` attribute.
  - Support auto-detection from browser languages on first visit, with a manual override that disables auto-detect.
- Custom languages (admin-created) must be registerable at runtime with their own translation maps.
- The translation editor writes into those custom language translation maps and re-registers them with the i18n runtime on save.

### Required translation keys (full inventory)

Provide these exact keys in every language file. An agent may nest them differently (nested JSON vs flat keys), but all keys below must exist.

```
app.name = PortBuff
app.tagline = Smart Investment Portfolio

auth.login = Sign In
auth.signup = Sign Up
auth.email = Email Address
auth.password = Password
auth.firstName = First Name
auth.lastName = Last Name
auth.confirmPassword = Confirm Password
auth.forgotPassword = Forgot Password?
auth.noAccount = Don't have an account?
auth.hasAccount = Already have an account?
auth.createAccount = Create Account
auth.welcomeBack = Welcome Back
auth.welcomeMessage = Sign in to access your investment portfolio
auth.signupMessage = Start your investment journey today
auth.loginSuccess = Signed in successfully!
auth.signupSuccess = Account created successfully!
auth.loginError = Invalid email or password
auth.passwordMismatch = Passwords do not match
auth.orContinueWith = Or continue with
auth.demoCredentials = Demo Credentials

nav.dashboard = Dashboard
nav.plans = Investment Plans
nav.deposit = Deposit
nav.withdraw = Withdraw
nav.transactions = Transactions
nav.settings = Settings
nav.logout = Logout
nav.chat = Chat
nav.features = Features
nav.login = Log In
nav.signup = Sign Up

landing.badge = Trusted by 10,000+ Global Investors
landing.heroTitle = Invest in the World's Most Promising
landing.heroTitleHighlight = Opportunities
landing.heroSubtitle = Access exclusive investment opportunities across agriculture, minerals, energy, and more — all from one powerful platform.
landing.ctaStart = Start Investing Today
landing.ctaExplore = Explore Opportunities
landing.statInvestors = Active Investors
landing.statInvested = Total Invested
landing.statReturn = Avg. Annual Return
landing.statCountries = Countries
landing.featuresLabel = Why Portbuff
landing.featuresTitle = Global Investment, Simplified
landing.featuresSubtitle = We connect you with vetted, high-potential investments across multiple sectors worldwide.
landing.featAgriculture = Agriculture
landing.featAgricultureDesc = Invest in farmland, crops, and sustainable agriculture projects with proven yields across 30+ countries.
landing.featMinerals = Minerals & Mining
landing.featMineralsDesc = Access mineral exploration and mining ventures with transparent valuation and growth potential.
landing.featEnergy = Energy & Renewables
landing.featEnergyDesc = Back solar, wind, hydro, and traditional energy projects driving the global energy transition.
landing.featRealEstate = Real Estate
landing.featRealEstateDesc = Diversify with commercial and residential real estate opportunities in emerging markets.
landing.featTechnology = Technology
landing.featTechnologyDesc = Fund innovative tech startups and infrastructure projects with high growth trajectories.
landing.featInfrastructure = Infrastructure
landing.featInfrastructureDesc = Support roads, bridges, and public works projects that generate stable, long-term returns.
landing.plansLabel = Investment Plans
landing.plansTitle = Choose Your Investment Path
landing.plansSubtitle = Flexible plans designed for every investor — from beginners to seasoned professionals.
landing.planStarter = Starter
landing.planStarterPrice = $500
landing.planStarterMin = minimum
landing.planStarterHighlight = Perfect for beginners
landing.planStarterF1 = Access to curated opportunities
landing.planStarterF2 = Basic portfolio tracking
landing.planStarterF3 = Monthly performance reports
landing.planStarterF4 = Community access
landing.planGrowth = Growth
landing.planGrowthPrice = $5,000
landing.planGrowthMin = minimum
landing.planGrowthHighlight = Most Popular
landing.planGrowthF1 = Everything in Starter
landing.planGrowthF2 = Priority deal flow access
landing.planGrowthF3 = Advanced analytics dashboard
landing.planGrowthF4 = Dedicated account manager
landing.planGrowthF5 = Early access to new deals
landing.planPremium = Premium
landing.planPremiumPrice = $25,000
landing.planPremiumMin = minimum
landing.planPremiumHighlight = For Serious Investors
landing.planPremiumF1 = Everything in Growth
landing.planPremiumF2 = Co-investment opportunities
landing.planPremiumF3 = Custom portfolio allocation
landing.planPremiumF4 = 1-on-1 investment advisory
landing.planPremiumF5 = Exclusive VIP events
landing.planPremiumF6 = White-glove onboarding
landing.getStarted = Get Started
landing.dashLabel = Your Dashboard
landing.dashTitle = Command Center for Your Investments
landing.dashSubtitle = A sleek, intuitive dashboard that gives you real-time visibility into every investment.
landing.dashTotalValue = Total Portfolio Value
landing.dashTotalReturn = Total Return
landing.dashActiveInv = Active Investments
landing.dashMonthlyIncome = Monthly Income
landing.dashRecentActivity = Recent Activity
landing.dashAgriFund = Agriculture Fund — $12,500
landing.dashAgriReturn = +18.4% return
landing.dashSolarProject = Solar Project Alpha — $8,200
landing.dashSolarReturn = +22.1% return
landing.dashGoldMining = Gold Mining Venture — $15,000
landing.dashGoldReturn = +12.7% return
landing.dashPortfolio = Portfolio Allocation
landing.dashPortAgri = Agriculture
landing.dashPortEnergy = Energy
landing.dashPortMinerals = Minerals
landing.dashPortRE = Real Estate
landing.dashPortTech = Technology
landing.ctaTitle = Ready to Grow Your Wealth?
landing.ctaSubtitle = Join thousands of investors who trust Portbuff to access the world's best opportunities.
landing.ctaButton = Create Free Account
landing.footerDesc = Global investment platform connecting investors with opportunities in agriculture, minerals, energy, and beyond.
landing.footerPlatform = Platform
landing.footerCompany = Company
landing.footerLegal = Legal
landing.footerAbout = About Us
landing.footerCareers = Careers
landing.footerBlog = Blog
landing.footerHelp = Help Center
landing.footerTerms = Terms of Service
landing.footerPrivacy = Privacy Policy
landing.footerRisk = Risk Disclosure
landing.footerCopyright = © 2026 Portbuff. All rights reserved.
landing.footerDisclaimer = Investments carry risk. Past performance does not guarantee future results.

dashboard.title = Dashboard
dashboard.welcome = Welcome back
dashboard.balance = Account Balance
dashboard.invested = Total Invested
dashboard.currentProfit = Current Profit
dashboard.totalEarned = Total Earned
dashboard.activeInvestments = Active Investments
dashboard.recentTransactions = Recent Transactions
dashboard.portfolioOverview = Portfolio Overview
dashboard.profitTrend = Profit Trend
dashboard.noInvestments = No active investments
dashboard.startInvesting = Start Investing
dashboard.daysLeft = days left
dashboard.daysCompleted = days completed
dashboard.viewAll = View All

plans.title = Investment Plans
plans.subtitle = Choose the plan that suits your investment goals
plans.minCapital = Min Capital
plans.maxCapital = Max Capital
plans.dailyReturn = Daily Return
plans.duration = Duration
plans.days = days
plans.invest = Invest Now
plans.selectPlan = Select Plan
plans.investAmount = Investment Amount
plans.estimatedProfit = Estimated Profit
plans.totalReturn = Total Return
plans.startDate = Start Date
plans.endDate = End Date
plans.confirmInvestment = Confirm Investment
plans.investmentSummary = Investment Summary
plans.availableBalance = Available Balance
plans.insufficientBalance = Insufficient Balance
plans.minAmount = Minimum amount
plans.maxAmount = Maximum amount
plans.investmentSuccess = Investment created successfully!

deposit.title = Deposit Funds
deposit.subtitle = Send crypto to the address below to fund your account
deposit.selectAddress = Select Deposit Address
deposit.copyAddress = Copy Address
deposit.copied = Copied!
deposit.network = Network
deposit.address = Deposit Address
deposit.warning = Only send the selected cryptocurrency to this address. Sending other assets may result in permanent loss.
deposit.amount = Amount (USD)
deposit.submitDeposit = Submit Deposit Request
deposit.depositSuccess = Deposit request submitted! Awaiting admin approval.

withdraw.title = Withdraw Funds
withdraw.subtitle = Request a withdrawal from your account
withdraw.amount = Withdrawal Amount
withdraw.availableBalance = Available Balance
withdraw.confirm = Confirm Withdrawal
withdraw.cancel = Cancel
withdraw.insufficientBalance = Insufficient balance
withdraw.success = Withdrawal request submitted! Awaiting admin approval.
withdraw.minimumAmount = Minimum withdrawal: $10

transactions.title = Transaction History
transactions.subtitle = View all your deposits and withdrawals
transactions.type = Type
transactions.amount = Amount
transactions.date = Date
transactions.status = Status
transactions.network = Network
transactions.deposit = Deposit
transactions.withdrawal = Withdrawal
transactions.pending = Pending
transactions.approved = Approved
transactions.rejected = Rejected
transactions.noTransactions = No transactions yet
transactions.all = All
transactions.deposits = Deposits
transactions.withdrawals = Withdrawals

settings.title = Settings
settings.subtitle = Manage your account settings
settings.personalInfo = Personal Information
settings.firstName = First Name
settings.lastName = Last Name
settings.email = Email Address
settings.cryptoInfo = Crypto Information
settings.cryptoAddress = Crypto Address
settings.cryptoNetwork = Network
settings.cryptoName = Crypto Name
settings.saveChanges = Save Changes
settings.saved = Settings saved successfully!
settings.language = Language
settings.selectLanguage = Select Language

chat.title = Chat with Admin
chat.subtitle = Send a message to our support team
chat.placeholder = Type your message...
chat.send = Send
chat.noMessages = No messages yet. Start a conversation!
chat.admin = Admin

admin.title = Admin Dashboard
admin.users = Users
admin.plans = Plans
admin.investments = Investments
admin.deposits = Deposits
admin.withdrawals = Withdrawals
admin.transactions = Transactions
admin.chats = Chats
admin.languages = Languages
admin.overview = Overview
admin.totalUsers = Total Users
admin.activeInvestments = Active Investments
admin.pendingDeposits = Pending Deposits
admin.pendingWithdrawals = Pending Withdrawals
admin.totalRevenue = Total Revenue
admin.manageUsers = Manage Users
admin.managePlans = Manage Plans
admin.manageLanguages = Manage Languages
admin.createUser = Create User
admin.editUser = Edit User
admin.blockUser = Block User
admin.unblockUser = Unblock User
admin.deleteUser = Delete User
admin.createPlan = Create Plan
admin.editPlan = Edit Plan
admin.deletePlan = Delete Plan
admin.editInvestment = Edit Investment
admin.approve = Approve
admin.reject = Reject
admin.action = Action
admin.confirmDelete = Are you sure you want to delete this?
admin.sendToUser = Send to user
admin.selectUser = Select user
admin.createLanguage = Create Language
admin.editLanguage = Edit Language
admin.deleteLanguage = Delete Language
admin.languageCode = Language Code
admin.languageName = Language Name
admin.nativeName = Native Name

common.loading = Loading...
common.error = An error occurred
common.save = Save
common.cancel = Cancel
common.delete = Delete
common.edit = Edit
common.create = Create
common.close = Close
common.back = Back
common.next = Next
common.search = Search...
common.noResults = No results found
common.confirm = Confirm
common.usd = USD
common.days = days
common.active = Active
common.completed = Completed
common.blocked = Blocked
```

The Spanish (`es-ES`) file must contain full translations of all the same keys. A reference Spanish translation is included in the Existing codebase notes section below — use it as the source of truth for `es-ES`.

---

## 5. Routing & Access Control

### Public
- Landing page at root.

### Auth
- `/auth` (or equivalent) — login/signup.
- Redirect already-authenticated users away from auth to their dashboard.
- After login:
  - admin → admin home
  - user → user dashboard

### User area
- Dashboard home, plans, transactions, settings.
- All user-area routes require an authenticated user; unauthenticated → auth.

### Admin area
- Admin home, users, plans, investments, transactions, chats, languages.
- All admin routes require authenticated admin; non-admin or unauthenticated → auth (or user dashboard for authenticated non-admins, your choice, but must block admin access).

---

## 6. State & Persistence

- The app must persist auth session and all CRUD data across reloads.
- In this product, there is no real backend required for the MVP — use the browser's persistence layer (localStorage / indexedDB / cookies + server session if you prefer a real backend). Whatever you choose, the behaviors below must hold:
  - Sign up creates a user and logs them in.
  - Login validates email + password + active status.
  - Logout clears session.
  - Plan/investment/transaction/chat/language CRUD persists.
  - Admin changes (user block, transaction approve/reject, plan create/edit/delete, language toggle) are visible everywhere immediately.

### Seed data
Include realistic seed data so the app is not empty on first load:
- 1 admin user (admin@portbuff.com / admin123).
- Several regular users (john@example.com / user123, jane@example.com / user123, etc.) with varying balances, invested amounts, profits, crypto addresses, and one blocked user.
- 3 investment plans: Starter ($100–$1,000, 2.5% daily, 4 days), Professional ($1,000–$10,000, 3.5% daily, 4 days), Premium ($10,000–$50,000, 5.0% daily, 4 days) — with descriptive names, colors, and emoji icons.
- Sample investments, transactions (approved/pending/rejected), chat messages, and deposit addresses (USDT on Ethereum/BSC/Tron, USDC on Ethereum, BTC on Bitcoin).
- Pre-seed the two built-in languages (en-US enabled, es-ES enabled) with their translation maps.

---

## 7. Visual & UX Direction

- Theme: dark navy primary, gold/amber accent, clean neutral surfaces, strong contrast for readability.
- Typography: clear hierarchy, tight headlines, restrained body text.
- Components: rounded-2xl cards, subtle borders, soft shadows, hover lift on interactive cards.
- Motion: entrance animations on page load, scroll-triggered reveals for sections, small hover/tap micro-interactions on buttons and cards. Keep it tasteful — not bouncy.
- Charts: clean area/pie/bar charts with readable tooltips.
- Tables: striped hover states, status badges (success/warning/danger).
- Forms: clear labels, focus rings, inline validation feedback, disabled states when actions are unavailable.
- Mobile: fully responsive; collapsible sidebar/nav for small screens.

---

## 8. Framework-Agnostic Build Instructions

An agent may choose any of these paths; the spec above is the contract either way.

### Option A — Keep the existing stack
- React 18 + Vite + TypeScript + Tailwind CSS + React Router + Zustand + react-i18next + Recharts + Framer Motion + Lucide icons.
- Build output must be static deployable artifacts (HTML + JS + CSS) in a `dist/` (or equivalent) folder.
- Build command must exit after producing static output — it must not start a dev server.

### Option B — Next.js
- Use the App Router or Pages Router consistently.
- Serve the landing page at the root route, auth at `/auth`, user dashboard under `/dashboard/*`, admin under `/admin/*`.
- Use the framework's routing/layout patterns for protected routes.
- Persist the same data model to localStorage (client) or a small API route / in-memory store if you want server-side; the behaviors in Section 6 must hold.
- Output must still be deployable as static/SSR assets — no long-running server process beyond what the hosting platform expects.

### Option C — Astro
- Use Astro pages/routes for the landing page and auth shell.
- Use a UI framework integration (React or Preact or Svelte) for the interactive app sections.
- Persist data per Section 6.
- Build output must be static artifacts in `dist/` (or `build/`), and the build command must exit.

### General rules for any framework
- All UI copy through the i18n system, including the landing page.
- Do not hardcode the English strings in components — pull them from translation resources.
- Keep the same routing structure and access-control semantics.
- Keep the same data model and seed data.
- Keep the same visual intent (navy + gold, premium investment feel, data-dense dashboard/admin).

---

## 9. Existing Codebase Notes (for reference only)

The current repository already contains a complete implementation of the above using Option A (React + Vite + Tailwind 3 + React Router 6 + Zustand + react-i18next + Recharts + Framer Motion + Lucide). An agent may read these files to understand conventions, but is not required to use them.

Key existing files and what they contain:
- `src/App.tsx` — router layout: landing at `/`, auth at `/auth`, user area under `/dashboard/*` wrapped in `UserLayout`, admin area under `/admin/*` wrapped in `AdminLayout`, with `ProtectedRoute` and `AdminRoute` guards.
- `src/i18n/index.ts` — i18next setup: en-US + es-ES static imports, browser language auto-detection, localStorage persistence of manual choice, `registerTranslations` for runtime custom languages, `changeLanguage`, `enableAutoDetect`, `isAutoDetectEnabled`, `getBrowserLanguages`.
- `src/i18n/locales/en-US.json` — full English translation (all namespaces including `landing.*`).
- `src/i18n/locales/es-ES.json` — full Spanish translation.
- `src/i18n/locales/defaultTranslations.ts` — `defaultTranslations` const: every key above nested by namespace, used as the translation source of truth and the editor's fallback.
- `src/stores/useStore.ts` — Zustand store: auth (login/signup/logout/updateProfile), plans CRUD, investments CRUD, transactions CRUD, chat messages, deposit addresses CRUD, languages CRUD + `updateLanguageTranslations`, user management (updateUser/deleteUser/addUser). Loads/saves everything from localStorage under `portbuff-*` keys.
- `src/types/index.ts` — TypeScript interfaces for all entities.
- `src/mock/data.ts` — seed data: mockUsers, mockPlans, mockInvestments, mockTransactions, mockChatMessages, mockDepositAddresses, defaultLanguages, plus `generatePortfolioChartData`/`generateProfitChartData`.
- `src/utils/helpers.ts` — `formatCurrency`, `formatDate`, `formatDateTime`, `generateId`, `calculateProfit`, `cn`.
- `src/pages/LandingPage.tsx` — full landing page: LandingNavbar, Hero, Features, Plans, DashboardPreview, CTA, LandingFooter. All strings via `useTranslation` under `landing.*`.
- `src/pages/Dashboard.tsx` — user dashboard with stat cards, portfolio area chart, pie chart, profit trend chart, active investments list, recent transactions table.
- `src/pages/Plans.tsx` — plans grid + invest modal + confirmation modal.
- `src/pages/AuthPage.tsx` — sign in / sign up with demo credentials.
- `src/pages/Transactions.tsx` — user transactions table.
- `src/pages/Settings.tsx` — personal + crypto settings + language selection.
- `src/components/ChatPopup.tsx` — floating chat widget user → admin.
- `src/components/TranslationEditor.tsx` — admin translation editor with search, fill/reset/export/import, save to i18next.
- `src/components/layout/UserLayout.tsx` — user sidebar (desktop + mobile) + Outlet + chat FAB.
- `src/components/layout/AdminLayout.tsx` — admin sidebar (desktop + mobile) + Outlet.
- `src/pages/admin/AdminDashboard.tsx`, `AdminUsers.tsx`, `AdminPlans.tsx`, `AdminInvestments.tsx`, `AdminTransactions.tsx`, `AdminChats.tsx`, `AdminLanguages.tsx` — admin pages.
- `src/index.css` — Tailwind with custom `surface`/`primary`/`accent` color tokens, component classes (btn-primary, btn-secondary, btn-accent, btn-danger, card, card-hover, input-field, modal-overlay, modal-content, sidebar-link, sidebar-link-active, stat-card, badges), custom scrollbar.
- `tailwind.config.js`, `postcss.config.js`, `vite.config.ts`, `tsconfig.json`, `package.json` — existing config. Note: `package.json` build script is `node node_modules/vite/bin/vite.js build` and the project ships a `package-lock.json` (npm, lockfileVersion 3) so deploy install works.

Demo credentials for manual testing:
- Admin: `admin@portbuff.com` / `admin123`
- User: `john@example.com` / `user123`

---

## 10. Acceptance Criteria (verify before calling done)

1. Landing page at root explains the product in the first viewport and has clear Log In / Sign Up CTAs.
2. All landing sections present and populated from i18n (including `landing.*`).
3. Language switcher works on the landing page and in the app; switching persists and updates `<html lang>`.
4. Auth sign-in/sign-up work, persist, and redirect correctly by role.
5. Authenticated users can reach dashboard, plans, transactions, settings, chat.
6. Non-authenticated visitors cannot reach protected routes.
7. Admins can reach admin panel; non-admins cannot.
8. Plans can be created/edited/deleted (admin); investments can be created from plans (user) with validation and confirmation.
9. Deposits/withdrawals can be submitted (user) and approved/rejected (admin); approving a deposit credits balance + total invested.
10. Admin users CRUD works: create, edit, block/unblock, delete.
11. Chat works both ways: user→admin and admin→user, with read marking.
12. Languages admin works: create/edit/delete custom languages, enable/disable, and the translation editor can search, fill, reset, export, import, and save translations that take effect immediately.
13. Both `en-US` and `es-ES` are fully translated for all keys listed in Section 4.
14. Build command completes and produces deployable static output.
15. App is responsive and looks polished on mobile and desktop.

---

## 11. Implementation Order (suggested)

1. Scaffold the chosen framework + i18n + Tailwind (or equivalent styling system).
2. Create the translation files with the full key inventory (en-US + es-ES) + defaultTranslations source.
3. Build the landing page (all sections, i18n, responsive, motion).
4. Build auth (login/signup, session persistence, role-based redirect).
5. Build the data store / persistence layer and seed data.
6. Build the user dashboard, plans, transactions, settings, chat.
7. Build the admin panel (dashboard, users, plans, investments, transactions, chats, languages).
8. Build the translation editor.
9. Wire protected/admin routes and access control.
10. Polish UI, verify responsive behavior, verify i18n switching end to end.
11. Configure build command → static output → deployable.

---

## 12. Notes for the Agent

- You do not need to copy this codebase verbatim. You need to satisfy the product requirements in Sections 2–4 and the acceptance criteria in Section 10.
- If you choose a different framework, translate the architecture accordingly but keep the same routes, data model, seed data, i18n structure, and access-control semantics.
- The `landing.*` keys are required — the landing page is not optional and must be fully internationalized.
- The translation editor and runtime custom-language registration are part of the product, not a nice-to-have.
- Keep the visual identity consistent: navy + gold/amber, premium investment feel, clean data UI.
