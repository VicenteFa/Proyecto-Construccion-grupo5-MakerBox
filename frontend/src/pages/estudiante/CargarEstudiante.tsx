import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import axios from 'axios';
import { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';

interface CargarEstudiantesProps {
  idCurso: string;
}

export const CargarEstudiantesCsv = ({ idCurso }: CargarEstudiantesProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [archivoReal, setArchivoReal] = useState<File | null>(null);

  const token = useAuthStore((state) => state.token);

  const handleUpload = async () => {
    if (!archivoReal) {
      message.error('No se pudo leer el archivo');
      return;
    }
    const formData = new FormData();
    formData.append('file', archivoReal);
    console.log('Token actual:', token);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/cursos/${idCurso}/estudiantes`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      message.success(response.data.mensaje || 'Estudiantes cargados con éxito');
      setFileList([]);
    } catch (error: unknown) {
      console.error(error);
      message.error('Hubo un problema al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  const props = {
    onRemove: (file: UploadFile) => {
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    },
    beforeUpload: (file: UploadFile) => {
      setArchivoReal(file as unknown as File);
      setFileList([file]);
      return false;
    },

    fileList,
    accept: '.csv',
    maxCount: 1,
  };

  return (
    <div className="max-w-md bg-white p-6 rounded-lg shadow-md border mt-4">
      <h2 className="text-xl font-bold mb-4">Matricular Estudiantes</h2>
      <p className="text-gray-500 mb-4 text-sm">Sube el archivo CSV exportado desde Educandus.</p>

      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Seleccionar Archivo CSV</Button>
      </Upload>

      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
        block
      >
        {uploading ? 'Procesando...' : 'Iniciar Carga Masiva'}
      </Button>
    </div>
  );
};
