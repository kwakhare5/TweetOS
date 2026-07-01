import { Button } from "@/components/ui/button"
import { Pencil, Check } from "lucide-react"

interface EditToggleButtonProps {
  isEditing: boolean
  onToggle: () => void
}

/**
 * Edit / Done toggle button with amber active state.
 * Used by AvoidWordsCard and ExtendedContextCard.
 */
export function EditToggleButton({ isEditing, onToggle }: EditToggleButtonProps) {
  return (
    <Button
      variant={isEditing ? "default" : "secondary"}
      size="sm"
      onClick={onToggle}
      className={
        isEditing
          ? "font-semibold btn-edit-active"
          : "font-semibold"
      }
    >
      {isEditing
        ? <Check className="h-3.5 w-3.5 mr-1.5" />
        : <Pencil className="h-3.5 w-3.5 mr-1.5" />
      }
      {isEditing ? "Done" : "Edit"}
    </Button>
  )
}
