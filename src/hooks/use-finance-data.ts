'use client'

import { useState, useEffect } from 'react'

interface Account {
  id: string
  name: string
  type: string
  balance: number
  bank?: string
  isActive: boolean
}

interface Category {
  id: string
  name: string
  type: string
  color: string
  icon?: string
  isDefault: boolean
}

interface CreditCard {
  id: string
  name: string
  brand: string
  lastFourDigits: string
  limit: number
  currentBalance: number
  closingDay: number
  dueDay: number
  isActive: boolean
}

export function useFinanceData() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [creditCards, setCreditCards] = useState<CreditCard[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const userId = 'cmiheg6jm0000uic66x4eoycj' // User ID real do banco

      // Fetch accounts
      const accountsResponse = await fetch(`/api/accounts?userId=${userId}`)
      if (accountsResponse.ok) {
        const accountsData = await accountsResponse.json()
        setAccounts(accountsData)
      }

      // Fetch categories
      const categoriesResponse = await fetch(`/api/categories?userId=${userId}`)
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)
      }

      // Fetch credit cards
      const creditCardsResponse = await fetch(`/api/credit-cards?userId=${userId}`)
      if (creditCardsResponse.ok) {
        const creditCardsData = await creditCardsResponse.json()
        setCreditCards(creditCardsData)
      }
    } catch (error) {
      console.error('Error fetching finance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    accounts,
    categories,
    creditCards,
    loading,
    refreshData
  }
}