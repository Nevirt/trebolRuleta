-- ================================================
-- INICIALIZACIÓN DE BASE DE DATOS PRODUCCIÓN
-- Helados Trébol - Ruleta
-- ================================================
-- 
-- Ejecuta este script completo en Neon Console:
-- https://console.neon.tech
-- 
-- ================================================

-- ================================================
-- PASO 1: Crear las tablas
-- ================================================

-- Tabla de premios
CREATE TABLE IF NOT EXISTS prizes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  "quantityTotal" INTEGER NOT NULL,
  "quantityRemaining" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de giros (historial)
CREATE TABLE IF NOT EXISTS spins (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "prizeId" TEXT NOT NULL,
  "prizeName" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_prize FOREIGN KEY ("prizeId") REFERENCES prizes(id) ON DELETE CASCADE
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_spins_prizeId ON spins("prizeId");
CREATE INDEX IF NOT EXISTS idx_spins_createdAt ON spins("createdAt");

-- ================================================
-- PASO 2: Insertar premios iniciales
-- ================================================

INSERT INTO prizes (name, "quantityTotal", "quantityRemaining")
VALUES 
  ('Cucharita + Stickers', 100, 100),
  ('Un llavero', 80, 80),
  ('Un sombrerito', 60, 60),
  ('Una toallita', 50, 50),
  ('Tenés otro intento', 999999, 999999),
  ('Suerte la próxima', 999999, 999999);

-- ================================================
-- VERIFICACIÓN (opcional)
-- ================================================

-- Ver todos los premios creados
SELECT * FROM prizes ORDER BY "createdAt";

-- Ver conteo de premios
SELECT COUNT(*) as total_premios FROM prizes;
