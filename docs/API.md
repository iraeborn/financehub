# API Documentation - FinanceControl

## Overview

Esta documentação descreve todos os endpoints da API do FinanceControl, com exemplos de requests e responses.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Atualmente, a API usa um userId simples para identificação. Em produção, será implementado JWT.

## Endpoints

### 1. Dashboard

#### GET /api/dashboard

Retorna dados analíticos para o dashboard principal.

**Query Parameters:**
- `userId` (string, required): ID do usuário

**Request:**
```bash
GET /api/dashboard?userId=user-1
```

**Response:**
```json
{
  "monthlySummary": {
    "income": 10000.00,
    "expense": 2950.00,
    "balance": 7050.00
  },
  "totalBalance": 20500.00,
  "totalCreditLimit": 8000.00,
  "openInvoices": 1,
  "activeGoals": 3,
  "futureInstallments": 2,
  "unreadNotifications": 2,
  "monthlyEvolution": [
    {
      "month": "ago/2024",
      "income": 8500.00,
      "expense": 3200.00,
      "balance": 5300.00
    },
    {
      "month": "set/2024",
      "income": 9200.00,
      "expense": 2800.00,
      "balance": 6400.00
    }
  ],
  "expensesByCategory": [
    {
      "categoryId": "cat-4",
      "amount": 2000.00
    },
    {
      "categoryId": "cat-5",
      "amount": 450.00
    }
  ]
}
```

### 2. Transações

#### GET /api/transactions

Lista todas as transações do usuário.

**Query Parameters:**
- `userId` (string, required): ID do usuário
- `type` (string, optional): 'income' ou 'expense'
- `categoryId` (string, optional): ID da categoria
- `accountId` (string, optional): ID da conta
- `startDate` (string, optional): Data inicial (YYYY-MM-DD)
- `endDate` (string, optional): Data final (YYYY-MM-DD)

**Request:**
```bash
GET /api/transactions?userId=user-1&type=expense&startDate=2024-01-01&endDate=2024-01-31
```

**Response:**
```json
[
  {
    "id": "cmiheg6kf0003uic69uqiztw7",
    "description": "Aluguel",
    "amount": 2000.00,
    "type": "expense",
    "date": "2024-01-10T00:00:00.000Z",
    "accountId": "acc-1",
    "categoryId": "cat-4",
    "creditCardId": null,
    "installmentId": null,
    "receipt": null,
    "notes": null,
    "isRecurring": false,
    "recurringInterval": null,
    "createdAt": "2025-11-27T12:18:06.784Z",
    "updatedAt": "2025-11-27T12:18:06.784Z",
    "userId": "user-1",
    "account": {
      "id": "acc-1",
      "name": "Conta Corrente",
      "type": "checking"
    },
    "category": {
      "id": "cat-4",
      "name": "Moradia",
      "type": "expense",
      "color": "#ef4444"
    }
  }
]
```

#### POST /api/transactions

Cria uma nova transação.

**Request Body:**
```json
{
  "userId": "user-1",
  "description": "Compra no supermercado",
  "amount": 150.50,
  "type": "expense",
  "date": "2024-01-20",
  "accountId": "acc-1",
  "categoryId": "cat-5",
  "creditCardId": "card-1",
  "notes": "Compras mensais",
  "isRecurring": false
}
```

**Response:**
```json
{
  "id": "new-transaction-id",
  "description": "Compra no supermercado",
  "amount": 150.50,
  "type": "expense",
  "date": "2024-01-20T00:00:00.000Z",
  "accountId": "acc-1",
  "categoryId": "cat-5",
  "creditCardId": "card-1",
  "userId": "user-1",
  "account": {
    "id": "acc-1",
    "name": "Conta Corrente",
    "type": "checking"
  },
  "category": {
    "id": "cat-5",
    "name": "Alimentação",
    "type": "expense",
    "color": "#f59e0b"
  },
  "createdAt": "2025-11-27T12:30:00.000Z",
  "updatedAt": "2025-11-27T12:30:00.000Z"
}
```

### 3. Contas

