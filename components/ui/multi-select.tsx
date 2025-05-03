"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

export type Option = {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className,
}: MultiSelectProps) {
  // Use refs instead of state where possible to avoid re-renders
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Handle clicking outside to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    // Only add the event listener when the dropdown is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Filter options based on search value
  const filteredOptions = React.useMemo(() => {
    return options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()))
  }, [options, searchValue])

  // Handle removing a selected item
  const handleRemoveItem = React.useCallback(
    (itemValue: string) => {
      const newSelected = selected.filter((value) => value !== itemValue)
      onChange(newSelected)
    },
    [selected, onChange],
  )

  // Handle toggling a checkbox
  const handleToggleItem = React.useCallback(
    (itemValue: string) => {
      const isSelected = selected.includes(itemValue)
      let newSelected: string[]

      if (isSelected) {
        newSelected = selected.filter((value) => value !== itemValue)
      } else {
        newSelected = [...selected, itemValue]
      }

      onChange(newSelected)
    },
    [selected, onChange],
  )

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Selected items and search input */}
      <div
        className={`flex flex-wrap gap-1 min-h-[38px] p-2 border rounded-md ${
          isOpen ? "ring-2 ring-ring" : ""
        } ${className}`}
        onClick={() => setIsOpen(true)}
      >
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selected.map((value) => {
              const option = options.find((o) => o.value === value)
              return (
                <Badge key={value} variant="secondary" className="flex items-center gap-1">
                  {option?.label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveItem(value)
                    }}
                    className="rounded-full hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )
            })}
          </div>
        )}
        <input
          type="text"
          className="flex-1 outline-none bg-transparent min-w-[80px]"
          placeholder={selected.length === 0 ? placeholder : ""}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onClick={() => setIsOpen(true)}
        />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-md max-h-[200px] overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted cursor-pointer"
                onClick={() => handleToggleItem(option.value)}
              >
                <Checkbox
                  checked={selected.includes(option.value)}
                  // Don't use onCheckedChange to avoid double events
                />
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
