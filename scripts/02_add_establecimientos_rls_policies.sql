-- Enable full access to establecimientos table for write operations
-- Currently only has SELECT policy, need INSERT, UPDATE, DELETE

-- Allow INSERT
CREATE POLICY "enable_public_insert_access_to_establecimientos"
ON public.establecimientos
FOR INSERT
TO public
WITH CHECK (true);

-- Allow UPDATE
CREATE POLICY "enable_public_update_access_to_establecimientos"
ON public.establecimientos
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Allow DELETE
CREATE POLICY "enable_public_delete_access_to_establecimientos"
ON public.establecimientos
FOR DELETE
TO public
USING (true);