#### GET /api/accounts

Lista todas as contas do usuário.

**Query Parameters:**
- `userId` (string, required): ID do usuário

**Request:**
```bash
GET /api/accounts?userId=user-1
```

**Response:**
```json
[
  {
    "id": "acc-1",
    "name": "Conta Corrente",
    "type": "checking",
    "balance": 5000.00,
    "bank": "Banco do Brasil",
    "agency": "1234",
    "account": "56789-0",
    "description": "Conta principal",
    "isActive": true,
    "userId": "user-1",
    "createdAt": "2025-11-27T12:18:06.759Z",
    "updatedAt": "2025-11-27T12:18:06.759Z"
  },
  {
    "id": "acc-2",
    "name": "Poupança",
    "type": "savings",
    "balance": 15000.00,
    "bank": "Caixa Econômica",
    "agency": "4321",
    "account": "98765-4",
    "description": "Poupança para emergências",
    "isActive": true,
    "userId": "user-1",
    "createdAt": "2025-11-27T12:18:06.759Z",
    "updatedAt": "2025-11-27T12:18:06.759Z"
  }
]
```

#### POST /api/accounts

Cria uma nova conta.

**Request Body:**
```json
{
  "userId": "user-1",
  "name": "Conta Digital",
  "type": "checking",
  "balance": 1000.00,
  "bank": "Nubank",
  "agency": "0001",
  "account": "1234567-8",
  "description": "Conta digital secundária"
}
```

**Response:**
```json
{
  "id": "new-account-id",
  "name": "Conta Digital",
  "type": "checking",
  "balance": 1000.00,
  "bank": "Nubank",
  "agency": "0001",
  "account": "1234567-8",
  "description": "Conta digital secundária",
  "isActive": true,
  "userId": "user-1",
  "createdAt": "2025-11-27T12:35:00.000Z",
  "updatedAt": "2025-11-27T12:35:00.000Z"
}
```

### 4. Cartões de Crédito

#### GET /api/credit-cards

Lista todos os cartões de crédito do usuário.

**Query Parameters:**
- `userId` (string, required): ID do usuário

**Request:**
```bash
GET /api/credit-cards?userId=user-1
```

**Response:**
```json
[
  {
    "id": "card-1",
    "name": "Visa Final 1234",
    "brand": "visa",
    "lastFourDigits": "1234",
    "limit": 5000.00,
    "currentBalance": 1200.00,
    "closingDay": 10,
    "dueDay": 25,
    "isActive": true,
    "description": "Cartão Visa principal",
    "userId": "user-1",
    "createdAt": "2025-11-27T12:18:06.780Z",
    "updatedAt": "2025-11-27T12:18:06.780Z"
  }
]
```

#### POST /api/credit-cards

Cria um novo cartão de crédito.

**Request Body:**
```json
{
  "userId": "user-1",
  "name": "Mastercard Final 9999",
  "brand": "mastercard",
  "lastFourDigits": "9999",
  "limit": 3000.00,
  "closingDay": 15,
  "dueDay": 5,
  "description": "Cartão Mastercard para compras online"
}
```

**Response:**
```json
{
  "id": "new-card-id",
  "name": "Mastercard Final 9999",
  "brand": "mastercard",
  "lastFourDigits": "9999",
  "limit": 3000.00,
  "currentBalance": 0.00,
  "closingDay": 15,
  "dueDay": 5,
  "isActive": true,
  "description": "Cartão Mastercard para compras online",
  "userId": "user-1",
  "createdAt": "2025-11-27T12:40:00.000Z",
  "updatedAt": "2025-11-27T12:40:00.000Z"
}
```

### 5. Cálculos Financeiros

#### GET /api/financial-calculations

Realiza análise financeira avançada.

**Query Parameters:**
- `userId` (string, required): ID do usuário

**Request:**
```bash
GET /api/financial-calculations?userId=user-1
```

