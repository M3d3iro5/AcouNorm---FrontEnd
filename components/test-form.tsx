'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import { FormSection } from '@/components/form-section'
import { NumericInputWithUnit } from '@/components/numeric-input-with-unit'
import { ToggleInputMode } from '@/components/toggle-input-mode'
import { FrequencyBandTable } from '@/components/frequency-band-table'
import { HelpPanel } from '@/components/help-panel'
import { Save, Calculator, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react'
import { TestType, InputMode, FrequencyData, FREQUENCY_BANDS, TEST_TYPES } from '@/lib/types'
import { mockCalculate } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface TestFormProps {
  testType: TestType
  onCalculated: () => void
}

interface FormState {
  // Dados do ensaio
  projectName: string
  testCode: string
  date: string
  observations: string
  // Geometria
  partitionArea: number | null
  receptionVolume: number | null
  roomAbsorption: number | null
  tr60: number | null
  useAbsorption: boolean
  // Medições
  inputMode: InputMode
  npsSimple1: number | null
  npsSimple2: number | null
  npsBands1: FrequencyData[]
  npsBands2: FrequencyData[]
}

const initialState: FormState = {
  projectName: '',
  testCode: '',
  date: new Date().toISOString().split('T')[0],
  observations: '',
  partitionArea: null,
  receptionVolume: null,
  roomAbsorption: null,
  tr60: null,
  useAbsorption: false,
  inputMode: 'simple',
  npsSimple1: null,
  npsSimple2: null,
  npsBands1: FREQUENCY_BANDS.map(f => ({ frequency: f, value: 0 })),
  npsBands2: FREQUENCY_BANDS.map(f => ({ frequency: f, value: 0 })),
}

export function TestForm({ testType, onCalculated }: TestFormProps) {
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isCalculating, setIsCalculating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const config = TEST_TYPES.find(t => t.id === testType)

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }))
    }
    setSaved(false)
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!form.projectName.trim()) {
      newErrors.projectName = 'Nome do projeto é obrigatório'
    }

    if (!form.testCode.trim()) {
      newErrors.testCode = 'Código do ensaio é obrigatório'
    }

    if (form.receptionVolume === null || form.receptionVolume <= 0) {
      newErrors.receptionVolume = 'Volume da sala de recepção é obrigatório'
    }

    if (testType !== 'impacto_laje' && (form.partitionArea === null || form.partitionArea <= 0)) {
      newErrors.partitionArea = 'Área da partição é obrigatória'
    }

    if ((form.roomAbsorption === null || form.roomAbsorption <= 0) && 
        (form.tr60 === null || form.tr60 <= 0)) {
      newErrors.absorption = 'Informe a absorção do recinto ou o TR60'
    }

    // Validação de NPS conforme tipo de ensaio
    if (form.inputMode === 'simple') {
      if (testType !== 'impacto_laje') {
        if (form.npsSimple1 === null) {
          newErrors.npsSimple1 = 'NPS da sala fonte é obrigatório'
        }
      }
      if (form.npsSimple2 === null) {
        newErrors.npsSimple2 = 'NPS da sala de recepção é obrigatório'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaved(true)
  }

  const handleCalculate = async () => {
    if (!validate()) return

    setIsCalculating(true)
    try {
      await mockCalculate(testType)
      onCalculated()
    } finally {
      setIsCalculating(false)
    }
  }

  const handleClear = () => {
    setForm(initialState)
    setErrors({})
    setSaved(false)
  }

  const getNpsLabels = () => {
    switch (testType) {
      case 'aereo_parede':
        return { label1: 'NPS Sala Fonte', label2: 'NPS Sala Recepção' }
      case 'aereo_fachada':
        return { label1: 'NPS Externo / Próximo à Fachada', label2: 'NPS Interno / Sala de Recepção' }
      case 'impacto_laje':
        return { label1: '', label2: 'NPS Sala Recepção' }
      default:
        return { label1: 'NPS Fonte', label2: 'NPS Recepção' }
    }
  }

  const npsLabels = getNpsLabels()

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Main Form */}
      <div className="space-y-6">
        {/* Dados do Ensaio */}
        <FormSection
          title="1. Dados do Ensaio"
          description="Informações de identificação do projeto e ensaio"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="projectName">
                Nome do Projeto <span className="text-destructive">*</span>
              </Label>
              <Input
                id="projectName"
                value={form.projectName}
                onChange={(e) => updateForm('projectName', e.target.value)}
                placeholder="Ex: Edifício Aurora"
                className={cn("bg-input/50", errors.projectName && "border-destructive")}
              />
              {errors.projectName && (
                <p className="text-xs text-destructive">{errors.projectName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="testCode">
                Código do Ensaio <span className="text-destructive">*</span>
              </Label>
              <Input
                id="testCode"
                value={form.testCode}
                onChange={(e) => updateForm('testCode', e.target.value)}
                placeholder="Ex: AUR-001"
                className={cn("bg-input/50 font-mono", errors.testCode && "border-destructive")}
              />
              {errors.testCode && (
                <p className="text-xs text-destructive">{errors.testCode}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data do Ensaio</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => updateForm('date', e.target.value)}
                className="bg-input/50"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                value={form.observations}
                onChange={(e) => updateForm('observations', e.target.value)}
                placeholder="Observações técnicas sobre o ensaio..."
                className="bg-input/50 min-h-[80px]"
              />
            </div>
          </div>
        </FormSection>

        {/* Geometria e Acústica */}
        <FormSection
          title="2. Geometria e Acústica do Recinto"
          description="Parâmetros dimensionais e acústicos do ambiente"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {testType !== 'impacto_laje' && (
              <NumericInputWithUnit
                id="partitionArea"
                label={testType === 'aereo_fachada' ? 'Área da Fachada' : 'Área da Partição'}
                unit="m²"
                value={form.partitionArea}
                onChange={(v) => updateForm('partitionArea', v)}
                tooltip="Área do elemento separador entre os ambientes"
                error={errors.partitionArea}
                required
                min={0.1}
              />
            )}
            <NumericInputWithUnit
              id="receptionVolume"
              label="Volume da Sala de Recepção"
              unit="m³"
              value={form.receptionVolume}
              onChange={(v) => updateForm('receptionVolume', v)}
              tooltip="Volume interno do ambiente de recepção"
              error={errors.receptionVolume}
              required
              min={1}
            />
          </div>

          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium">Condições de absorção</p>
                <p className="text-xs text-muted-foreground">
                  Informe a absorção do recinto ou o TR60 (tempo de reverberação)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="useAbsorption" className="text-sm text-muted-foreground">
                  {form.useAbsorption ? 'Usar Absorção' : 'Usar TR60'}
                </Label>
                <Switch
                  id="useAbsorption"
                  checked={form.useAbsorption}
                  onCheckedChange={(v) => updateForm('useAbsorption', v)}
                />
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <NumericInputWithUnit
                id="roomAbsorption"
                label="Absorção do Recinto"
                unit="m²"
                value={form.roomAbsorption}
                onChange={(v) => updateForm('roomAbsorption', v)}
                tooltip="Absorção equivalente do ambiente de recepção em m² Sabine"
                disabled={!form.useAbsorption}
                min={0.1}
              />
              <NumericInputWithUnit
                id="tr60"
                label="TR60"
                unit="s"
                value={form.tr60}
                onChange={(v) => updateForm('tr60', v)}
                tooltip="Tempo de reverberação T60 da sala de recepção"
                disabled={form.useAbsorption}
                min={0.1}
              />
            </div>
            {errors.absorption && (
              <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.absorption}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {form.useAbsorption
                ? 'O TR60 poderá ser calculado pelo backend a partir da absorção informada.'
                : 'A absorção poderá ser derivada pelo backend a partir do TR60 informado.'}
            </p>
          </div>
        </FormSection>

        {/* Medições Sonoras */}
        <FormSection
          title="3. Medições Sonoras"
          description="Níveis de pressão sonora medidos conforme procedimento normalizado"
        >
          {testType === 'impacto_laje' && (
            <div className="mb-4 p-3 rounded-md bg-info/10 border border-info/20">
              <p className="text-sm text-info flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Ruído de impacto: Neste caso não há NPS de sala fonte como no ruído aéreo.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium">Modo de entrada</p>
            <ToggleInputMode
              value={form.inputMode}
              onChange={(v) => updateForm('inputMode', v)}
            />
          </div>

          {form.inputMode === 'simple' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {testType !== 'impacto_laje' && (
                <NumericInputWithUnit
                  id="npsSimple1"
                  label={npsLabels.label1}
                  unit="dB"
                  value={form.npsSimple1}
                  onChange={(v) => updateForm('npsSimple1', v)}
                  tooltip="Nível de pressão sonora global medido"
                  error={errors.npsSimple1}
                  required
                />
              )}
              <NumericInputWithUnit
                id="npsSimple2"
                label={npsLabels.label2}
                unit="dB"
                value={form.npsSimple2}
                onChange={(v) => updateForm('npsSimple2', v)}
                tooltip="Nível de pressão sonora global medido na sala de recepção"
                error={errors.npsSimple2}
                required
              />
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {testType !== 'impacto_laje' && (
                <FrequencyBandTable
                  label={npsLabels.label1}
                  data={form.npsBands1}
                  onChange={(v) => updateForm('npsBands1', v)}
                />
              )}
              <FrequencyBandTable
                label={npsLabels.label2}
                data={form.npsBands2}
                onChange={(v) => updateForm('npsBands2', v)}
              />
            </div>
          )}
        </FormSection>

        {/* Resumo e Ações */}
        <FormSection title="4. Resumo para Cálculo">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryItem label="Projeto" value={form.projectName || '-'} />
            <SummaryItem label="Código" value={form.testCode || '-'} mono />
            <SummaryItem label="Tipo" value={config?.name || '-'} />
            {form.partitionArea && <SummaryItem label="Área" value={`${form.partitionArea} m²`} mono />}
            {form.receptionVolume && <SummaryItem label="Volume" value={`${form.receptionVolume} m³`} mono />}
            {form.tr60 && <SummaryItem label="TR60" value={`${form.tr60} s`} mono />}
            {form.roomAbsorption && <SummaryItem label="Absorção" value={`${form.roomAbsorption} m²`} mono />}
            <SummaryItem label="Modo de entrada" value={form.inputMode === 'simple' ? 'Simplificado' : 'Por bandas'} />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isSaving || isCalculating}
              className="gap-2"
            >
              {isSaving ? (
                <Spinner className="h-4 w-4" />
              ) : saved ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saved ? 'Rascunho salvo' : 'Salvar rascunho'}
            </Button>
            <Button
              onClick={handleCalculate}
              disabled={isCalculating || isSaving}
              className="gap-2 glow-primary"
            >
              {isCalculating ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <Calculator className="h-4 w-4" />
              )}
              {isCalculating ? 'Calculando...' : 'Calcular'}
            </Button>
            <Button
              variant="ghost"
              onClick={handleClear}
              disabled={isCalculating || isSaving}
              className="gap-2 text-muted-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Limpar
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Os cálculos serão processados pelo backend Python conforme normas técnicas aplicáveis.
          </p>
        </FormSection>
      </div>

      {/* Help Panel */}
      <aside className="hidden lg:block">
        <div className="sticky top-6">
          <HelpPanel testType={testType} />
        </div>
      </aside>
    </div>
  )
}

function SummaryItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="px-3 py-2 rounded-md bg-muted/30">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("text-sm font-medium text-foreground", mono && "font-mono")}>{value}</p>
    </div>
  )
}
