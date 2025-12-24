-- Enable full access to equipamiento_escolar table
-- Currently has no policies at all

-- Allow SELECT
CREATE POLICY "enable_public_read_access_to_equipamiento"
ON public.equipamiento_escolar
FOR SELECT
TO public
USING (true);

-- Allow INSERT
CREATE POLICY "enable_public_insert_access_to_equipamiento"
ON public.equipamiento_escolar
FOR INSERT
TO public
WITH CHECK (true);

-- Allow UPDATE
CREATE POLICY "enable_public_update_access_to_equipamiento"
ON public.equipamiento_escolar
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Allow DELETE
CREATE POLICY "enable_public_delete_access_to_equipamiento"
ON public.equipamiento_escolar
FOR DELETE
TO public
USING (true);
