# FinanceControl - Sistema de Gerenciamento Financeiro

## Visão Geral

O FinanceControl é um sistema completo de gerenciamento financeiro pessoal e empresarial desenvolvido com Next.js 15, TypeScript, Prisma e SQLite. O sistema oferece controle total sobre receitas, despesas, cartões de crédito, parcelamentos, metas financeiras e relatórios avançados.

## 🚀 Funcionalidades

### 💰 Transações Financeiras
- **CRUD completo** de receitas e despesas
- **Categorização** automática e personalizada
- **Upload de recibos** e anexos
- **Transações recorrentes** com automação
- **Filtros avançados** por período, categoria, conta

### 🏦 Contas Bancárias
- **Múltiplos tipos**: Conta corrente, poupança, investimento, carteira
- **Saldo em tempo real**
- **Sincronização automática** com transações
- **Histórico completo** de movimentações

### 💳 Cartões de Crédito
- **Cadastro ilimitado** de cartões
- **Controle de limites** e saldos
- **Configuração** de datas de fechamento e vencimento
- **Visão geral** de todos os cartões

### 📊 Parcelamentos
- **Cálculo automático** de parcelas
- **Suporte a juros simples** e compostos
- **Projeção de parcelas** futuras
- **Integração automática** com faturas
- **Recálculo** em caso de antecipação

### 📄 Faturas
- **Geração automática** mensal
- **Acompanhamento** de status (aberta, fechada, paga, atrasada)
- **Integração** com parcelamentos
- **Relatórios detalhados** por fatura

### 📈 Dashboard Analítico
- **KPIs em tempo real**: saldo total, receitas, despesas
- **Gráficos interativos** de evolução mensal
- **Análise por categoria**
- **Projeções financeiras**
- **Alertas e notificações**

### 🎯 Metas Financeiras
- **Metas de economia** personalizados
- **Limites de gastos** por categoria
- **Metas de quitação** de dívidas
- **Acompanhamento** de progresso
- **Alertas automáticos**

### 📋 Relatórios
- **Exportação em PDF**, Excel e CSV
- **Extratos por período**
- **Análise de despesas** por categoria
- **Relatórios de faturas**
- **Projeções anuais**

### 🔔 Notificações
- **Alertas de vencimento** de faturas
- **Avisos de metas** atingidas
- **Notificações de gastos** anormais
- **Lembretes personalizados**

## 🏗️ Arquitetura

### Frontend
- **Next.js 15** com App Router
- **TypeScript 5** para tipagem segura
- **Tailwind CSS** para estilização
- **Shadcn/ui** para componentes UI
- **React Hook Form** para formulários
- **Zod** para validação
- **Recharts** para gráficos
- **Zustand** para estado global

### Backend
- **API Routes** do Next.js
- **Prisma ORM** para banco de dados
- **SQLite** para persistência
- **Zod** para validação de dados
- **TypeScript** para type safety

### Banco de Dados
- **SQLite** para desenvolvimento
- **Prisma Migrations** para versionamento
- **Relacionamentos complexos** entre entidades
- **Seed automático** para dados iniciais

## 📁 Estrutura do Projeto

```
finance-control/
├── src/
│   ├── app/
│   │   ├── api/                    # API Routes
│   │   │   ├── accounts/           # Contas bancárias
│   │   │   ├── categories/         # Categorias
│   │   │   ├── credit-cards/       # Cartões de crédito
│   │   │   ├── dashboard/          # Dashboard analytics
│   │   │   ├── financial-calculations/ # Cálculos financeiros
│   │   │   ├── goals/              # Metas financeiras
│   │   │   ├── installments/       # Parcelamentos
│   │   │   ├── invoices/           # Faturas
│   │   │   └── transactions/       # Transações
│   │   ├── globals.css             # Estilos globais
│   │   ├── layout.tsx              # Layout principal
│   │   └── page.tsx                # Dashboard
│   ├── components/
│   │   └── ui/                     # Componentes UI (shadcn/ui)
│   ├── lib/
│   │   ├── db.ts                   # Configuração Prisma
│   │   └── utils.ts                # Utilitários
│   └── hooks/                      # Hooks personalizados
├── prisma/
│   ├── schema.prisma               # Schema do banco
│   └── seed.ts                     # Dados iniciais
├── public/                         # Arquivos estáticos
└── docs/                          # Documentação
```