**Response:**
```json
{
  "expensesByCategory": {
    "Moradia": 2000.00,
    "Alimentação": 450.00,
    "Transporte": 200.00,
    "Saúde": 300.00
  },
  "averageTicket": 487.50,
  "abnormalExpenses": [
    {
      "id": "trans-123",
      "description": "Compra emergencial",
      "amount": 2500.00,
      "date": "2024-01-15",
      "category": "Moradia"
    }
  ],
  "projectedMonthlyBalance": 4500.00,
  "projectedAnnualBalance": 54000.00,
  "debtRisk": {
    "level": "low",
    "creditUtilization": 25.0,
    "totalCreditLimit": 8000.00,
    "totalCreditBalance": 2000.00
  },
  "trends": {
    "incomeGrowthRate": 15.5,
    "monthlyIncome": 10000.00,
    "monthlyExpenses": 2950.00,
    "monthlyInstallments": 500.00
  },
  "goalsProgress": [
    {
      "id": "goal-1",
      "title": "Fundo de Emergência",
      "progress": 50.0,
      "targetDate": "2024-12-31",
      "type": "savings"
    }
  ]
}
```

#### POST /api/financial-calculations

Calcula parcelamentos.

**Request Body:**
```json
{
  "totalAmount": 3000.00,
  "totalInstallments": 6,
  "interestRate": 2.5,
  "interestType": "simple",
  "firstPaymentDate": "2024-02-01"
}
```

**Response:**
```json
{
  "installments": [
    {
      "number": 1,
      "amount": 512.50,
      "dueDate": "2024-02-01T00:00:00.000Z",
      "balance": 2562.50
    },
    {
      "number": 2,
      "amount": 512.50,
      "dueDate": "2024-03-01T00:00:00.000Z",
      "balance": 2050.00
    }
  ],
  "totalInterest": 75.00,
  "totalAmount": 3075.00,
  "effectiveRate": 2.5
}
```

### 6. Metas Financeiras

#### GET /api/goals

Lista todas as metas do usuário.

**Query Parameters:**
- `userId` (string, required): ID do usuário
- `type` (string, optional): 'savings', 'expense_limit', 'debt_reduction'
- `isActive` (boolean, optional): true/false

**Request:**
```bash
GET /api/goals?userId=user-1&isActive=true
```

**Response:**
```json
[
  {
    "id": "goal-1",
    "title": "Fundo de Emergência",
    "description": "Economizar 6 meses de despesas",
    "targetAmount": 30000.00,
    "currentAmount": 15000.00,
    "targetDate": "2024-12-31T00:00:00.000Z",
    "type": "savings",
    "category": null,
    "isActive": true,
    "userId": "user-1",
    "createdAt": "2025-11-27T12:18:06.790Z",
    "updatedAt": "2025-11-27T12:18:06.790Z"
  }
]
```

#### POST /api/goals

Cria uma nova meta financeira.

**Request Body:**
```json
{
  "userId": "user-1",
  "title": "Comprar Carro",
  "description": "Economizar para comprar um carro novo",
  "targetAmount": 50000.00,
  "currentAmount": 5000.00,
  "targetDate": "2025-12-31",
  "type": "savings"
}
```

**Response:**
```json
{
  "id": "new-goal-id",
  "title": "Comprar Carro",
  "description": "Economizar para comprar um carro novo",
  "targetAmount": 50000.00,
  "currentAmount": 5000.00,
  "targetDate": "2025-12-31T00:00:00.000Z",
  "type": "savings",
  "category": null,
  "isActive": true,
  "userId": "user-1",
  "createdAt": "2025-11-27T12:45:00.000Z",
  "updatedAt": "2025-11-27T12:45:00.000Z"
}
```

### 7. Categorias

#### GET /api/categories

Lista todas as categorias do usuário.

**Query Parameters:**
- `userId` (string, required): ID do usuário
- `type` (string, optional): 'income' ou 'expense'

**Request:**
```bash
GET /api/categories?userId=user-1&type=expense
```

