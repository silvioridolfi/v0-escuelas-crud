-- Add a boolean field to identify government buildings vs educational establishments
-- Government buildings like "Nivel Central" should not be counted in metrics

-- Add the column with a default value of true (most records are schools)
ALTER TABLE establecimientos 
ADD COLUMN es_establecimiento_educativo BOOLEAN DEFAULT true;

-- Update the Nivel Central record (CUE 60000000) to mark it as non-educational
UPDATE establecimientos 
SET es_establecimiento_educativo = false 
WHERE cue = 60000000;

-- Add a comment to explain the column
COMMENT ON COLUMN establecimientos.es_establecimiento_educativo IS 
'Indica si es un establecimiento educativo (true) o un edificio gubernamental/administrativo (false). Los edificios gubernamentales no se contabilizan en las métricas de establecimientos.';
