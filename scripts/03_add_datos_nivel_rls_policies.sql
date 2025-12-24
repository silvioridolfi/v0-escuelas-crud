-- Enable full access to datos_nivel_temp table for write operations

-- Allow INSERT
CREATE POLICY "enable_public_insert_access_to_matricula"
ON public.datos_nivel_temp
FOR INSERT
TO public
WITH CHECK (true);

-- Allow UPDATE
CREATE POLICY "enable_public_update_access_to_matricula"
ON public.datos_nivel_temp
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Allow DELETE
CREATE POLICY "enable_public_delete_access_to_matricula"
ON public.datos_nivel_temp
FOR DELETE
TO public
USING (true);
