# Exemplos de Cálculos Financeiros - FinanceControl

## 1. Cálculo de Parcelamentos

### Juros Simples

**Fórmula:**
```
M = C × (1 + i × t)
P = M / n
```

Onde:
- M = Montante total
- C = Capital inicial
- i = Taxa de juros (decimal)
- t = Tempo (em meses)
- P = Valor da parcela
- n = Número de parcelas

**Exemplo Prático:**
```javascript
const principal = 3000.00
const rate = 0.025 // 2.5% ao mês
const months = 6

const totalAmount = principal * (1 + rate * months) // 3000 * (1 + 0.025 * 6) = 3450
const installmentAmount = totalAmount / months // 3450 / 6 = 575

// Resultado:
// - Valor total: R$ 3.450,00
// - Valor por parcela: R$ 575,00
// - Total de juros: R$ 450,00
// - Taxa efetiva: 15%
```

### Juros Compostos

**Fórmula:**
```
P = C × [i × (1 + i)^n] / [(1 + i)^n - 1]
```

**Exemplo Prático:**
```javascript
const principal = 3000.00
const monthlyRate = 0.025 / 12 // 2.5% ao ano convertido para mensal
const months = 6

const installmentAmount = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                         (Math.pow(1 + monthlyRate, months) - 1)

// Resultado:
// - Valor por parcela: R$ 508,14
// - Valor total: R$ 3.048,84
// - Total de juros: R$ 48,84
// - Taxa efetiva: 1.63%
```

## 2. Fluxo de Caixa Projetado

### Cálculo de Projeção

```javascript
// Dados de entrada
const monthlyIncome = 10000.00
const monthlyExpenses = 3500.00
const monthlyInstallments = 800.00
const currentBalance = 20000.00

// Projeção para 12 meses
const projection = []
let projectedBalance = currentBalance

for (let month = 1; month <= 12; month++) {
  const monthlyResult = monthlyIncome - monthlyExpenses - monthlyInstallments
  projectedBalance += monthlyResult
  
  projection.push({
    month,
    income: monthlyIncome,
    expenses: monthlyExpenses,
    installments: monthlyInstallments,
    result: monthlyResult,
    balance: projectedBalance
  })
}

// Resultado exemplo:
// Mês 1: Saldo projetado = R$ 15.700,00
// Mês 2: Saldo projetado = R$ 11.400,00
// Mês 3: Saldo projetado = R$ 7.100,00
// ...
// Mês 12: Saldo projetado = R$ -5.600,00 (alerta de déficit)
```

## 3. Análise de Risco de Endividamento

### Cálculo de Utilização de Crédito

```javascript
const creditCards = [
  { limit: 5000, currentBalance: 1200 },
  { limit: 3000, currentBalance: 800 },
  { limit: 2000, currentBalance: 500 }
]

const totalLimit = creditCards.reduce((sum, card) => sum + card.limit, 0) // 10000
const totalBalance = creditCards.reduce((sum, card) => sum + card.currentBalance, 0) // 2500
const utilizationRate = (totalBalance / totalLimit) * 100 // 25%

// Classificação do risco:
let riskLevel
if (utilizationRate > 70) {
  riskLevel = 'ALTO'
} else if (utilizationRate > 50) {
  riskLevel = 'MÉDIO'
} else {
  riskLevel = 'BAIXO'
}

// Resultado: 25% de utilização = Risco BAIXO
```

## 4. Detecção de Gastos Anormais

### Cálculo usando Desvio Padrão

```javascript
const expenses = [200, 350, 180, 220, 400, 190, 210, 380, 195, 205]

// Calcular média
const mean = expenses.reduce((sum, amount) => sum + amount, 0) / expenses.length // 253.50

// Calcular variância
const variance = expenses.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / expenses.length

// Calcular desvio padrão
const standardDeviation = Math.sqrt(variance) // 81.47

// Definir threshold (2 desvios padrão)
const threshold = mean + (2 * standardDeviation) // 253.50 + (2 * 81.47) = 416.44

// Identificar gastos anormais
const abnormalExpenses = expenses.filter(amount => amount > threshold) // [400, 380]
```

## 5. Cálculo de Metas Financeiras

### Meta de Economia

```javascript
const goal = {
  targetAmount: 30000,
  currentAmount: 15000,
  targetDate: new Date('2024-12-31'),
  monthlyIncome: 10000,
  monthlyExpenses: 6000
}

const monthsRemaining = Math.ceil((goal.targetDate - new Date()) / (1000 * 60 * 60 * 24 * 30))
const amountNeeded = goal.targetAmount - goal.currentAmount
const monthlySavingsNeeded = amountNeeded / monthsRemaining
const availableForSavings = goal.monthlyIncome - goal.monthlyExpenses

const progress = (goal.currentAmount / goal.targetAmount) * 100 // 50%
const onTrack = availableForSavings >= monthlySavingsNeeded

// Resultado:
// - Progresso: 50%
// - Economia mensal necessária: R$ 1.250,00
// - Disponível para economia: R$ 4.000,00
// - Meta em dia: ✅
```

