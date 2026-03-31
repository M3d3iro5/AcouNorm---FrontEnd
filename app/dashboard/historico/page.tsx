'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Breadcrumb } from '@/components/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Download, Star } from 'lucide-react'
import { mockTestHistory } from '@/lib/mock-data'
import { TEST_TYPES } from '@/lib/types'

const statusConfig = {
  completed: { label: 'Concluído', className: 'bg-success/10 text-success border-success/20' },
  draft: { label: 'Rascunho', className: 'bg-warning/10 text-warning border-warning/20' },
  error: { label: 'Erro', className: 'bg-destructive/10 text-destructive border-destructive/20' },
}

export default function HistoricoPage() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredTests = mockTestHistory.filter(test => {
    const matchesSearch = test.projectName.toLowerCase().includes(search.toLowerCase()) ||
                          test.testCode.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'all' || test.testType === filterType
    const matchesStatus = filterStatus === 'all' || test.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="min-h-screen">
      <Header 
        title="Histórico de Ensaios" 
        subtitle="Visualize e gerencie todos os ensaios realizados" 
      />
      
      <div className="p-6 space-y-6">
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Histórico' },
          ]}
        />

        {/* Filters */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por projeto ou código..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-input/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[160px] bg-input/50">
                    <SelectValue placeholder="Tipo de ensaio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {TEST_TYPES.map(type => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px] bg-input/50">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="error">Erro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">
                {filteredTests.length} ensaio{filteredTests.length !== 1 ? 's' : ''} encontrado{filteredTests.length !== 1 ? 's' : ''}
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar Lista
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredTests.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhum ensaio encontrado com os filtros aplicados.
                </div>
              ) : (
                filteredTests.map((test) => {
                  const testType = TEST_TYPES.find(t => t.id === test.testType)
                  const status = statusConfig[test.status]
                  
                  return (
                    <div
                      key={test.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-mono font-medium text-primary">
                            {test.testCode.split('-')[0]}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground truncate">
                              {test.projectName}
                            </p>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {testType?.name}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-muted-foreground font-mono">
                              {test.testCode}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(test.date).toLocaleDateString('pt-BR')}
                            </span>
                            {test.mainResult && (
                              <span className="text-sm font-mono text-foreground">
                                {test.mainResult}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={status.className}>
                          {status.label}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Star className="h-4 w-4 mr-2" />
                              Favoritar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Exportar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
