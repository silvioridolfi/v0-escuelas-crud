import "server-only"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// ⚠️ Este cliente usa la SERVICE ROLE KEY: se salta RLS por completo.
// SOLO se puede importar desde server actions o route handlers.
// El paquete "server-only" hace que el build explote si alguien lo importa
// desde un componente cliente, así que es imposible que esta key llegue al browser.

// Nota: se usa <any> a propósito porque el resto del proyecto tampoco define
// tipos de Database (mismo criterio que lib/supabase/server.ts). Cuando se
// agreguen tipos generados de Supabase, reemplazar "any" por el tipo Database
// tanto acá como en server.ts y client.ts.
let adminClient: ReturnType<typeof createSupabaseClient<any>> | undefined

export function createAdminClient() {
  if (adminClient) {
    return adminClient
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY. " +
        "La service role key NO debe tener el prefijo NEXT_PUBLIC_.",
    )
  }

  adminClient = createSupabaseClient<any>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return adminClient
}
