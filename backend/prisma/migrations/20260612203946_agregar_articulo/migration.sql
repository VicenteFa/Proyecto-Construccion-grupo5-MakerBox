-- CreateTable
CREATE TABLE "articulo" (
    "id_articulo" TEXT NOT NULL,
    "nombre_articulo" VARCHAR(100) NOT NULL,
    "stock_actual" INTEGER NOT NULL,
    "unidad_medida" VARCHAR(50) NOT NULL,
    "alerta_stock" INTEGER NOT NULL,
    "notificar_stock" BOOLEAN NOT NULL,
    "actualizado_en" TIMESTAMP(3),

    CONSTRAINT "articulo_pkey" PRIMARY KEY ("id_articulo")
);

