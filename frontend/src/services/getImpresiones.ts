import type { IImpresion } from '../constants/IImpresion';

const API_URL = 'http://localhost:3000/api/impresiones';

export const obtenerTodasLasImpresiones = async (): Promise<IImpresion[]> => {
  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    //Mapeamos los datos para una transformación
    const impresionesFormateadas: IImpresion[] = datos.map((item: IImpresion) => ({
      ...item,
      //Trasnformamos el string a un Date, si esta nulo lo dejamos como null
      inicioImpresion: item.inicioImpresion ? new Date(item.inicioImpresion) : null,
      creadoEn: new Date(item.creadoEn),
    }));

    return impresionesFormateadas;
  } catch (error) {
    console.error('Error al obtener las impresiones desde el servicio:', error);
    throw error;
  }
};
