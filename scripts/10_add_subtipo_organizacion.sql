-- Agregar campo subtipo_organizacion a la tabla organismos_descentralizados
ALTER TABLE organismos_descentralizados
ADD COLUMN IF NOT EXISTS subtipo_organizacion TEXT;

-- Migrar datos existentes: si tipo_organizacion es "Jefatura Regional" o "Jefatura Distrital",
-- moverlo a subtipo_organizacion y cambiar tipo_organizacion a "Organismo Descentralizado"
UPDATE organismos_descentralizados
SET 
  subtipo_organizacion = tipo_organizacion,
  tipo_organizacion = 'Organismo Descentralizado'
WHERE tipo_organizacion IN ('Jefatura Regional', 'Jefatura Distrital');
