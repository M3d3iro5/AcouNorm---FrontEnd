// Health Check para verificar conexão com o backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface HealthStatus {
  status: "ok" | "error";
  serverUrl: string;
  message: string;
  timestamp: string;
}

/**
 * Verifica se o servidor backend está disponível
 */
export async function checkApiHealth(): Promise<HealthStatus> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {
        status: "error",
        serverUrl: API_BASE_URL,
        message: `Servidor respondeu com status ${response.status}`,
        timestamp: new Date().toISOString(),
      };
    }

    const data = await response.json();
    return {
      status: "ok",
      serverUrl: API_BASE_URL,
      message: `Backend online e pronto para processar cálculos acústicos`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    return {
      status: "error",
      serverUrl: API_BASE_URL,
      message: `Impossível conectar ao servidor: ${errorMessage}`,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Hook para verificar saúde da API com retry
 */
export async function checkApiHealthWithRetry(
  maxAttempts: number = 3,
  delayMs: number = 1000,
): Promise<HealthStatus> {
  let lastError: HealthStatus | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const status = await checkApiHealth();

    if (status.status === "ok") {
      return status;
    }

    lastError = status;

    if (attempt < maxAttempts) {
      // Aguardar antes de tentar novamente
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return (
    lastError || {
      status: "error",
      serverUrl: API_BASE_URL,
      message: "Falha ao conectar após múltiplas tentativas",
      timestamp: new Date().toISOString(),
    }
  );
}
