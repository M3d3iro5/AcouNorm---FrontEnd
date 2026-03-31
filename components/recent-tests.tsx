'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockTestHistory } from '@/lib/mock-data'
import { TEST_TYPES } from '@/lib/types'

const statusConfig = {
  completed: { label: 'Concluído', variant: 'default' as const, className: 'bg-success/10 text-success border-success/20' },
  draft: { label: 'Rascunho', variant: 'secondary' as const, className: 'bg-warning/10 text-warning border-warning/20' },
  error: { label: 'Erro', variant: 'destructive' as const, className: 'bg-destructive/10 text-destructive border-destructive/20' },
}

export function RecentTests() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Histórico</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            Ver todos
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {mockTestHistory.map((test) => {
            const testType = TEST_TYPES.find(t => t.id === test.testType)
            const status = statusConfig[test.status]
            
            return (
              <div
                key={test.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-mono font-medium text-primary">
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
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground font-mono">
                        {test.testCode}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(test.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {test.mainResult && (
                    <span className="text-sm font-mono text-foreground hidden sm:block">
                      {test.mainResult}
                    </span>
                  )}
                  <Badge variant={status.variant} className={status.className}>
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
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
