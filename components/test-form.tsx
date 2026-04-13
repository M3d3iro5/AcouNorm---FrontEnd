"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { FormSection } from "@/components/form-section";
import { NumericInputWithUnit } from "@/components/numeric-input-with-unit";
import { FrequencyBandTable } from "@/components/frequency-band-table";
import { HelpPanel } from "@/components/help-panel";
import {
  Save,
  Calculator,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Zap,
} from "lucide-react";
import {
  TestType,
  FrequencyData,
  FREQUENCY_BANDS,
  TEST_TYPES,
} from "@/lib/types";
import {
  calculateAcoustic,
  extractMainMetrics,
  ApiResponse,
} from "@/lib/api-service";
import { cn } from "@/lib/utils";

interface TestFormProps {
  testType: TestType;
  onCalculated: () => void;
}

interface FormState {
  // Dados do ensaio
  projectName: string;
  testCode: string;
  date: string;
  observations: string;
  // Geometria
  partitionArea: number | null;
  receptionVolume: number | null;
  roomAbsorption: number | null;
  useAbsorption: boolean;
  // Medições
  npsBands1: FrequencyData[];
  npsBands2: FrequencyData[];
  tr60Bands: FrequencyData[];
}

const initialState: FormState = {
  projectName: "",
  testCode: "",
  date: new Date().toISOString().split("T")[0],
  observations: "",
  partitionArea: null,
  receptionVolume: null,
  roomAbsorption: null,
  useAbsorption: false,
  npsBands1: FREQUENCY_BANDS.map((f) => ({ frequency: f, value: 0 })),
  npsBands2: FREQUENCY_BANDS.map((f) => ({ frequency: f, value: 0 })),
  tr60Bands: FREQUENCY_BANDS.map((f) => ({ frequency: f, value: 0 })),
};

