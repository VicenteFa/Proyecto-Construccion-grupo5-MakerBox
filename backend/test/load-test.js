/* eslint-disable */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

const errorRate = new Rate('errors');

// Configuracion de la prueba
export const options = {
  stages: [
    { duration: '30s', target: 5 }, // Subir a 5 usuarios en 30s
    { duration: '1m', target: 10 }, // Subir a 10 usuarios en 1 minuto
    { duration: '30s', target: 0 }, // Bajar a 0 usuarios en 30s
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% de requests bajo 2 segundos
    errors: ['rate<0.05'], // Menos de 5% de errores
  },
};

const BASE_URL = 'http://localhost:3000/api';

// Datos de prueba
const loginData = JSON.stringify({
  correo: 'testqa@utalca.cl',
  passUsuario: 'testqa123',
});

export default function () {
  // Login
  const loginRes = http.post(`${BASE_URL}/auth/login`, loginData, {
    headers: { 'Content-Type': 'application/json' },
  });

  const loginOk = check(loginRes, {
    'login status 200 o 201': (r) => r.status === 200 || r.status === 201,
    'login retorna token': (r) => JSON.parse(r.body).token !== undefined,
  });

  errorRate.add(!loginOk);

  sleep(1); // Esperar 1 segundo entre iteraciones
}

export function handleSummary(data) {
  return {
    // Genera el archivo HTML
    'test/reporte.html': htmlReport(data),
    // Mantiene el resumen de texto en la consola
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
