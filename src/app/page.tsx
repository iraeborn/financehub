'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SettingsDialog } from '@/components/settings-dialog'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Target,
  Bell,
  Plus,
  Wallet,
  PieChart,
  FileText,
  Settings,
  RefreshCw
} from 'lucide-react'

interface DashboardData {
  monthlySummary: {
    income: number
    expense: number
    balance: number
  }
  totalBalance: number
  totalCreditLimit: number
  openInvoices: number
  activeGoals: number
  futureInstallments: number
  unreadNotifications: number
  monthlyEvolution: Array<{
    month: string
    income: number
    expense: number
    balance: number
  }>
  expensesByCategory: Array<{
    categoryId: string
    amount: number
  }>
}

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // User ID real do banco de dados
      const userId = 'cmiheg6jm0000uic66x4eoycj'
      
      const response = await fetch(`/api/dashboard?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      } else {
        console.error('Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar dados do dashboard</p>
          <Button onClick={fetchDashboardData} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Wallet className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">FinanceControl</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={fetchDashboardData}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {dashboardData.unreadNotifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {dashboardData.unreadNotifications}
                  </Badge>
                )}
              </Button>
              <SettingsDialog>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </SettingsDialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalBalance)}</div>
              <p className="text-xs text-muted-foreground">
                Todas as contas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas (Mês)</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(dashboardData.monthlySummary.income)}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas (Mês)</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(dashboardData.monthlySummary.expense)}
              </div>
              <p className="text-xs text-muted-foreground">
                -5% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Limite de Crédito</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalCreditLimit)}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.openInvoices} faturas abertas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>
                  Adicione transações, cartões ou metas rapidamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col space-y-2 w-full">
                    <Plus className="h-6 w-6" />
                    <span className="text-xs">Nova Receita</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col space-y-2 w-full">
                    <Plus className="h-6 w-6" />
                    <span className="text-xs">Nova Despesa</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col space-y-2 w-full">
                    <CreditCard className="h-6 w-6" />
                    <span className="text-xs">Novo Cartão</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col space-y-2 w-full">
                    <Target className="h-6 w-6" />
                    <span className="text-xs">Nova Meta</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Evolution */}
            <Card>
              <CardHeader>
                <CardTitle>Evolução Mensal</CardTitle>
                <CardDescription>
                  Receitas vs Despesas dos últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.monthlyEvolution.map((month, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-20 text-sm font-medium">{month.month}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${Math.min((month.income / 10000) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full" 
                              style={{ width: `${Math.min((month.expense / 10000) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(month.balance)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Summary Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Metas Ativas</span>
                  <Badge variant="secondary">{dashboardData.activeGoals}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Parcelamentos Futuros</span>
                  <Badge variant="secondary">{dashboardData.futureInstallments}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Faturas Abertas</span>
                  <Badge variant="secondary">{dashboardData.openInvoices}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Notificações</span>
                  <Badge variant="secondary">{dashboardData.unreadNotifications}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Navegação Rápida</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <PieChart className="h-4 w-4 mr-2" />
                  Relatórios
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Cartões de Crédito
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Faturas
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Metas Financeiras
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}