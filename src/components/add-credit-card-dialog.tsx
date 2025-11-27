'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function AddCreditCardDialog({ 
  children, 
  onSuccess 
}: { 
  children: React.ReactNode
  onSuccess: () => void 
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    lastFourDigits: '',
    limit: '',
    closingDay: '',
    dueDay: '',
    description: ''
  })

  const cardBrands = [
    { value: 'visa', label: 'Visa' },
    { value: 'mastercard', label: 'Mastercard' },
    { value: 'elo', label: 'Elo' },
    { value: 'amex', label: 'American Express' },
    { value: 'hipercard', label: 'Hipercard' },
    { value: 'discover', label: 'Discover' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/credit-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'cmiheg6jm0000uic66x4eoycj', // User ID real do banco
          name: formData.name,
          brand: formData.brand,
          lastFourDigits: formData.lastFourDigits,
          limit: parseFloat(formData.limit),
          closingDay: parseInt(formData.closingDay),
          dueDay: parseInt(formData.dueDay),
          description: formData.description
        }),
      })

      if (response.ok) {
        setOpen(false)
        setFormData({
          name: '',
          brand: '',
          lastFourDigits: '',
          limit: '',
          closingDay: '',
          dueDay: '',
          description: ''
        })
        onSuccess()
      } else {
        console.error('Failed to create credit card')
      }
    } catch (error) {
      console.error('Error creating credit card:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Cartão de Crédito</DialogTitle>
          <DialogDescription>
            Adicione um novo cartão de crédito ao seu controle financeiro.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Cartão</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Visa Final 1234"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="brand">Bandeira</Label>
              <Select
                value={formData.brand}
                onValueChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a bandeira" />
                </SelectTrigger>
                <SelectContent>
                  {cardBrands.map((brand) => (
                    <SelectItem key={brand.value} value={brand.value}>
                      {brand.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastFourDigits">4 Últimos Dígitos</Label>
              <Input
                id="lastFourDigits"
                value={formData.lastFourDigits}
                onChange={(e) => setFormData(prev => ({ ...prev, lastFourDigits: e.target.value }))}
                placeholder="1234"
                maxLength={4}
                pattern="[0-9]{4}"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="limit">Limite (R$)</Label>
              <Input
                id="limit"
                type="number"
                step="0.01"
                value={formData.limit}
                onChange={(e) => setFormData(prev => ({ ...prev, limit: e.target.value }))}
                placeholder="5000,00"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="closingDay">Dia de Fechamento</Label>
                <Input
                  id="closingDay"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.closingDay}
                  onChange={(e) => setFormData(prev => ({ ...prev, closingDay: e.target.value }))}
                  placeholder="10"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="dueDay">Dia de Vencimento</Label>
                <Input
                  id="dueDay"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.dueDay}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDay: e.target.value }))}
                  placeholder="25"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Adicione uma descrição para este cartão"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Adicionar Cartão'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}