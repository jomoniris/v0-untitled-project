"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

export type Option = {
  label: string
  value: string
}

interface MultiSelectBasicProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelectBasic({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className,
}: MultiSelectBasicProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Handle clicking outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options
    return options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [options, searchTerm])

  // Toggle selection of an option
  const toggleOption = React.useCallback(
    (value: string) => {
      const newSelected = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]
      onChange(newSelected)
    },
    [selected, onChange],
  )

  // Remove an option from selection
  const removeOption = React.useCallback(
    (e: React.MouseEvent, value: string) => {
      e.stopPropagation()
      onChange(selected.filter((item) => item !== value))
    },
    [selected, onChange],
  )

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input field and selected items */}
      <div
        className={`border rounded-md p-2 flex flex-wrap gap-1 min-h-[38px] cursor-text ${isOpen ? "ring-2 ring-ring" : ""}`}
        onClick={() => setIsOpen(true)}
      >
        {selected.map((value) => {
          const option = options.find((o) => o.value === value)
          return option ? (
            <Badge key={value} variant="secondary" className="flex items-center gap-1">
              {option.label}
              <button type="button" onClick={(e) => removeOption(e, value)} className="rounded-full hover:bg-muted">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ) : null
        })}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none bg-transparent min-w-[80px]"
          placeholder={selected.length === 0 ? placeholder : ""}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 border rounded-md shadow-md bg-background max-h-[200px] overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleOption(option.value)
                }}
              >
                <div className="flex items-center justify-center h-4 w-4" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selected.includes(option.value)}
                    onCheckedChange={() => toggleOption(option.value)}
                  />
                </div>
                <span>{option.label}</span>
              </div>
            ))
          ) : (
            <div className="px-2 py-1.5 text-muted-foreground">No options found</div>
          )}
        </div>
      )}
    </div>
  )
}
