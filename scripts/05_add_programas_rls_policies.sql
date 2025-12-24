-- Enable full access to programas_x_cue table
-- Currently has no policies at all

-- Allow SELECT
CREATE POLICY "enable_public_read_access_to_programas"
ON public.programas_x_cue
FOR SELECT
TO public
USING (true);

-- Allow INSERT
CREATE POLICY "enable_public_insert_access_to_programas"
ON public.programas_x_cue
FOR INSERT
TO public
WITH CHECK (true);

-- Allow UPDATE
CREATE POLICY "enable_public_update_access_to_programas"
ON public.programas_x_cue
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Allow DELETE
CREATE POLICY "enable_public_delete_access_to_programas"
ON public.programas_x_cue
FOR DELETE
TO public
USING (true);