**Response:**
```json
[
  {
    "id": "cat-4",
    "name": "Moradia",
    "type": "expense",
    "color": "#ef4444",
    "icon": "home",
    "description": null,
    "isDefault": true,
    "parentId": null,
    "userId": "user-1",
    "createdAt": "2025-11-27T12:18:06.767Z",
    "updatedAt": "2025-11-27T12:18:06.767Z",
    "parent": null,
    "children": []
  }
]
```

#### POST /api/categories

Cria uma nova categoria.

**Request Body:**
```json
{
  "userId": "user-1",
  "name": "Viagens",
  "type": "expense",
  "color": "#8b5cf6",
  "icon": "plane",
  "description": "Gastos com viagens e turismo"
}
```

**Response:**
```json
{
  "id": "new-category-id",
  "name": "Viagens",
  "type": "expense",
  "color": "#8b5cf6",
  "icon": "plane",
  "description": "Gastos com viagens e turismo",
  "isDefault": false,
  "parentId": null,
  "userId": "user-1",
  "createdAt": "2025-11-27T12:50:00.000Z",
  "updatedAt": "2025-11-27T12:50:00.000Z"
}
```

### 8. Faturas

#### GET /api/invoices

Lista todas as faturas do usuário.

**Query Parameters:**
- `userId` (string, required): ID do usuário
- `creditCardId` (string, optional): ID do cartão
- `status` (string, optional): 'open', 'closed', 'paid', 'overdue'

**Request:**
```bash
GET /api/invoices?userId=user-1&status=open
```

**Response:**
```json
[
  {
    "id": "invoice-1",
    "month": 1,
    "year": 2024,
    "openingBalance": 800.00,
    "totalPurchases": 1200.00,
    "totalPayments": 800.00,
    "closingBalance": 1200.00,
    "minimumPayment": 120.00,
    "dueDate": "2024-01-25T00:00:00.000Z",
    "status": "open",
    "creditCardId": "card-1",
    "userId": "user-1",
    "createdAt": "2025-11-27T12:18:06.792Z",
    "updatedAt": "2025-11-27T12:18:06.792Z",
    "creditCard": {
      "id": "card-1",
      "name": "Visa Final 1234",
      "brand": "visa"
    }
  }
]
```

### 9. Parcelamentos

#### GET /api/installments

Lista todos os parcelamentos do usuário.

**Query Parameters:**
- `userId` (string, required): ID do usuário
- `status` (string, optional): 'pending', 'paid', 'overdue'
- `creditCardId` (string, optional): ID do cartão

**Request:**
```bash
GET /api/installments?userId=user-1&status=pending
```

**Response:**
```json
[
  {
    "id": "installment-1",
    "totalAmount": 3000.00,
    "installmentAmount": 500.00,
    "installmentNumber": 1,
    "totalInstallments": 6,
    "interestRate": 2.5,
    "interestType": "simple",
    "dueDate": "2024-02-10T00:00:00.000Z",
    "status": "pending",
    "originalTransactionId": "trans-1",
    "creditCardId": "card-1",
    "invoiceId": "invoice-1",
    "userId": "user-1",
    "createdAt": "2025-11-27T12:18:06.795Z",
    "updatedAt": "2025-11-27T12:18:06.795Z",
    "creditCard": {
      "id": "card-1",
      "name": "Visa Final 1234",
      "brand": "visa"
    }
  }
]
```

## Error Responses

Todos os endpoints podem retornar erros no seguinte formato:

```json
{
  "error": "Error message description"
}
```

### Common Error Codes

- **400 Bad Request**: Parâmetros inválidos ou ausentes
- **401 Unauthorized**: Usuário não autenticado
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro interno do servidor

## Rate Limiting

Atualmente não implementado, mas será adicionado em produção.

## Versionamento

A API está na versão 1.0. Mudanças quebradoras serão versionadas.

## Testes

Use os seguintes comandos para testar os endpoints:

```bash
# Testar dashboard
curl "http://localhost:3000/api/dashboard?userId=user-1"

# Criar transação
curl -X POST "http://localhost:3000/api/transactions" \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-1","description":"Test","amount":100,"type":"expense","date":"2024-01-20","accountId":"acc-1","categoryId":"cat-5"}'
```