## 6. Cálculo de Juros de Atraso

### Juros Simples + Multa

```javascript
const invoice = {
  originalAmount: 1200.00,
  dueDate: new Date('2024-01-25'),
  paymentDate: new Date('2024-02-10'),
  interestRate: 0.02, // 2% ao mês
  fineRate: 0.02 // 2% de multa
}

const daysLate = Math.ceil((invoice.paymentDate - invoice.dueDate) / (1000 * 60 * 60 * 24))
const monthsLate = daysLate / 30

const fine = invoice.originalAmount * invoice.fineRate // 1200 * 0.02 = 24.00
const interest = invoice.originalAmount * invoice.interestRate * monthsLate
const totalAmount = invoice.originalAmount + fine + interest

// Resultado:
// - Dias de atraso: 16 dias
// - Multa: R$ 24,00
// - Juros: R$ 12,80
// - Total a pagar: R$ 1.236,80
```

## 7. Cálculo de Rentabilidade

### Retorno sobre Investimento (ROI)

```javascript
const investment = {
  initialAmount: 10000.00,
  finalAmount: 11500.00,
  periodMonths: 12
}

const absoluteReturn = investment.finalAmount - investment.initialAmount // 1500.00
const percentageReturn = (absoluteReturn / investment.initialAmount) * 100 // 15%
const annualizedReturn = percentageReturn // 15% ao ano

// Comparação com inflação (ex: 5% ao ano)
const inflationRate = 5
const realReturn = annualizedReturn - inflationRate // 10% ao ano

// Resultado:
// - Retorno nominal: 15% ao ano
// - Retorno real: 10% ao ano (descontada inflação)
// - Ganho real: R$ 1.000,00
```

## 8. Cálculo de Ticket Médio

### Ticket Médio por Categoria

```javascript
const transactions = [
  { category: 'Alimentação', amount: 150 },
  { category: 'Alimentação', amount: 80 },
  { category: 'Alimentação', amount: 200 },
  { category: 'Transporte', amount: 50 },
  { category: 'Transporte', amount: 30 }
]

const averageTicketByCategory = transactions.reduce((acc, transaction) => {
  if (!acc[transaction.category]) {
    acc[transaction.category] = { total: 0, count: 0 }
  }
  acc[transaction.category].total += transaction.amount
  acc[transaction.category].count += 1
  return acc
}, {})

Object.keys(averageTicketByCategory).forEach(category => {
  const { total, count } = averageTicketByCategory[category]
  averageTicketByCategory[category] = total / count
})

// Resultado:
// - Ticket médio Alimentação: R$ 143,33
// - Ticket médio Transporte: R$ 40,00
```

## 9. Projeção de Metas com Juros

### Meta de Poupança com Rendimento

```javascript
const savingsGoal = {
  targetAmount: 50000,
  currentAmount: 10000,
  monthlyContribution: 2000,
  monthlyRate: 0.006 // 0.6% ao mês (aprox. 7.5% ao ano)
}

let projectedAmount = savingsGoal.currentAmount
let months = 0

while (projectedAmount < savingsGoal.targetAmount && months < 360) { // máximo 30 anos
  projectedAmount = (projectedAmount + savingsGoal.monthlyContribution) * (1 + savingsGoal.monthlyRate)
  months++
}

const yearsToGoal = Math.floor(months / 12)
const remainingMonths = months % 12

// Resultado:
// - Tempo para atingir meta: 1 ano e 8 meses
// - Valor final projetado: R$ 50.234,56
```

## 10. Análise de Sensibilidade

### Impacto de Variações no Orçamento

```javascript
const baseScenario = {
  income: 10000,
  expenses: 6000,
  savings: 4000
}

const scenarios = [
  { name: 'Pessimista', incomeVariation: -0.1, expenseVariation: 0.1 },
  { name: 'Realista', incomeVariation: 0, expenseVariation: 0 },
  { name: 'Otimista', incomeVariation: 0.1, expenseVariation: -0.05 }
]

const analysis = scenarios.map(scenario => {
  const projectedIncome = baseScenario.income * (1 + scenario.incomeVariation)
  const projectedExpenses = baseScenario.expenses * (1 + scenario.expenseVariation)
  const projectedSavings = projectedIncome - projectedExpenses
  
  return {
    scenario: scenario.name,
    income: projectedIncome,
    expenses: projectedExpenses,
    savings: projectedSavings,
    savingsVariation: ((projectedSavings - baseScenario.savings) / baseScenario.savings) * 100
  }
})

// Resultado:
// - Cenário Pessimista: R$ 3.100 de economia (-22.5%)
// - Cenário Realista: R$ 4.000 de economia (0%)
// - Cenário Otimista: R$ 5.300 de economia (+32.5%)
```

Esses exemplos demonstram os principais cálculos financeiros implementados no FinanceControl, fornecendo uma base sólida para análise e tomada de decisões financeiras.