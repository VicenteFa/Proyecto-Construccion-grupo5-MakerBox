/* eslint-disable */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

const errorRate = new Rate('errors');

// Configuración de la Prueba de Picos
export const options = {
  stages: [
    { duration: '5s', target: 50 }, // Salto violento de 0 a 50 usuarios en 5s
    { duration: '15s', target: 50 }, // Mantener el bombardeo por 15s
    { duration: '5s', target: 0 }, // Caída rápida a la normalidad en 5s
  ],
  thresholds: {
    http_req_duration: ['p(90)<3000'], // Tolerar hasta 3s durante el caos del pico
    errors: ['rate<0.05'], // Max 5% de error
  },
};

const BASE_URL = 'http://localhost:3000/api';

export default function () {
  const randomId = Math.floor(Math.random() * 1000000);

  const data = {
    colorOpcion1: 'Rojo',
    colorOpcion2: 'Azul',
    colorOpcion3: 'Negro',
    comentario: `Solicitud de impresion masiva generada por k6 - ID ${randomId}`,

    // Primer archivo requerido
    modelo3d: http.file('simulacion de contenido 3D', 'prueba3d.obj', 'application/octet-stream'),

    // Segundo archivo requerido
    modeloStl: http.file('simulacion de contenido STL', 'prueba.stl', 'application/sla'),
  };

  const params = {
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEyNmJmMWMyLTQ2NzUtNDc4OS1iYjQwLTc4NThjZjRmOWQzMyIsImNvcnJlbyI6InRlc3RxYUB1dGFsY2EuY2wiLCJyb2wiOiJFU1RVRElBTlRFIiwiaWF0IjoxNzgxNzkyMzA2LCJleHAiOjE3ODE4MjExMDZ9.uMIGXudFJivHa-h60w4mC9bD9iD0VXyI7X42RyDmmic',
    },
  };

  // Lanzar el POST a impresiones
  const resImpresion = http.post(`${BASE_URL}/impresiones`, data, params);

  // Validar que se creo correctamente
  const checkImpresion = check(resImpresion, {
    'Impresión solicitada (Status 201)': (r) => r.status === 201,
  });

  errorRate.add(!checkImpresion);

  // Poco tiempo de espera para saturar el servidor
  sleep(0.5);
}

// Generar el reporte HTML automaticamente
export function handleSummary(data) {
  return {
    'test/reporte-spike.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
