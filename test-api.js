#!/usr/bin/env node

/**
 * Teste de conectividade e validação de API
 * Uso: node test-api.js
 */

const http = require("http");
const https = require("https");

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Cores para terminal
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function delimiter() {
  log(colors.cyan, "=".repeat(60));
}

async function testHealth() {
  log(colors.blue, "\n[1/3] Testando Health Check...");

  return new Promise((resolve) => {
    const url = new URL("/health", API_URL);
    const client = url.protocol === "https:" ? https : http;

    const request = client.get(url, (response) => {
      if (response.statusCode === 200) {
        log(colors.green, "✓ Health check passou");
        resolve(true);
      } else {
        log(colors.yellow, `⚠ Status ${response.statusCode}`);
        resolve(false);
      }
    });

    request.on("error", (error) => {
      log(colors.red, `✗ Erro: ${error.message}`);
      resolve(false);
    });

    request.setTimeout(5000, () => {
      request.destroy();
      log(colors.red, "✗ Timeout na conexão");
      resolve(false);
    });
  });
}

async function testAirborneWall() {
  log(colors.blue, "\n[2/3] Testando endpoint /api/acoustic/airborne/wall...");

  const payload = {
    bands_11_hz: [125, 250, 500, 1000, 2000, 4000, 8000, 16000],
    lp_sf_11: [[78.2, 79.1, 80.3, 81.5, 82.0, 81.2, 79.8, 78.5]],
    lp_sr_11: [[45.3, 46.2, 47.8, 49.1, 50.2, 49.5, 48.1, 46.8]],
    bands_13_hz: [
      100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000,
      2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000,
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
  };

  return new Promise((resolve) => {
    const url = new URL("/api/acoustic/airborne/wall", API_URL);
    const client = url.protocol === "https:" ? https : http;
    const data = JSON.stringify(payload);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    };

    const request = client.request(url, options, (response) => {
      let body = "";
      response.on("data", (chunk) => {
        body += chunk;
      });

      response.on("end", () => {
        try {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            const result = JSON.parse(body);
            if (result.results && result.results.DnT_w) {
              log(colors.green, "✓ Cálculo de parede funcionando");
              log(colors.green, `  DnT,w = ${result.results.DnT_w.value} dB`);
              resolve(true);
            } else {
              log(colors.yellow, "⚠ Resposta sem dados esperados");
              resolve(false);
            }
          } else {
            log(colors.red, `✗ Status ${response.statusCode}`);
            log(colors.yellow, `  ${body}`);
            resolve(false);
          }
        } catch (error) {
          log(colors.red, `✗ Erro ao analisar resposta: ${error.message}`);
          resolve(false);
        }
      });
    });

    request.on("error", (error) => {
      log(colors.red, `✗ Erro: ${error.message}`);
      resolve(false);
    });

    request.setTimeout(10000, () => {
      request.destroy();
      log(colors.red, "✗ Timeout");
      resolve(false);
    });

    request.write(data);
    request.end();
  });
}

async function testApiUrl() {
  log(colors.blue, "\n[3/3] Verificando configuração...");
  log(colors.cyan, `API URL: ${API_URL}`);

  const url = new URL(API_URL);
  const baseUrl = `${url.protocol}//${url.host}`;

  return new Promise((resolve) => {
    const client = url.protocol === "https:" ? https : http;

    const request = client.get(baseUrl, (response) => {
      if (response.statusCode < 500) {
        log(colors.green, "✓ Servidor respondendo");
        resolve(true);
      } else {
        log(colors.yellow, "⚠ Servidor respondendo com erro");
        resolve(false);
      }
    });

    request.on("error", (error) => {
      log(colors.red, `✗ Não foi possível conectar: ${error.message}`);
      resolve(false);
    });

    request.setTimeout(5000, () => {
      request.destroy();
      log(colors.red, "✗ Timeout na conexão");
      resolve(false);
    });
  });
}

async function main() {
  delimiter();
  log(colors.cyan, "  Teste de Conectividade - AcouNorm");
  delimiter();

  const results = {
    health: false,
    airborne: false,
    url: false,
  };

  results.url = await testApiUrl();
  if (results.url) {
    results.health = await testHealth();
    if (results.health) {
      results.airborne = await testAirborneWall();
    }
  }

  delimiter();
  log(colors.cyan, "  Resumo dos Testes");
  delimiter();

  console.log(`
Health Check:        ${results.health ? colors.green + "✓ OK" : colors.red + "✗ FALHA"}${colors.reset}
API URL:            ${results.url ? colors.green + "✓ OK" : colors.red + "✗ FALHA"}${colors.reset}
Cálculo de Parede:   ${results.airborne ? colors.green + "✓ OK" : colors.red + "✗ FALHA"}${colors.reset}
  `);

  if (results.health && results.url && results.airborne) {
    log(colors.green, "✓ Tudo funcionando corretamente!");
    delimiter();
    process.exit(0);
  } else {
    log(colors.red, "✗ Alguns testes falharam. Verifique o backend.");
    delimiter();
    process.exit(1);
  }
}

main().catch((error) => {
  log(colors.red, `Erro: ${error.message}`);
  process.exit(1);
});
