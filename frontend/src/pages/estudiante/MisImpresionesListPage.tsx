import { Badge, Card, Col, Row, Tag, Typography, Spin, Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useImpresiones } from '../../features/impresiones/hooks/useImpresiones';

const { Title, Text } = Typography;

interface ImpresionConNotificacion {
  idImpresion: string;
  estado: 'PENDIENTE' | 'IMPRIMIENDO' | 'FINALIZADA' | 'RECHAZADA';
  colorOpcion1: string;
  colorOpcion2: string;
  colorOpcion3: string;
  comentario: string;
  creadoEn: string;
  observacionAyudante?: string;
  motivoRechazo?: string;
  esNuevo?: boolean;
}

const coloresEstado: Record<string, string> = {
  PENDIENTE: 'orange',
  IMPRIMIENDO: 'blue',
  FINALIZADA: 'green',
  RECHAZADA: 'red',
};

const etiquetasEstado: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  IMPRIMIENDO: 'Imprimiendo',
  FINALIZADA: 'Finalizada',
  RECHAZADA: 'Rechazada',
};

export const MisImpresionesListPage = () => {
  const { impresiones, isLoading, obtenerMisImpresiones } = useImpresiones();

  const impresionesNuevas = impresiones.filter(
    (imp: ImpresionConNotificacion) => imp.esNuevo,
  ).length;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Mis Impresiones
        </Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Badge count={impresionesNuevas} offset={[-4, 4]}>
            <BellOutlined style={{ fontSize: 24, cursor: 'pointer' }} />
          </Badge>
          <Button onClick={obtenerMisImpresiones}>Actualizar</Button>
        </div>
      </div>

      {impresiones.length === 0 ? (
        <Card>
          <Text type="secondary">No tienes solicitudes de impresión aún.</Text>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {impresiones.map((imp: ImpresionConNotificacion) => (
            <Col xs={24} md={12} key={imp.idImpresion}>
              <Badge.Ribbon
                text={imp.esNuevo ? '¡Actualizado!' : ''}
                color="volcano"
                style={{ display: imp.esNuevo ? 'block' : 'none' }}
              >
                <Card
                  style={{
                    borderLeft: imp.esNuevo ? '4px solid #ff4d4f' : '4px solid transparent',
                    transition: 'border 0.3s',
                  }}
                >
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}
                  >
                    <Tag color={coloresEstado[imp.estado]}>{etiquetasEstado[imp.estado]}</Tag>
                    {imp.esNuevo && (
                      <Tag color="volcano" icon={<BellOutlined />}>
                        Estado actualizado
                      </Tag>
                    )}
                  </div>

                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Fecha: {new Date(imp.creadoEn).toLocaleDateString('es-CL')}
                  </Text>

                  <div style={{ marginTop: 8 }}>
                    <Text strong>Colores: </Text>
                    <Text>
                      {imp.colorOpcion1} / {imp.colorOpcion2} / {imp.colorOpcion3}
                    </Text>
                  </div>

                  {imp.comentario && (
                    <div style={{ marginTop: 4 }}>
                      <Text strong>Comentario: </Text>
                      <Text>{imp.comentario}</Text>
                    </div>
                  )}

                  {imp.observacionAyudante && (
                    <div style={{ marginTop: 4 }}>
                      <Text strong>Observación ayudante: </Text>
                      <Text>{imp.observacionAyudante}</Text>
                    </div>
                  )}

                  {imp.motivoRechazo && (
                    <div style={{ marginTop: 4 }}>
                      <Text strong type="danger">
                        Motivo rechazo:{' '}
                      </Text>
                      <Text type="danger">{imp.motivoRechazo}</Text>
                    </div>
                  )}
                </Card>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};
