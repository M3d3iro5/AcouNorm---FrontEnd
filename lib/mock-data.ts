import { TestHistory, TestResult, FrequencyData, FREQUENCY_BANDS } from './types'

// Dados mockados de histórico
export const mockTestHistory: TestHistory[] = [
  {
    id: '1',
    projectName: 'Edifício Aurora',
    testCode: 'AUR-001',
    testType: 'aereo_parede',
    date: '2024-03-15',
    status: 'completed',
    mainResult: "R'w = 45 dB"
  },
  {
    id: '2',
    projectName: 'Edifício Aurora',
    testCode: 'AUR-002',
    testType: 'impacto_laje',
    date: '2024-03-15',
    status: 'completed',
    mainResult: "L'nT,w = 58 dB"
  },
  {
    id: '3',
    projectName: 'Residencial Vista Mar',
    testCode: 'RVM-001',
    testType: 'aereo_fachada',
    date: '2024-03-10',
    status: 'completed',
    mainResult: 'D2m,nT,w = 32 dB'
  },
  {
    id: '4',
    projectName: 'Torre Norte',
    testCode: 'TN-003',
    testType: 'aereo_parede',
    date: '2024-03-08',
    status: 'draft'
  },
  {
    id: '5',
    projectName: 'Hotel Central',
    testCode: 'HC-015',
    testType: 'impacto_laje',
    date: '2024-03-05',
    status: 'error'
  }
]

// Gerar dados de frequência mockados para gráficos
export function generateMockFrequencyData(baseValue: number, variation: number = 5): FrequencyData[] {
  return FREQUENCY_BANDS.map((freq) => ({
    frequency: freq,
    value: baseValue + (Math.random() - 0.5) * variation * 2
  }))
}

// Resultados mockados por tipo de ensaio
export const mockResults: Record<string, TestResult> = {
  aereo_parede: {
    id: 'result-001',
    testType: 'aereo_parede',
    metrics: [
      { name: 'DnT', value: 48.2, unit: 'dB', description: 'Diferença padronizada de nível' },
      { name: "R'", value: 45.5, unit: 'dB', description: 'Índice de redução sonora aparente' },
      { name: 'DnT,w', value: 47, unit: 'dB', description: 'Diferença padronizada de nível ponderada' },
      { name: "R'w", value: 45, unit: 'dB', description: 'Índice de redução sonora aparente ponderado' }
    ],
    frequencyData: generateMockFrequencyData(45),
    classification: 'Classe B - Bom desempenho acústico',
    status: 'success',
    processedAt: new Date().toISOString()
  },
  aereo_fachada: {
    id: 'result-002',
    testType: 'aereo_fachada',
    metrics: [
      { name: 'D2m,nT', value: 33.5, unit: 'dB', description: 'Diferença de nível padronizada a 2m' },
      { name: 'D2m,n', value: 31.2, unit: 'dB', description: 'Diferença de nível normalizada a 2m' },
      { name: "R'45°", value: 28.8, unit: 'dB', description: 'Índice de redução sonora aparente a 45°' },
      { name: 'D2m,nT,w', value: 32, unit: 'dB', description: 'Diferença padronizada ponderada a 2m' },
      { name: 'D2m,n,w', value: 30, unit: 'dB', description: 'Diferença normalizada ponderada a 2m' }
    ],
    frequencyData: generateMockFrequencyData(32),
    classification: 'Classe C - Desempenho mínimo aceitável',
    status: 'success',
    processedAt: new Date().toISOString()
  },
  impacto_laje: {
    id: 'result-003',
    testType: 'impacto_laje',
    metrics: [
      { name: "L'nT", value: 56.3, unit: 'dB', description: 'Nível de pressão sonora de impacto padronizado' },
      { name: "L'n", value: 58.1, unit: 'dB', description: 'Nível de pressão sonora de impacto normalizado' },
      { name: "L'nT,w", value: 58, unit: 'dB', description: 'Nível padronizado ponderado de impacto' }
    ],
    frequencyData: generateMockFrequencyData(58, 8),
    classification: 'Classe B - Bom desempenho acústico',
    status: 'success',
    processedAt: new Date().toISOString()
  }
}

// Simular chamada de API
export async function mockApiCall<T>(data: T, delay: number = 1500): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

// Simular login
export async function mockLogin(email: string, password: string): Promise<{ success: boolean; user?: { id: string; email: string; name: string } }> {
  await mockApiCall(null, 1000)
  
  if (email && password.length >= 6) {
    return {
      success: true,
      user: {
        id: 'user-001',
        email,
        name: email.split('@')[0]
      }
    }
  }
  
  return { success: false }
}

// Simular cálculo
export async function mockCalculate(testType: string): Promise<TestResult> {
  await mockApiCall(null, 2000)
  return mockResults[testType] || mockResults.aereo_parede
}

// Payloads de exemplo para documentação
export const examplePayloads = {
  aereo_parede: {
    tipo: 'aereo_parede',
    area_particao: 12.5,
    volume_recepcao: 36,
    absorcao_recinto: null,
    tr60: 1.9,
    nps_sala_fonte: [78.2, 79.1, 80.3, 81.5, 82.0, 81.2, 79.8, 78.5, 77.2, 75.8, 74.1, 72.5, 70.8, 69.2, 67.5, 65.8],
    nps_sala_recepcao: [45.3, 46.2, 47.8, 49.1, 50.2, 49.5, 48.1, 46.8, 45.2, 43.8, 42.1, 40.5, 38.8, 37.2, 35.5, 33.8]
  },
  aereo_fachada: {
    tipo: 'aereo_fachada',
    area_fachada: 8.2,
    volume_recepcao: 28,
    absorcao_recinto: 6.5,
    tr60: null,
    nps_externo: [72.5, 73.2, 74.8, 76.1, 77.2, 76.5, 75.1, 73.8, 72.2, 70.8, 69.1, 67.5, 65.8, 64.2, 62.5, 60.8],
    nps_interno: [42.3, 43.2, 44.8, 46.1, 47.2, 46.5, 45.1, 43.8, 42.2, 40.8, 39.1, 37.5, 35.8, 34.2, 32.5, 30.8]
  },
  impacto_laje: {
    tipo: 'impacto_laje',
    volume_recepcao: 42,
    absorcao_recinto: null,
    tr60: 2.1,
    nps_sala_recepcao: [62.5, 63.2, 64.8, 66.1, 67.2, 66.5, 65.1, 63.8, 62.2, 60.8, 59.1, 57.5, 55.8, 54.2, 52.5, 50.8]
  }
}
