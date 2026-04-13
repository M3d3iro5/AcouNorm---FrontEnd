// API Service para integração com backend AcouNorm
import { TestType, FrequencyData } from "./types";

// Configuração da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Bandas de frequência padrão 1/1 oitava (conforme endpoints)
const FREQUENCY_BANDS_11: number[] = [
  125, 250, 500, 1000, 2000, 4000, 8000, 16000,
];

// Bandas de frequência 1/3 oitava (conforme ISO 16283) - até 3150 Hz
const FREQUENCY_BANDS_13: number[] = [
  100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000,
  2500, 3150,
];

interface AcousticMeasurement {
  bands_11_hz: number[];
  lp_sf_11?: number[][]; // Pressão sonora sala fonte (Airborne)
  lp_sr_11?: number[][]; // Pressão sonora sala recepção
  lp_ext_11?: number[][]; // Pressão sonora externa (Facade)
  lp_int_11?: number[][]; // Pressão sonora interna (Facade)
  bands_13_hz: number[];
  tr_13_rec?: number[][]; // Tempos de reverberação
  geometric: {
    s_area: number;
    v_room: number;
    t0?: number;
    a0?: number;
  };
  curva_ref?: number[];
  limite?: number;
}

interface ApiResponse {
  standard: string;
  measurement_type: string;
  results: Record<string, any>;
  detailed_results: Array<{
    F_Hz: number;
    [key: string]: any;
  }>;
  frequency_bands_hz: number[];
}

/**
 * Filtra dados de frequência, removendo apenas os zeros
 * Mantém as frequências e valores exatamente como preenchidos pelo usuário
 */
function filterValidFrequencyData(data: FrequencyData[]): {
  frequencies: number[];
  values: number[];
} {
  const valid = data.filter(
    (d) => d.value > 0 && d.value >= 20 && d.value <= 100,
  );

  return {
    frequencies: valid.map((d) => d.frequency),
    values: valid.map((d) => d.value),
  };
}

/**
 * Interpola dados de frequência para as bandas padrão
 * Se não houver dados exatos para a banda, retorna 0
 */
function interpolateFrequencyData(
  data: FrequencyData[],
  targetBands: number[],
): number[] {
  return targetBands.map((freq) => {
    const found = data.find((d) => d.frequency === freq);
    // Validar que o valor está dentro do intervalo físico (20-100 dB para som)
    if (found && found.value > 0 && found.value >= 20 && found.value <= 100) {
      return found.value;
    }
    // Retorna 0 se valor inválido ou não encontrado
    return 0;
  });
}

/**
 * Cria matriz de medições (múltiplas leituras) a partir de dados únicos
 * O backend espera múltiplas medições, aqui enviamos uma única leitura
 */
function createMeasurementMatrix(data: FrequencyData[]): number[][] {
  return [interpolateFrequencyData(data, FREQUENCY_BANDS_11)];
}

/**
 * Cria matriz de TR60 para bandas 1/3 oitava
 * Se não houver dados, usa valores padrão realistas (ISO 16283)
 */
function createTR60Matrix(data: FrequencyData[]): number[][] {
  if (!data || data.length === 0) {
    // Valores padrão ISO 16283: reverberação típica em sala de teste
    // 16 bandas 1/3 oitava até 3150 Hz
    const defaultTR60: number[] = [
      0.45, 0.48, 0.52, 0.5, 0.48, 0.46, 0.44, 0.42, 0.4, 0.38, 0.36, 0.35,
      0.34, 0.33, 0.33, 0.34,
    ];
    return [defaultTR60];
  }
  return [interpolateFrequencyData(data, FREQUENCY_BANDS_13)];
}

/**
 * POST /api/acoustic/airborne/wall
 * Isolamento acústico de paredes - sons aéreos
 */
