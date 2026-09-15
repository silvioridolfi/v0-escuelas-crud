"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bookmark, Star, X } from "lucide-react"

type SavedSearch = { name: string; term: string }

const STORAGE_KEY = "savedSearches"

function readSavedSearches(): SavedSearch[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedSearch[]) : []
  } catch {
    return []
  }
}

function writeSavedSearches(searches: SavedSearch[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(searches))
}

export function SavedSearches({
  currentTerm,
  onSelect,
}: {
  currentTerm: string
  onSelect: (term: string) => void
}) {
  const [saved, setSaved] = useState<SavedSearch[]>([])
  const [isNaming, setIsNaming] = useState(false)
  const [newName, setNewName] = useState("")

  useEffect(() => {
    setSaved(readSavedSearches())
  }, [])

  const alreadySaved = saved.some((s) => s.term.toLowerCase() === currentTerm.trim().toLowerCase())

  const handleConfirmSave = () => {
    const name = newName.trim() || currentTerm.trim()
    const next = [...saved, { name, term: currentTerm.trim() }]
    setSaved(next)
    writeSavedSearches(next)
    setIsNaming(false)
    setNewName("")
  }

  const handleRemove = (term: string) => {
    const next = saved.filter((s) => s.term !== term)
    setSaved(next)
    writeSavedSearches(next)
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {saved.map((s) => (
        <span
          key={s.term}
          className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-border bg-white dark:bg-card px-3 py-1 text-xs text-slate-700 dark:text-gray-100 shadow-sm"
        >
          <button
            type="button"
            onClick={() => onSelect(s.term)}
            className="inline-flex items-center gap-1 hover:text-pba-purple"
          >
            <Bookmark className="h-3 w-3" />
            {s.name}
          </button>
          <button
            type="button"
            onClick={() => handleRemove(s.term)}
            className="text-slate-300 dark:text-gray-400 hover:text-red-500"
            title="Quitar de guardados"
            aria-label={`Quitar "${s.name}" de búsquedas guardadas`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {currentTerm.trim() && !alreadySaved && !isNaming && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setNewName(currentTerm.trim())
            setIsNaming(true)
          }}
          className="h-7 gap-1.5 border-dashed border-slate-300 dark:border-border-strong px-2.5 text-xs text-slate-500 dark:text-gray-300 hover:border-pba-purple/50 hover:text-pba-purple"
        >
          <Star className="h-3 w-3" />
          Guardar búsqueda
        </Button>
      )}

      {isNaming && (
        <div className="flex items-center gap-1.5">
          <Input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirmSave()
              if (e.key === "Escape") setIsNaming(false)
            }}
            placeholder="Nombre corto..."
            className="h-7 w-40 text-xs"
          />
          <Button type="button" size="sm" onClick={handleConfirmSave} className="h-7 bg-pba-purple px-2.5 text-xs hover:bg-pba-purple/90">
            Guardar
          </Button>
        </div>
      )}
    </div>
  )
}
