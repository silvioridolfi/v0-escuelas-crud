-- ============================================================
-- LOCKDOWN: elimina las políticas que permiten escritura pública
-- Las escrituras van a pasar exclusivamente por server actions
-- usando la service_role key (que se salta RLS y nunca sale al browser)
-- ============================================================

-- establecimientos
DROP POLICY IF EXISTS "enable_public_insert_access_to_establecimientos" ON public.establecimientos;
DROP POLICY IF EXISTS "enable_public_update_access_to_establecimientos" ON public.establecimientos;
DROP POLICY IF EXISTS "enable_public_delete_access_to_establecimientos" ON public.establecimientos;

-- contactos
DROP POLICY IF EXISTS "enable_public_insert_access_to_contactos" ON public.contactos;
DROP POLICY IF EXISTS "enable_public_update_access_to_contactos" ON public.contactos;
DROP POLICY IF EXISTS "enable_public_delete_access_to_contactos" ON public.contactos;

-- datos_nivel_temp
DROP POLICY IF EXISTS "enable_public_insert_access_to_matricula" ON public.datos_nivel_temp;
DROP POLICY IF EXISTS "enable_public_update_access_to_matricula" ON public.datos_nivel_temp;
DROP POLICY IF EXISTS "enable_public_delete_access_to_matricula" ON public.datos_nivel_temp;

-- equipamiento_escolar
DROP POLICY IF EXISTS "enable_public_insert_access_to_equipamiento" ON public.equipamiento_escolar;
DROP POLICY IF EXISTS "enable_public_update_access_to_equipamiento" ON public.equipamiento_escolar;
DROP POLICY IF EXISTS "enable_public_delete_access_to_equipamiento" ON public.equipamiento_escolar;

-- programas_x_cue
DROP POLICY IF EXISTS "enable_public_insert_access_to_programas" ON public.programas_x_cue;
DROP POLICY IF EXISTS "enable_public_update_access_to_programas" ON public.programas_x_cue;
DROP POLICY IF EXISTS "enable_public_delete_access_to_programas" ON public.programas_x_cue;

-- organismos_descentralizados (ajustar nombre de política si difiere en tu proyecto)
DROP POLICY IF EXISTS "enable_public_insert_access_to_organismos" ON public.organismos_descentralizados;
DROP POLICY IF EXISTS "enable_public_update_access_to_organismos" ON public.organismos_descentralizados;
DROP POLICY IF EXISTS "enable_public_delete_access_to_organismos" ON public.organismos_descentralizados;

-- Después de correr esto: SELECT sigue público (para que el buscador funcione),
-- pero INSERT/UPDATE/DELETE solo los puede hacer la service_role,
-- que se salta RLS automáticamente y solo vive en el server.