export function TestForm({ testType, onCalculated }: TestFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const router = useRouter();

  const config = TEST_TYPES.find((t) => t.id === testType);

  const updateForm = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
    setSaved(false);
    setCalculationError(null);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.projectName.trim()) {
      newErrors.projectName = "Nome do projeto é obrigatório";
    }

    if (!form.testCode.trim()) {
      newErrors.testCode = "Código do ensaio é obrigatório";
    }

    if (form.receptionVolume === null || form.receptionVolume <= 0) {
      newErrors.receptionVolume = "Volume da sala de recepção é obrigatório";
    }

    if (
      testType !== "impacto_laje" &&
      (form.partitionArea === null || form.partitionArea <= 0)
    ) {
      newErrors.partitionArea = "Área da partição é obrigatória";
    }

    if (
      (form.roomAbsorption === null || form.roomAbsorption <= 0) &&
      form.tr60Bands.some((b) => b.value > 0) === false
    ) {
      newErrors.absorption = "Informe a absorção do recinto ou o TR60";
    }

    // Validação de NPS por bandas - deve ter valores válidos (20-100 dB)
    if (testType !== "impacto_laje") {
      const validSourceValues = form.npsBands1.filter(
        (b) => b.value > 0 && b.value >= 20 && b.value <= 100,
      );
      const hasValidSourceValues = validSourceValues.length >= 5; // Pelo menos 5/8 bandas preenchidas

      if (!hasValidSourceValues) {
        newErrors.npsBands1 =
          "Preencha pelo menos 5 das 8 bandas com valores entre 20-100 dB na sala fonte";
      }
    }

    const validReceptionValues = form.npsBands2.filter(
      (b) => b.value > 0 && b.value >= 20 && b.value <= 100,
    );
    const hasValidReceptionValues = validReceptionValues.length >= 5; // Pelo menos 5/8 bandas

    if (!hasValidReceptionValues) {
      newErrors.npsBands2 =
        "Preencha pelo menos 5 das 8 bandas com valores entre 20-100 dB na sala de recepção";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
  };

  const handleCalculate = async () => {
    if (!validate()) return;

    setIsCalculating(true);
    setCalculationError(null);

    try {
      // Preparar dados para a API
      const npsBands1 = testType !== "impacto_laje" ? form.npsBands1 : null;
      const trBands60 = form.useAbsorption ? null : form.tr60Bands;

      // Chamar API real
      const response = await calculateAcoustic(
        testType,
        npsBands1,
        form.npsBands2,
        form.partitionArea,
        form.receptionVolume || 0,
        form.useAbsorption ? form.roomAbsorption : null,
        trBands60,
      );

      setApiResponse(response);

      // Redirecionar para página de resultados com os dados
      const mainMetrics = extractMainMetrics(response, testType);

      // Salvar dados do ensaio em localStorage para uso na página de resultados
      const testData = {
        projectName: form.projectName,
        testCode: form.testCode,
        testType: testType,
        date: form.date,
        observations: form.observations,
        metrics: mainMetrics,
        apiResponse: response,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("lastTestData", JSON.stringify(testData));

      onCalculated();

      // Redirecionar para resultados
      router.push(`/dashboard/novo-ensaio?result=${testType}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao processar cálculo";
      setCalculationError(errorMessage);
      console.error("Erro ao calcular:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleClear = () => {
    setForm(initialState);
    setErrors({});
    setSaved(false);
  };

  const getNpsLabels = () => {
    switch (testType) {
      case "aereo_parede":
        return { label1: "NPS Sala Fonte", label2: "NPS Sala Recepção" };
      case "aereo_fachada":
        return {
          label1: "NPS Externo / Próximo à Fachada",
          label2: "NPS Interno / Sala de Recepção",
        };
      case "impacto_laje":
        return { label1: "", label2: "NPS Sala Recepção" };
      default:
        return { label1: "NPS Fonte", label2: "NPS Recepção" };
    }
  };

  const npsLabels = getNpsLabels();

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
                onChange={(e) => updateForm("projectName", e.target.value)}
                placeholder="Ex: Edifício Aurora"
                className={cn(
                  "bg-input/50",
                  errors.projectName && "border-destructive",
                )}
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
                onChange={(e) => updateForm("testCode", e.target.value)}
                placeholder="Ex: AUR-001"
                className={cn(
                  "bg-input/50 font-mono",
                  errors.testCode && "border-destructive",
                )}
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
                onChange={(e) => updateForm("date", e.target.value)}
                className="bg-input/50"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                value={form.observations}
                onChange={(e) => updateForm("observations", e.target.value)}
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
            {testType !== "impacto_laje" && (
              <NumericInputWithUnit
                id="partitionArea"
                label={
                  testType === "aereo_fachada"
                    ? "Área da Fachada"
                    : "Área da Partição"
                }
                unit="m²"
                value={form.partitionArea}
                onChange={(v) => updateForm("partitionArea", v)}
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
              onChange={(v) => updateForm("receptionVolume", v)}
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
                  Informe a absorção do recinto ou o TR60 (tempo de
                  reverberação)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="useAbsorption"
                  className="text-sm text-muted-foreground"
                >
                  {form.useAbsorption ? "Usar Absorção" : "Usar TR60"}
                </Label>
                <Switch
                  id="useAbsorption"
                  checked={form.useAbsorption}
                  onCheckedChange={(v) => updateForm("useAbsorption", v)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <NumericInputWithUnit
                id="roomAbsorption"
                label="Absorção do Recinto"
                unit="m²"
                value={form.roomAbsorption}
                onChange={(v) => updateForm("roomAbsorption", v)}
                tooltip="Absorção equivalente do ambiente de recepção em m² Sabine"
                disabled={!form.useAbsorption}
                min={0.1}
              />
              {!form.useAbsorption && (
                <div>
                  <FrequencyBandTable
                    label="TR60 (Tempo de Reverberação)"
                    data={form.tr60Bands}
                    onChange={(v) => updateForm("tr60Bands", v)}
                    unit="s"
                    error={errors.absorption}
                  />
                </div>
              )}
            </div>
            {errors.absorption && !form.useAbsorption && (
              <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.absorption}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {form.useAbsorption
                ? "O TR60 poderá ser calculado pelo backend a partir da absorção informada."
                : "A absorção poderá ser derivada pelo backend a partir do TR60 informado. Informe valores por banda de frequência."}
            </p>
          </div>
        </FormSection>

        {/* Medições Sonoras */}
        <FormSection
          title="3. Medições Sonoras"
          description="Níveis de pressão sonora medidos conforme procedimento normalizado"
        >
          {testType === "impacto_laje" && (
            <div className="mb-4 p-3 rounded-md bg-info/10 border border-info/20">
              <p className="text-sm text-info flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Ruído de impacto: Neste caso não há NPS de sala fonte como no
                ruído aéreo.
              </p>
            </div>
          )}

          {calculationError && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {calculationError}
              </p>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            {testType !== "impacto_laje" && (
              <FrequencyBandTable
                label={npsLabels.label1}
                data={form.npsBands1}
                onChange={(v) => updateForm("npsBands1", v)}
                error={errors.npsBands1}
              />
            )}
            <FrequencyBandTable
              label={npsLabels.label2}
              data={form.npsBands2}
              onChange={(v) => updateForm("npsBands2", v)}
              error={errors.npsBands2}
            />
          </div>
        </FormSection>

        {/* Resumo e Ações */}
        <FormSection title="4. Resumo para Cálculo">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryItem label="Projeto" value={form.projectName || "-"} />
            <SummaryItem label="Código" value={form.testCode || "-"} mono />
            <SummaryItem label="Tipo" value={config?.name || "-"} />
            {form.partitionArea && (
              <SummaryItem
                label="Área"
                value={`${form.partitionArea} m²`}
                mono
              />
            )}
            {form.receptionVolume && (
              <SummaryItem
                label="Volume"
                value={`${form.receptionVolume} m³`}
                mono
              />
            )}
            {form.roomAbsorption && (
              <SummaryItem
                label="Absorção"
                value={`${form.roomAbsorption} m²`}
                mono
              />
            )}
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
              {saved ? "Rascunho salvo" : "Salvar rascunho"}
            </Button>
            <Button
              onClick={handleCalculate}
              disabled={isCalculating || isSaving}
              className="gap-2 glow-primary"
              title={
                isCalculating
                  ? "Enviando para o servidor..."
                  : "Calcular resultados"
              }
            >
              {isCalculating ? (
                <>
                  <Spinner className="h-4 w-4" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Calcular</span>
                </>
              )}
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

          <div className="pt-2 space-y-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              Servidor:{" "}
              {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
            </p>
            <p className="text-xs text-muted-foreground">
              Os cálculos serão processados pelo backend Python conforme normas
              técnicas ISO 16283-1, ISO 16283-2, ISO 16283-3 e ISO 717-1/717-2.
            </p>
          </div>
        </FormSection>
      </div>

      {/* Help Panel */}
      <aside className="hidden lg:block">
        <div className="sticky top-6">
          <HelpPanel testType={testType} />
        </div>
      </aside>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="px-3 py-2 rounded-md bg-muted/30">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "text-sm font-medium text-foreground",
          mono && "font-mono",
        )}
      >
        {value}
      </p>
    </div>
  );
}
