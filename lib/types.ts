// Tipos de ensaio disponíveis
export type TestType = "aereo_parede" | "aereo_fachada" | "impacto_laje";

// Bandas de frequência padrão
export const FREQUENCY_BANDS = [
  100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000,
  2500, 3150,
] as const;
export const EXTENDED_FREQUENCY_BANDS = [
  50,
  63,
  80,
  ...FREQUENCY_BANDS,
  4000,
  5000,
] as const;

export type FrequencyBand = (typeof FREQUENCY_BANDS)[number];

// Estrutura para dados de medição por banda
export interface FrequencyData {
  frequency: number;
  value: number;
}

// Modo de entrada de dados
export type InputMode = "simple" | "bands";

// Dados do ensaio base
export interface TestBaseData {
  projectName: string;
  testCode: string;
  date: string;
  observations: string;
}

// Dados de geometria e acústica
export interface GeometryData {
  partitionArea: number | null;
  receptionVolume: number | null;
  roomAbsorption: number | null;
  tr60Bands: FrequencyData[];
}

// Dados específicos por tipo de ensaio
export interface AereoParede {
  tipo: "aereo_parede";
  npsSourceRoom: FrequencyData[];
  npsReceptionRoom: FrequencyData[];
}

export interface AereoFachada {
  tipo: "aereo_fachada";
  npsExternal: FrequencyData[];
  npsInternal: FrequencyData[];
}

export interface ImpactoLaje {
  tipo: "impacto_laje";
  npsReceptionRoom: FrequencyData[];
}

export type TestSpecificData = AereoParede | AereoFachada | ImpactoLaje;

// Payload completo para API
export interface TestPayload {
  baseData: TestBaseData;
  geometry: GeometryData;
  measurements: TestSpecificData;
}

// Resultados mockados
export interface TestResult {
  id: string;
  testType: TestType;
  metrics: ResultMetric[];
  frequencyData: FrequencyData[];
  classification: string;
  status: "success" | "error" | "pending";
  processedAt: string;
}

export interface ResultMetric {
  name: string;
  value: number;
  unit: string;
  description?: string;
}

// Configuração de tipos de ensaio
export interface TestTypeConfig {
  id: TestType;
  name: string;
  description: string;
  icon: string;
  metrics: string[];
  requiredFields: string[];
}

export const TEST_TYPES: TestTypeConfig[] = [
  {
    id: "aereo_parede",
    name: "Aéreo Parede",
    description:
      "Isolamento a ruído aéreo entre ambientes internos separados por partição vertical",
    icon: "wall",
    metrics: ["DnT", "R'", "DnT,w", "R'w"],
    requiredFields: [
      "partitionArea",
      "receptionVolume",
      "npsSourceRoom",
      "npsReceptionRoom",
    ],
  },
  {
    id: "aereo_fachada",
    name: "Aéreo Fachada",
    description:
      "Isolamento a ruído aéreo de fachadas e elementos de vedação externa",
    icon: "building",
    metrics: ["D2m,nT", "D2m,n", "R'45°", "D2m,nT,w", "D2m,n,w"],
    requiredFields: [
      "partitionArea",
      "receptionVolume",
      "npsExternal",
      "npsInternal",
    ],
  },
  {
    id: "impacto_laje",
    name: "Impacto Laje",
    description:
      "Isolamento a ruído de impacto em pisos e lajes entre pavimentos",
    icon: "layers",
    metrics: ["L'nT", "L'n", "L'nT,w"],
    requiredFields: ["receptionVolume", "npsReceptionRoom"],
  },
];

// Estado de autenticação
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Histórico de ensaios
export interface TestHistory {
  id: string;
  projectName: string;
  testCode: string;
  testType: TestType;
  date: string;
  status: "completed" | "draft" | "error";
  mainResult?: string;
}
