/**
 * Dados de Teste para Validação Manual
 * Use estes dados para testar a API localmente
 */

export const TEST_PAYLOADS = {
  airborneWall: {
    description: "Isolamento acústico de parede - ISO 16283-1",
    endpoint: "POST /api/acoustic/airborne/wall",
    payload: {
      bands_11_hz: [125, 250, 500, 1000, 2000, 4000, 8000, 16000],
      lp_sf_11: [[78.2, 79.1, 80.3, 81.5, 82.0, 81.2, 79.8, 78.5]],
      lp_sr_11: [[45.3, 46.2, 47.8, 49.1, 50.2, 49.5, 48.1, 46.8]],
      bands_13_hz: [
        100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600,
        2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000,
      ],
      tr_13_rec: [
        [
          0.8, 0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4,
          1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9, 1.95,
        ],
      ],
      geometric: {
        s_area: 12.5,
        v_room: 36,
        t0: 0.5,
        a0: 10.0,
      },
    },
    expectedResult: {
      metric: "DnT,w",
      approx: "47 dB",
      description: "Diferença de nível padronizada ponderada",
    },
  },

  airborneFacade: {
    description: "Isolamento acústico de fachada - ISO 16283-3",
    endpoint: "POST /api/acoustic/airborne/facade",
    payload: {
      bands_11_hz: [125, 250, 500, 1000, 2000, 4000, 8000, 16000],
      lp_ext_11: [[72.5, 73.2, 74.8, 76.1, 77.2, 76.5, 75.1, 73.8]],
      lp_int_11: [[42.3, 43.2, 44.8, 46.1, 47.2, 46.5, 45.1, 43.8]],
      bands_13_hz: [
        100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600,
        2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000,
      ],
      tr_13_rec: [
        [
          0.8, 0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4,
          1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9, 1.95,
        ],
      ],
      geometric: {
        s_area: 8.2,
        v_room: 28,
        t0: 0.5,
        a0: 10.0,
      },
    },
    expectedResult: {
      metric: "D2m,nT,w",
      approx: "32 dB",
      description: "Diferença de nível padronizada a 2m",
    },
  },

  impactSlab: {
    description: "Isolamento acústico de laje - ISO 16283-2",
    endpoint: "POST /api/acoustic/impact/slab",
    payload: {
      bands_11_hz: [125, 250, 500, 1000, 2000, 4000, 8000, 16000],
      lp_sr_11: [[62.5, 63.2, 64.8, 66.1, 67.2, 66.5, 65.1, 63.8]],
      bands_13_hz: [
        100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600,
        2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000,
      ],
      tr_13_rec: [
        [
          0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5,
          1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9, 1.95, 2.0, 2.05,
        ],
      ],
      geometric: {
        s_area: 15.0,
        v_room: 42,
        t0: 0.5,
        a0: 10.0,
      },
    },
    expectedResult: {
      metric: "L'nT,w",
      approx: "58 dB",
      description: "Nível de pressão sonora de impacto padronizado ponderado",
    },
  },
};

/**
 * Exemplos de requisições CURL para testar
 */
export const CURL_EXAMPLES = {
  testHealth: `curl -X GET http://localhost:8000/health`,

  airborneWall: `curl -X POST http://localhost:8000/api/acoustic/airborne/wall \\
  -H "Content-Type: application/json" \\
  -d '{
    "bands_11_hz": [125, 250, 500, 1000, 2000, 4000, 8000, 16000],
    "lp_sf_11": [[78.2, 79.1, 80.3, 81.5, 82.0, 81.2, 79.8, 78.5]],
    "lp_sr_11": [[45.3, 46.2, 47.8, 49.1, 50.2, 49.5, 48.1, 46.8]],
    "bands_13_hz": [100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000],
    "tr_13_rec": [[0.8, 0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9, 1.95]],
    "geometric": {
      "s_area": 12.5,
      "v_room": 36,
      "t0": 0.5,
      "a0": 10.0
    }
  }'`,

  airborneFacade: `curl -X POST http://localhost:8000/api/acoustic/airborne/facade \\
  -H "Content-Type: application/json" \\
  -d '{
    "bands_11_hz": [125, 250, 500, 1000, 2000, 4000, 8000, 16000],
    "lp_ext_11": [[72.5, 73.2, 74.8, 76.1, 77.2, 76.5, 75.1, 73.8]],
    "lp_int_11": [[42.3, 43.2, 44.8, 46.1, 47.2, 46.5, 45.1, 43.8]],
    "bands_13_hz": [100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000],
    "tr_13_rec": [[0.8, 0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9, 1.95]],
    "geometric": {
      "s_area": 8.2,
      "v_room": 28,
      "t0": 0.5,
      "a0": 10.0
    }
  }'`,

  impactSlab: `curl -X POST http://localhost:8000/api/acoustic/impact/slab \\
  -H "Content-Type: application/json" \\
  -d '{
    "bands_11_hz": [125, 250, 500, 1000, 2000, 4000, 8000, 16000],
    "lp_sr_11": [[62.5, 63.2, 64.8, 66.1, 67.2, 66.5, 65.1, 63.8]],
    "bands_13_hz": [100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000],
    "tr_13_rec": [[0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9, 1.95, 2.0, 2.05]],
    "geometric": {
      "s_area": 15.0,
      "v_room": 42,
      "t0": 0.5,
      "a0": 10.0
    }
  }'`,
};

/**
 * Checklist de validação
 */
export const VALIDATION_CHECKLIST = [
  {
    item: "Node.js instalado",
    command: "node -v",
    expectedOutput: "v18.0.0 ou superior",
  },
  {
    item: "Dependências instaladas",
    command: "npm list",
    expectedOutput: "Sem erros",
  },
  {
    item: ".env.local configurado",
    command: "cat .env.local",
    expectedOutput: "NEXT_PUBLIC_API_URL=http://localhost:8000",
  },
  {
    item: "Backend online",
    command: "curl http://localhost:8000/health",
    expectedOutput: "Status 200",
  },
  {
    item: "Frontend rodando",
    command: "npm run dev",
    expectedOutput: "Ready in ...",
  },
  {
    item: "Página carrega",
    command: "Abra http://localhost:3000",
    expectedOutput: "Sem erros 404",
  },
];
