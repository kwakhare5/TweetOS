import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Tag, Ban } from "lucide-react"
import { Paperclip } from "@/components/ui/paperclip"
import { CardHeaderRow } from "@/components/ui/card-header-row"
import { FieldLabel } from "@/components/ui/field-label"
import { EditToggleButton } from "@/components/ui/edit-toggle-button"

interface AvoidWordsCardProps {
  avoidListString: string
  setAvoidListString: (v: string) => void
}

export function AvoidWordsCard({ avoidListString, setAvoidListString }: AvoidWordsCardProps) {
  const [isEditing, setIsEditing] = useState(false)

  const EditButton = (
    <EditToggleButton isEditing={isEditing} onToggle={() => setIsEditing(!isEditing)} />
  )

  return (
    <div className="relative flex flex-col border border-border rounded-xl p-5 bg-card text-card-foreground shadow-sm">
      <Paperclip className="absolute top-[-16px] right-[12%] z-20 select-none pointer-events-none rotate-[10deg]" />

      <CardHeaderRow
        icon={Tag}
        title="Avoid Words List"
        subtitle="Words to eliminate generic AI copywriting jargon."
        actions={EditButton}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <FieldLabel htmlFor="avoid">Avoid Words</FieldLabel>
          {isEditing ? (
            <Textarea
              id="avoid"
              value={avoidListString}
              onChange={(e) => setAvoidListString(e.target.value)}
              placeholder={"e.g. delve\nsupercharge\nunlock"}
              className="bg-background/50 min-h-[150px] text-sm resize-none leading-relaxed"
            />
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              {avoidListString.split("\n").filter(Boolean).length > 0 ? (
                avoidListString.split("\n").filter(Boolean).map((word, i) => (
                  <div key={i} className="flex items-start gap-2 bg-destructive/10 rounded-md p-2 border border-destructive/20">
                    <Ban className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
                    <span className="text-sm font-medium text-foreground leading-relaxed">{word.trim()}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No avoid words defined.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
