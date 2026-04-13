'use client'

import { Header } from '@/components/header'
import { Breadcrumb } from '@/components/breadcrumb'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Building2, Calendar, Save, Key } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function PerfilPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      <Header 
        title="Perfil" 
        subtitle="Gerencie suas informações pessoais" 
      />
      
      <div className="p-6 space-y-6 max-w-3xl">
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Perfil' },
          ]}
        />

        {/* Profile Info */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <CardTitle className="text-xl">{user?.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  {user?.email}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="ml-auto">Usuário Ativo</Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Personal Data */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Dados Pessoais</CardTitle>
                <CardDescription>Informações básicas do perfil</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  defaultValue={user?.name}
                  className="bg-input/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email}
                  className="bg-input/50"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa / Instituição</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company"
                    placeholder="Nome da empresa"
                    className="bg-input/50 pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Cargo / Função</Label>
                <Input
                  id="role"
                  placeholder="Ex: Engenheiro Acústico"
                  className="bg-input/50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Segurança</CardTitle>
                <CardDescription>Altere sua senha de acesso</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Sua senha atual"
                  className="bg-input/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Nova senha"
                  className="bg-input/50"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              A senha deve ter pelo menos 8 caracteres, incluindo letras e números.
            </p>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Informações da Conta</CardTitle>
                <CardDescription>Dados sobre sua conta no sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="p-3 rounded-md bg-muted/30">
                <p className="text-xs text-muted-foreground">ID do Usuário</p>
                <p className="text-sm font-mono text-foreground">{user?.id}</p>
              </div>
              <div className="p-3 rounded-md bg-muted/30">
                <p className="text-xs text-muted-foreground">Membro desde</p>
                <p className="text-sm text-foreground">Março 2024</p>
              </div>
              <div className="p-3 rounded-md bg-muted/30">
                <p className="text-xs text-muted-foreground">Total de ensaios</p>
                <p className="text-sm text-foreground">47 ensaios</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="gap-2 glow-primary">
            <Save className="h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  )
}