export async function calculateAirborneWall(
  npsSf: FrequencyData[], // NPS sala fonte
  npsSr: FrequencyData[], // NPS sala recepção
  partitionArea: number,
  receptionVolume: number,
  roomAbsorption: number | null,
  tr60Bands: FrequencyData[] | null,
): Promise<ApiResponse> {
  // Filtrar dados válidos do usuário (remover zeros)
  const sfFiltered = filterValidFrequencyData(npsSf);
  const srFiltered = filterValidFrequencyData(npsSr);

  // Se há dados de TR60, filtra; senão usa os valores padrão
  let tr60Filtered: { frequencies: number[]; values: number[] };
  if (tr60Bands && tr60Bands.some((b) => b.value > 0)) {
    tr60Filtered = filterValidFrequencyData(tr60Bands);
  } else {
    // Usa valores padrão ISO 16283
    tr60Filtered = {
      frequencies: FREQUENCY_BANDS_13,
      values: createTR60Matrix([])[0],
    };
  }

  const payload: AcousticMeasurement = {
    bands_11_hz: sfFiltered.frequencies,
    lp_sf_11: [sfFiltered.values],
    lp_sr_11: [srFiltered.values],
    bands_13_hz: tr60Filtered.frequencies,
    tr_13_rec: [tr60Filtered.values],
    geometric: createGeometricData(
      partitionArea,
      receptionVolume,
      roomAbsorption,
    ),
  };

  const response = await fetch(`${API_BASE_URL}/api/acoustic/airborne/wall`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Erro ao calcular isolamento de paredes");
  }

  return response.json();
}

/**
 * POST /api/acoustic/airborne/facade
 * Isolamento acústico de fachadas - sons aéreos
 */
export async function calculateAirborneFacade(
  npsExt: FrequencyData[], // NPS externo
  npsInt: FrequencyData[], // NPS interno
  facadeArea: number,
  receptionVolume: number,
  roomAbsorption: number | null,
  tr60Bands: FrequencyData[] | null,
): Promise<ApiResponse> {
  // Filtrar dados válidos do usuário (remover zeros)
  const extFiltered = filterValidFrequencyData(npsExt);
  const intFiltered = filterValidFrequencyData(npsInt);

  // Se há dados de TR60, filtra; senão usa os valores padrão
  let tr60Filtered: { frequencies: number[]; values: number[] };
  if (tr60Bands && tr60Bands.some((b) => b.value > 0)) {
    tr60Filtered = filterValidFrequencyData(tr60Bands);
  } else {
    // Usa valores padrão ISO 16283
    tr60Filtered = {
      frequencies: FREQUENCY_BANDS_13,
      values: createTR60Matrix([])[0],
    };
  }

  const payload: AcousticMeasurement = {
    bands_11_hz: extFiltered.frequencies,
    lp_ext_11: [extFiltered.values],
    lp_int_11: [intFiltered.values],
    bands_13_hz: tr60Filtered.frequencies,
    tr_13_rec: [tr60Filtered.values],
    geometric: createGeometricData(facadeArea, receptionVolume, roomAbsorption),
  };

  const response = await fetch(`${API_BASE_URL}/api/acoustic/airborne/facade`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Erro ao calcular isolamento de fachada");
  }

  return response.json();
}

/**
 * POST /api/acoustic/impact/slab
 * Isolamento acústico de lajes - sons de impacto
 */
export async function calculateImpactSlab(
  npsSr: FrequencyData[], // NPS sala recepção
  slabArea: number,
  receptionVolume: number,
  roomAbsorption: number | null,
  tr60Bands: FrequencyData[] | null,
): Promise<ApiResponse> {
  // Filtrar dados válidos do usuário (sem zeros)
  const srFiltered = filterValidFrequencyData(npsSr);
  const tr60Filtered = tr60Bands
    ? filterValidFrequencyData(tr60Bands)
    : { frequencies: FREQUENCY_BANDS_13, values: createTR60Matrix([])[0] };

  const payload: AcousticMeasurement = {
    bands_11_hz: srFiltered.frequencies,
    lp_sr_11: [srFiltered.values],
    bands_13_hz: tr60Filtered.frequencies,
    tr_13_rec: [tr60Filtered.values],
    geometric: createGeometricData(slabArea, receptionVolume, roomAbsorption),
  };

  const response = await fetch(`${API_BASE_URL}/api/acoustic/impact/slab`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Erro ao calcular isolamento de impacto");
  }

  return response.json();
}

/**
 * Cria o objeto de dados geométricos do recinto
 */
function createGeometricData(
  facadeArea: number,
  receptionVolume: number,
  roomAbsorption: number | null,
) {
  return {
    s_area: facadeArea,
    v_room: receptionVolume,
    // Prioridade: roomAbsorption > cálculo de T0 > valor padrão
    ...(roomAbsorption && roomAbsorption > 0
      ? { a0: roomAbsorption }
      : { t0: 0.5, a0: 10.0 }),
  };
}

