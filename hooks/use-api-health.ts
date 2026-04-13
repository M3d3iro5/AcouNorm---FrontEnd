// Hook para verificar saúde da API
"use client";

import { useState, useEffect } from "react";
import { checkApiHealth, HealthStatus } from "@/lib/api-health";

export function useApiHealth() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      setIsChecking(true);
      const status = await checkApiHealth();
      setHealth(status);
      setIsChecking(false);
    };

    // Verificar uma vez ao montar
    checkHealth();

    // Verificar a cada 30 segundos
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  return { health, isChecking };
}
