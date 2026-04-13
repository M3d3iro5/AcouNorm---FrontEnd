'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Breadcrumb } from '@/components/breadcrumb'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Server, Database, Bell, Palette, Save } from 'lucide-react'

export default function ConfiguracoesPage() {
  const [apiUrl, setApiUrl] = useState('http://localhost:8000')
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [theme, setTheme] = useState('dark')

  return (
    <div className="min-h-screen">
      <Header 
        title="Configurações" 
        subtitle="Gerencie as preferências do sistema" 
      />
      
      <div className="p-6 space-y-6 max-w-3xl">
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Configurações' },
          ]}
        />

        {/* API Configuration */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Server className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Configuração da API</CardTitle>
                <CardDescription>Conexão com o backend Python</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiUrl">URL do Backend</Label>
              <div className="flex gap-2">
                <Input
                  id="apiUrl"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="bg-input/50 font-mono"
                />
                <Button variant="outline">Testar</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Endereço do servidor Python que processa os cálculos
              </p>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Status da conexão</span>
              </div>
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                Aguardando configuração
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Notificações</CardTitle>
                <CardDescription>Preferências de alertas e avisos</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Notificações do sistema</p>
                <p className="text-xs text-muted-foreground">Receber alertas sobre cálculos e atualizações</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Salvamento automático</p>
                <p className="text-xs text-muted-foreground">Salvar rascunhos automaticamente durante a edição</p>
              </div>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Aparência</CardTitle>
                <CardDescription>Personalização visual do sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="bg-input/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Escuro (Padrão)</SelectItem>
                  <SelectItem value="light" disabled>Claro (Em breve)</SelectItem>
                  <SelectItem value="system" disabled>Sistema (Em breve)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                O tema escuro é otimizado para ambientes de trabalho técnico
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="gap-2 glow-primary">
            <Save className="h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  )
}
