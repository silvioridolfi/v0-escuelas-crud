-- Crear tabla para organismos descentralizados (Jefaturas Regionales y Distritales)
CREATE TABLE IF NOT EXISTS organismos_descentralizados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL, -- jd001, jd113, etc.
  tipo_organizacion TEXT NOT NULL, -- "Jefatura Regional", "Jefatura Distrital"
  dependencia TEXT DEFAULT 'Oficial',
  nombre TEXT,
  distrito TEXT,
  domicilio TEXT,
  localidad TEXT,
  telefono TEXT,
  rpv TEXT,
  email TEXT,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar índices
CREATE INDEX IF NOT EXISTS idx_organismos_codigo ON organismos_descentralizados(codigo);
CREATE INDEX IF NOT EXISTS idx_organismos_tipo ON organismos_descentralizados(tipo_organizacion);
CREATE INDEX IF NOT EXISTS idx_organismos_distrito ON organismos_descentralizados(distrito);

-- Insertar Jefatura Regional
INSERT INTO organismos_descentralizados (
  codigo, 
  tipo_organizacion, 
  dependencia,
  nombre,
  distrito,
  domicilio, 
  localidad, 
  telefono
) VALUES (
  'jr01',
  'Jefatura Regional',
  'Oficial',
  'JEFATURA DE REGION - INSP. GRAL.',
  'LA PLATA',
  '50 Nº 881',
  'LA PLATA',
  '221 4247260, 221 4824801'
) ON CONFLICT (codigo) DO NOTHING;

-- Insertar Jefaturas Distritales
INSERT INTO organismos_descentralizados (codigo, tipo_organizacion, dependencia, distrito, localidad) VALUES
  ('jd001', 'Jefatura Distrital', 'Oficial', 'LA PLATA', 'LA PLATA'),
  ('jd113', 'Jefatura Distrital', 'Oficial', 'BERISSO', 'BERISSO'),
  ('jd114', 'Jefatura Distrital', 'Oficial', 'ENSENADA', 'ENSENADA'),
  ('jd014', 'Jefatura Distrital', 'Oficial', 'BRANDSEN', 'BRANDSEN'),
  ('jd064', 'Jefatura Distrital', 'Oficial', 'MAGDALENA', 'MAGDALENA'),
  ('jd134', 'Jefatura Distrital', 'Oficial', 'PUNTA INDIO', 'PUNTA INDIO')
ON CONFLICT (codigo) DO NOTHING;

-- Habilitar RLS
ALTER TABLE organismos_descentralizados ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para permitir todas las operaciones
CREATE POLICY "enable_public_read_access_to_organismos" ON organismos_descentralizados FOR SELECT USING (true);
CREATE POLICY "enable_public_insert_access_to_organismos" ON organismos_descentralizados FOR INSERT WITH CHECK (true);
CREATE POLICY "enable_public_update_access_to_organismos" ON organismos_descentralizados FOR UPDATE USING (true);
CREATE POLICY "enable_public_delete_access_to_organismos" ON organismos_descentralizados FOR DELETE USING (true);
