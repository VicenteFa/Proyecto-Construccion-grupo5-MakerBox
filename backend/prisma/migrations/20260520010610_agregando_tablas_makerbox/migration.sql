-- CreateEnum
CREATE TYPE "tipo_rol" AS ENUM ('ESTUDIANTE', 'PROFESOR', 'AYUDANTE');

-- CreateEnum
CREATE TYPE "estado_ayudantia" AS ENUM ('ACTIVA', 'INACTIVA');

-- CreateEnum
CREATE TYPE "estado_impresion" AS ENUM ('PENDIENTE', 'IMPRIMIENDO', 'FINALIZADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "estado_reserva" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" TEXT NOT NULL,
    "rut" VARCHAR(10) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(100) NOT NULL,
    "passUsuario" VARCHAR(255) NOT NULL,
    "usuario_rol" "tipo_rol" NOT NULL,
    "borrado_en" TIMESTAMP(3),
    "creado_en" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "curso" (
    "id_curso" TEXT NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "ref_semestre" TEXT NOT NULL,
    "ref_profesor" TEXT NOT NULL,
    "borrado_en" TIMESTAMP(3),
    "creado_en" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3),

    CONSTRAINT "curso_pkey" PRIMARY KEY ("id_curso")
);

-- CreateTable
CREATE TABLE "ayudantia" (
    "id_ayudantia" TEXT NOT NULL,
    "nombre_ayudantia" VARCHAR(100) NOT NULL,
    "ref_curso" TEXT NOT NULL,
    "ref_grupo" TEXT,
    "ref_ayudante" TEXT NOT NULL,
    "horario" TIMESTAMP(3) NOT NULL,
    "cupo_maximo" INTEGER NOT NULL,
    "estado" "estado_ayudantia" NOT NULL,

    CONSTRAINT "ayudantia_pkey" PRIMARY KEY ("id_ayudantia")
);

-- CreateTable
CREATE TABLE "impresion" (
    "id_impresion" TEXT NOT NULL,
    "solicitante_nombre" VARCHAR(50),
    "solicitante_apellido" VARCHAR(50),
    "solicitante_correo" VARCHAR(100),
    "solicitante_rut" VARCHAR(10),
    "ref_estudiante" TEXT,
    "ref_ayudante" TEXT,
    "tipo_usuario" VARCHAR(50),
    "tipo_solicitud" VARCHAR(50),
    "nombre_curso" VARCHAR(100),
    "ref_curso" TEXT,
    "color_opcion1" VARCHAR(50) NOT NULL,
    "color_opcion2" VARCHAR(50) NOT NULL,
    "color_opcion3" VARCHAR(50) NOT NULL,
    "comentario_tecnico" TEXT,
    "url_modelo_3d" VARCHAR(255) NOT NULL,
    "url_modelo_stl" VARCHAR(255) NOT NULL,
    "comentario" TEXT NOT NULL,
    "estado" "estado_impresion" NOT NULL,
    "observacion_ayudante" TEXT,
    "motivo_rechazo" TEXT,
    "tiempo_estimado_impresion" VARCHAR(50),
    "inicio_impresion" TIMESTAMP(3),
    "creado_en" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "impresion_pkey" PRIMARY KEY ("id_impresion")
);

-- CreateTable
CREATE TABLE "reserva" (
    "id_reserva" TEXT NOT NULL,
    "fecha_reserva" TIMESTAMP(3) NOT NULL,
    "estado_reserva" "estado_reserva" NOT NULL,
    "solicitante_nombre" VARCHAR(50) NOT NULL,
    "solicitante_apellido" VARCHAR(50) NOT NULL,
    "solicitante_correo" VARCHAR(100) NOT NULL,
    "solicitante_rut" VARCHAR(10) NOT NULL,
    "ref_ayudante" TEXT,
    "motivo_reserva" VARCHAR(255) NOT NULL,
    "creado_en" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reserva_pkey" PRIMARY KEY ("id_reserva")
);

-- CreateTable
CREATE TABLE "semestre" (
    "id_semestre" TEXT NOT NULL,

    CONSTRAINT "semestre_pkey" PRIMARY KEY ("id_semestre")
);

-- CreateTable
CREATE TABLE "grupo_curso" (
    "id_grupo_curso" TEXT NOT NULL,

    CONSTRAINT "grupo_curso_pkey" PRIMARY KEY ("id_grupo_curso")
);

-- AddForeignKey
ALTER TABLE "curso" ADD CONSTRAINT "curso_ref_profesor_fkey" FOREIGN KEY ("ref_profesor") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curso" ADD CONSTRAINT "curso_ref_semestre_fkey" FOREIGN KEY ("ref_semestre") REFERENCES "semestre"("id_semestre") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ayudantia" ADD CONSTRAINT "ayudantia_ref_curso_fkey" FOREIGN KEY ("ref_curso") REFERENCES "curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ayudantia" ADD CONSTRAINT "ayudantia_ref_ayudante_fkey" FOREIGN KEY ("ref_ayudante") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ayudantia" ADD CONSTRAINT "ayudantia_ref_grupo_fkey" FOREIGN KEY ("ref_grupo") REFERENCES "grupo_curso"("id_grupo_curso") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impresion" ADD CONSTRAINT "impresion_ref_estudiante_fkey" FOREIGN KEY ("ref_estudiante") REFERENCES "usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impresion" ADD CONSTRAINT "impresion_ref_ayudante_fkey" FOREIGN KEY ("ref_ayudante") REFERENCES "usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impresion" ADD CONSTRAINT "impresion_ref_curso_fkey" FOREIGN KEY ("ref_curso") REFERENCES "curso"("id_curso") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_ref_ayudante_fkey" FOREIGN KEY ("ref_ayudante") REFERENCES "usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;