## 🗄️ Modelo de Dados

### Entidades Principais

#### User
- Informações do usuário
- Relacionamento com todas as entidades

#### Account
- Contas bancárias (corrente, poupança, investimento, carteira)
- Saldo e informações bancárias

#### Category
- Categorias de receitas e despesas
- Suporte a hierarquia (subcategorias)

#### Transaction
- Transações financeiras
- Relacionamento com contas, categorias, cartões

#### CreditCard
- Cartões de crédito
- Limites, datas de fechamento/vencimento

#### Installment
- Parcelamentos de compras
- Cálculo de juros, vencimentos

#### Invoice
- Faturas de cartões de crédito
- Status e histórico

#### Goal
- Metas financeiras
- Progresso e alertas

#### Notification
- Sistema de notificações
- Alertas personalizados

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Passos para instalação

1. **Clonar o repositório**
   ```bash
   git clone <repository-url>
   cd finance-control
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Editar .env com suas configurações
   ```

4. **Configurar banco de dados**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Iniciar aplicação**
   ```bash
   npm run dev
   ```

## 📊 APIs Disponíveis

### Transações
- `GET /api/transactions` - Listar transações
- `POST /api/transactions` - Criar transação
- `PUT /api/transactions/:id` - Atualizar transação
- `DELETE /api/transactions/:id` - Excluir transação

### Contas
- `GET /api/accounts` - Listar contas
- `POST /api/accounts` - Criar conta
- `PUT /api/accounts/:id` - Atualizar conta
- `DELETE /api/accounts/:id` - Excluir conta

### Cartões de Crédito
- `GET /api/credit-cards` - Listar cartões
- `POST /api/credit-cards` - Criar cartão
- `PUT /api/credit-cards/:id` - Atualizar cartão
- `DELETE /api/credit-cards/:id` - Excluir cartão

### Cálculos Financeiros
- `POST /api/financial-calculations` - Calcular parcelamentos
- `GET /api/financial-calculations` - Análise financeira avançada

### Dashboard
- `GET /api/dashboard` - Dados do dashboard

## 🧮 Cálculos Financeiros

### Cálculo de Parcelas
```typescript
// Juros Simples
parcela = (principal + (principal * taxa * prazo/12)) / parcelas

// Juros Compostos
parcela = principal * (taxaMensal * (1 + taxaMensal)^parcelas) / ((1 + taxaMensal)^parcelas - 1)
```

### Análise de Risco
- **Utilização de crédito**: Saldo / Limite
- **Nível de risco**: 
  - Baixo: < 50%
  - Médio: 50-70%
  - Alto: > 70%

### Detecção de Anomalias
- **Média e desvio padrão** dos gastos
- **Alerta** para gastos > 2 desvios padrão

## 📈 Relatórios

### Tipos de Relatórios
1. **Extrato por Período**
   - Todas as transações filtradas por data
   - Totais por categoria

2. **Análise de Despesas**
   - Gráficos por categoria
   - Comparativos mensais

3. **Relatório de Faturas**
   - Histórico de faturas
   - Status e pagamentos

4. **Projeção Anual**
   - Previsão de saldo
   - Metas projetadas

### Exportação
- **PDF**: Formato otimizado para impressão
- **Excel**: Planilha com dados detalhados
- **CSV**: Formato aberto para integração

## 🔐 Segurança

### Validação de Dados
- **Zod schemas** para validação rigorosa
- **TypeScript** para type safety
- **Sanitização** de inputs

### Autenticação
- **NextAuth.js** para autenticação
- **JWT tokens** para sessões
- **Proteção** de rotas sensíveis

## 🚀 Deploy

### Produção
```bash
npm run build
npm start
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 Licença

MIT License - Ver arquivo LICENSE para detalhes

## 🤝 Contribuição

1. Fork do projeto
2. Feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push (`git push origin feature/nova-funcionalidade`)
5. Pull Request

## 📞 Suporte

- **Email**: support@financecontrol.com
- **Documentação**: [docs.financecontrol.com](https://docs.financecontrol.com)
- **Issues**: [GitHub Issues](https://github.com/financecontrol/issues)

---

**FinanceControl** - Seu controle financeiro completo e inteligente 🚀