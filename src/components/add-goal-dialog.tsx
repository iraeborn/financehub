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
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export function AddGoalDialog({ 
  children, 
  onSuccess 
}: { 
  children: React.ReactNode
  onSuccess: () => void 
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: new Date(),
    type: '',
    category: ''
  })

  const goalTypes = [
    { value: 'savings', label: 'Economia' },
    { value: 'expense_limit', label: 'Limite de Gastos' },
    { value: 'debt_reduction', label: 'Quitação de Dívidas' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'cmiheg6jm0000uic66x4eoycj', // User ID real do banco
          title: formData.title,
          description: formData.description,
          targetAmount: parseFloat(formData.targetAmount),
          currentAmount: parseFloat(formData.currentAmount) || 0,
          targetDate: formData.targetDate.toISOString(),
          type: formData.type,
          category: formData.category || null
        }),
      })

      if (response.ok) {
        setOpen(false)
        setFormData({
          title: '',
          description: '',
          targetAmount: '',
          currentAmount: '',
          targetDate: new Date(),
          type: '',
          category: ''
        })
        onSuccess()
      } else {
        console.error('Failed to create goal')
      }
    } catch (error) {
      console.error('Error creating goal:', error)
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
          <DialogTitle>Nova Meta Financeira</DialogTitle>
          <DialogDescription>
            Defina uma nova meta para organizar suas finanças.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título da Meta</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Fundo de Emergência"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de Meta</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {goalTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="targetAmount">Valor Alvo (R$)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                  placeholder="10000,00"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="currentAmount">Valor Atual (R$)</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  step="0.01"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
                  placeholder="0,00"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="targetDate">Data Alvo</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.targetDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.targetDate ? format(formData.targetDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.targetDate}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, targetDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {(formData.type === 'expense_limit' || formData.type === 'debt_reduction') && (
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria (opcional)</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Ex: Lazer, Alimentação"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva os detalhes da sua meta"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Criar Meta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}