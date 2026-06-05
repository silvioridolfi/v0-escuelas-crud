export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-blue-50/20 to-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#00AEC3]" />
        <p className="text-sm text-slate-500">Cargando...</p>
      </div>
    </div>
  )
}
