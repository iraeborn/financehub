'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Settings, User, Bell } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface SettingsDialogProps {
  children: React.ReactNode
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSave = () => {
    console.log('Settings saved')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
          <DialogDescription>
            Gerencie suas preferências e configurações da conta.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="mr-2 h-5 w-5" />
              Perfil
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Nome: João Silva
              </p>
              <p className="text-sm text-muted-foreground">
                Email: user@example.com
              </p>
              <p className="text-sm text-muted-foreground">
                Telefone: +55 11 99999-9999
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notificações
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                • Notificações por Email: Ativado
              </p>
              <p className="text-sm text-muted-foreground">
                • Alertas de Faturas: Ativado
              </p>
              <p className="text-sm text-muted-foreground">
                • Alertas de Metas: Ativado
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Preferências
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                • Tema: Claro
              </p>
              <p className="text-sm text-muted-foreground">
                • Idioma: Português (Brasil)
              </p>
              <p className="text-sm text-muted-foreground">
                • Moeda: Real (R$)
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}