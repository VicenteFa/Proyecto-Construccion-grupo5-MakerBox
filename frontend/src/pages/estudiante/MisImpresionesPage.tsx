import { useState } from 'react';
import { Form, Input, Button, Typography, Card, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useImpresiones } from '../../features/impresiones/hooks/useImpresiones';
import type { SubmitHandler } from 'react-hook-form';
import type { UploadFile } from 'antd/es/upload/interface';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Interfaz para definir los campos del formulario de solicitud de impresion 3D
interface SolicitudFormInputs {
  colorOpcion1: string;
  colorOpcion2: string;
  colorOpcion3: string;
  comentario: string;
}

const cardStyles = { maxWidth: 600, margin: '40px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };

// Componente principal para la pagina de solicitud de impresion 3D, donde los estudiantes pueden subir sus archivos y elegir opciones de color
export const MisImpresionesPage = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SolicitudFormInputs>(); // Inicializa el hook de react-hook-form para manejar el formulario de solicitud de impresion 3D
  const { enviarSolicitud, isSubmitting } = useImpresiones();

  const [file3d, setFile3d] = useState<File | null>(null);
  const [fileStl, setFileStl] = useState<File | null>(null);

  const onSubmit: SubmitHandler<SolicitudFormInputs> = async (data) => {
    if (!file3d || !fileStl) {
      message.warning('Debes subir ambos archivos de diseño y modelo final.');
      return;
    }

    const formData = new FormData();
    formData.append('modelo3d', file3d);
    formData.append('modeloStl', fileStl);
    formData.append('colorOpcion1', data.colorOpcion1);
    formData.append('colorOpcion2', data.colorOpcion2);
    formData.append('colorOpcion3', data.colorOpcion3);
    formData.append('comentario', data.comentario);

    const exito = await enviarSolicitud(formData);

    if (exito) {
      reset();
      setFile3d(null);
      setFileStl(null);
    }
  };

  const handleBeforeUpload = (
    file: File,
    setFileState: React.Dispatch<React.SetStateAction<File | null>>,
  ) => {
    setFileState(file);
    return false;
  };

  return (
    <Card style={cardStyles}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
        Nueva Solicitud de Impresión
      </Title>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item label="Archivo de Diseño (.f3d, .obj, .step, .ipt)" required>
          <Upload
            accept=".f3d,.obj,.step,.ipt"
            maxCount={1}
            beforeUpload={(file) => handleBeforeUpload(file as File, setFile3d)}
            onRemove={() => setFile3d(null)}
            fileList={
              file3d ? [{ uid: '-1', name: file3d.name, status: 'done' } as UploadFile] : []
            }
          >
            <Button icon={<UploadOutlined />}>Seleccionar Archivo de Diseño</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Archivo STL (.stl)" required>
          <Upload
            accept=".stl"
            maxCount={1}
            beforeUpload={(file) => handleBeforeUpload(file as File, setFileStl)}
            onRemove={() => setFileStl(null)}
            fileList={
              fileStl ? [{ uid: '-2', name: fileStl.name, status: 'done' } as UploadFile] : []
            }
          >
            <Button icon={<UploadOutlined />}>Seleccionar Archivo STL</Button>
          </Upload>
        </Form.Item>

        <div style={{ display: 'flex', gap: '16px' }}>
          {['colorOpcion1', 'colorOpcion2', 'colorOpcion3'].map((nombreCampo, index) => (
            <Form.Item
              key={nombreCampo}
              label={`Opción ${index + 1}`}
              validateStatus={errors[nombreCampo as keyof SolicitudFormInputs] ? 'error' : ''}
              style={{ flex: 1 }}
            >
              <Controller
                name={nombreCampo as keyof SolicitudFormInputs}
                control={control}
                rules={{ required: 'Obligatorio' }}
                render={({ field }) => (
                  <Select {...field} placeholder="Color">
                    <Option value="Negro">Negro</Option>
                    <Option value="Blanco">Blanco</Option>
                    <Option value="Gris">Gris</Option>
                    <Option value="Rojo">Rojo</Option>
                    <Option value="Azul">Azul</Option>
                    <Option value="Verde">Verde</Option>
                    <Option value="Amarillo">Amarillo</Option>
                    <Option value="Naranja">Naranja</Option>
                  </Select>
                )}
              />
            </Form.Item>
          ))}
        </div>

        <Form.Item
          label="Comentarios"
          validateStatus={errors.comentario ? 'error' : ''}
          help={errors.comentario?.message}
        >
          <Controller
            name="comentario"
            control={control}
            rules={{ required: 'Añade una descripción' }}
            render={({ field }) => (
              <TextArea {...field} rows={4} placeholder="Instrucciones para la impresión" />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={isSubmitting} size="large">
            Enviar Solicitud
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
