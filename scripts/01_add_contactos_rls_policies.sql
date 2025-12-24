-- Enable full access to contactos table for authenticated and anonymous users
-- This allows the admin interface to create, update, and delete contacts

-- Allow INSERT
CREATE POLICY "enable_public_insert_access_to_contactos"
ON public.contactos
FOR INSERT
TO public
WITH CHECK (true);

-- Allow UPDATE
CREATE POLICY "enable_public_update_access_to_contactos"
ON public.contactos
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Allow DELETE
CREATE POLICY "enable_public_delete_access_to_contactos"
ON public.contactos
FOR DELETE
TO public
USING (true);
