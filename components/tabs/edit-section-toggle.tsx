"use client"

import { Button } from "@/components/ui/button"
import { Pencil, Lock } from "lucide-react"

export function EditSectionToggle({
  isEditing,
  onToggle,
}: {
  isEditing: boolean
  onToggle: () => void
}) {
  return (
    <div className="mb-6 flex justify-end">
      <Button
        type="button"
        onClick={onToggle}
        variant={isEditing ? "secondary" : "outline"}
        size="sm"
        className={
          isEditing
            ? "bg-[#417099] text-white hover:bg-[#375d80]"
            : "border-slate-300 text-slate-700 dark:text-gray-100 hover:bg-slate-50 dark:bg-white/5"
        }
      >
        {isEditing ? (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Bloquear edición
          </>
        ) : (
          <>
            <Pencil className="mr-2 h-4 w-4" />
            Editar esta sección
          </>
        )}
      </Button>
    </div>
  )
}