/**
 * Processa a resposta do backend e extrai os valores principais
 */
export function extractMainMetrics(
  response: ApiResponse,
  testType: TestType,
): Record<string, number> {
  const metrics: Record<string, number> = {};

  if (testType === "aereo_parede") {
    metrics["DnT,w"] = response.results.DnT_w?.value || 0;
    metrics["R'w"] = response.results.R_prime_w?.value || 0;
  } else if (testType === "aereo_fachada") {
    metrics["D2m,nT,w"] = response.results.D2m_nT_w?.value || 0;
    metrics["D2m,n,w"] = response.results.D2m_n_w?.value || 0;
    metrics["R'45,w"] = response.results.R_prime_45_w?.value || 0;
  } else if (testType === "impacto_laje") {
    metrics["L'nT,w"] = response.results.L_prime_nT_w?.value || 0;
    metrics["L'n,w"] = response.results.L_prime_n_w?.value || 0;
  }

  return metrics;
}

/**
 * Valida que os dados de frequência têm valores válidos
 * Retorna true se há pelo menos 3 bandas com valores entre 20-100 dB
 */
function validateFrequencyData(data: FrequencyData[]): boolean {
  const validValues = data.filter(
    (b) => b.value > 0 && b.value >= 20 && b.value <= 100,
  );
  return validValues.length >= 3;
}

/**
 * Filtra dados de frequência, removendo valores inválidos
 */
function sanitizeFrequencyData(data: FrequencyData[]): FrequencyData[] {
  return data.filter((b) => b.value > 0 && b.value >= 20 && b.value <= 100);
}

/**
 * Função genérica para calcular baseado no tipo de teste
 */
export async function calculateAcoustic(
  testType: TestType,
  npsData1: FrequencyData[] | null,
  npsData2: FrequencyData[],
  partitionArea: number | null,
  receptionVolume: number,
  roomAbsorption: number | null,
  tr60Bands: FrequencyData[] | null,
): Promise<ApiResponse> {
  try {
    // Validar dados de entrada
    if (testType !== "impacto_laje" && !validateFrequencyData(npsData1 || [])) {
      throw new Error(
        "NPS da sala fonte deve ter pelo menos 3 bandas com valores entre 20-100 dB",
      );
    }

    if (!validateFrequencyData(npsData2)) {
      throw new Error(
        "NPS da sala recepção deve ter pelo menos 3 bandas com valores entre 20-100 dB",
      );
    }

    // Sanitizar dados (remover valores inválidos)
    const cleanNpsData1 = npsData1 ? sanitizeFrequencyData(npsData1) : null;
    const cleanNpsData2 = sanitizeFrequencyData(npsData2);
    const cleanTr60Bands = tr60Bands ? sanitizeFrequencyData(tr60Bands) : null;

    if (testType === "aereo_parede") {
      if (!cleanNpsData1) throw new Error("NPS da sala fonte é obrigatório");
      return await calculateAirborneWall(
        cleanNpsData1,
        cleanNpsData2,
        partitionArea || 0,
        receptionVolume,
        roomAbsorption,
        cleanTr60Bands,
      );
    } else if (testType === "aereo_fachada") {
      if (!cleanNpsData1) throw new Error("NPS externo é obrigatório");
      return await calculateAirborneFacade(
        cleanNpsData1,
        cleanNpsData2,
        partitionArea || 0,
        receptionVolume,
        roomAbsorption,
        cleanTr60Bands,
      );
    } else if (testType === "impacto_laje") {
      return await calculateImpactSlab(
        cleanNpsData2,
        partitionArea || 0,
        receptionVolume,
        roomAbsorption,
        cleanTr60Bands,
      );
    }
    throw new Error("Tipo de teste desconhecido");
  } catch (error) {
    console.error("Erro ao calcular acústica:", error);
    throw error;
  }
}

/**
 * Registra um novo usuário no backend
 * POST /api/auth/register
 */
export async function registerUser(
  fullName: string,
  email: string,
  password: string,
): Promise<{
  success: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.message || errorData.detail || "Erro ao registrar usuário",
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: "Usuário registrado com sucesso",
      user: data.user,
    };
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return {
      success: false,
      error: "Erro ao processar registro. Tente novamente mais tarde.",
    };
  }
}

export { ApiResponse };
