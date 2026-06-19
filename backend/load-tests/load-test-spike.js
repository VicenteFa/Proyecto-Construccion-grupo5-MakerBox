import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '5s', target: 50 },
    { duration: '15s', target: 50 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(90)<3000'],
    errors: ['rate<0.05'],
  },
};

const BASE_URL = 'http://localhost:3000/api';

// AUTO-LOGIN: Si no viene un token por variable, lo busca Ã©l mismo.
export function setup() {
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      correo: 'testqa@utalca.cl',
      passUsuario: 'testqa123',
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  if (loginRes.status !== 201 && loginRes.status !== 200) {
    throw new Error('Fallo al loguearse en setup(): ' + loginRes.body);
  }

  return { token: loginRes.json('token') };
}

// EL TEST: Recibe el token del setup
export default function (data) {
  const randomId = Math.floor(Math.random() * 1000000);

  // FormData para enviar archivos y cumplir con el DTO
  const fd = {
    solicitanteNombre: 'Test',
    solicitanteApellido: 'QA',
    solicitanteCorreo: 'testqa@utalca.cl',
    solicitanteRut: '99999999-9',
    tipoUsuario: 'ESTUDIANTE',
    tipoSolicitud: 'Prueba de Carga',

    colorOpcion1: 'Rojo',
    colorOpcion2: 'Azul',
    colorOpcion3: 'Negro',
    comentario: `Prueba K6 - ${randomId}`,

    modelo3d: http.file('contenido 3D', 'prueba3d.obj', 'application/octet-stream'),
    modeloStl: http.file('contenido STL', 'prueba.stl', 'application/sla'),
  };

  const params = {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  };

  const resImpresion = http.post(`${BASE_URL}/impresiones`, fd, params);

  const checkImpresion = check(resImpresion, {
    'Status 201': (r) => r.status === 201,
  });

  if (!checkImpresion) {
    console.log(`Error: ${resImpresion.status} - ${resImpresion.body}`);
  }

  errorRate.add(!checkImpresion);
  sleep(0.5);
}

export function handleSummary(data) {
  return {
    'load-tests/reporte-spike.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
