-- Remove RPV column and add contact fields to organismos_descentralizados table

-- Add new contact fields
ALTER TABLE organismos_descentralizados
ADD COLUMN IF NOT EXISTS contacto_nombre TEXT,
ADD COLUMN IF NOT EXISTS contacto_apellido TEXT,
ADD COLUMN IF NOT EXISTS contacto_cargo TEXT;

-- Remove RPV column
ALTER TABLE organismos_descentralizados
DROP COLUMN IF EXISTS rpv;

-- Add comment to document the change
COMMENT ON TABLE organismos_descentralizados IS 'Organismos descentralizados - RPV field removed, contact fields added';
