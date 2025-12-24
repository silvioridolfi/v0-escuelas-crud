-- Add latitude and longitude fields to organismos_descentralizados table
ALTER TABLE organismos_descentralizados 
ADD COLUMN IF NOT EXISTS latitud DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitud DECIMAL(11, 8);

-- Add comment to the columns
COMMENT ON COLUMN organismos_descentralizados.latitud IS 'Latitud geográfica en formato decimal';
COMMENT ON COLUMN organismos_descentralizados.longitud IS 'Longitud geográfica en formato decimal';
