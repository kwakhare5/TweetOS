import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Contact, Target, ListTodo, Users, UserRound, Sparkles, Check, Copy } from "lucide-react"
import { toast } from "sonner"
import { WashiTape } from "@/components/ui/washi-tape"
import { CardHeaderRow } from "@/components/ui/card-header-row"
import { FieldLabel } from "@/components/ui/field-label"
import { EditToggleButton } from "@/components/ui/edit-toggle-button"

const SELF_AUDIT_PROMPT = `Act as a world-class social media analyst. Please deeply analyze my entire X (Twitter) account activity, including all my tweets, replies, and the topics I engage with the most.

I need you to reverse-engineer my personal brand so I can populate my local configuration system. Provide the insights strictly in the following format:
1. Bio: (A sharp, 1-2 sentence description)
2. Niche: (A highly specific definition of my niche)
3. Audience Target: (Exactly who my content is built for, 3 bullet points)
4. Account Goals: (3 core goals)
5. Content Pillars: (3-5 main topics formatted as Topic: Description)
6. Voice & Tone Rules: (5 strict rules)
7. Avoid Words: (5 generic words I would NEVER use)

Do not give me generic advice. Only give me cold, hard analysis.`

interface ExtendedContextCardProps {
  bio: string
  setBio: (v: string) => void
  goalsString: string
  setGoalsString: (v: string) => void
  admiredString: string
  setAdmiredString: (v: string) => void
  pillarsString: string
  setPillarsString: (v: string) => void
  audienceString: string
  setAudienceString: (v: string) => void
}

export function ExtendedContextCard({
  bio, setBio,
  goalsString, setGoalsString,
  admiredString, setAdmiredString,
  pillarsString, setPillarsString,
  audienceString, setAudienceString
}: ExtendedContextCardProps) {
  const [isEditing, setIsEditing] = useState(false)

  const copyPrompt = () => {
    navigator.clipboard.writeText(SELF_AUDIT_PROMPT)
    toast.success("Self-Audit prompt copied!")
  }

  const HeaderActions = (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={copyPrompt}
        className="hidden sm:flex"
      >
        <Copy className="h-3 w-3 mr-1.5" />
        Prompt
      </Button>
      <EditToggleButton isEditing={isEditing} onToggle={() => setIsEditing(!isEditing)} />
    </>
  )

  return (
    <div className="relative flex flex-col border border-border rounded-xl p-5 bg-card text-card-foreground shadow-sm">
      <WashiTape className="rotate-[-1.5deg]" />

      <CardHeaderRow
        icon={Sparkles}
        title="Extended Context"
        subtitle="Bio, pillars, goals, and audience."
        actions={HeaderActions}
      />

      <div className="flex flex-col gap-6">

        {/* Bio */}
        <div className="space-y-2">
          <FieldLabel icon={UserRound}>Bio</FieldLabel>
          {isEditing ? (
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief description of yourself..."
              className="bg-background/50 min-h-[60px] text-sm resize-none"
            />
          ) : (
            <p className="text-sm text-foreground italic border-l-2 border-border pl-3 py-1">{bio || "No bio set."}</p>
          )}
        </div>

        {/* Content Pillars */}
        <div className="space-y-2 border-t border-border/40 pt-4">
          <FieldLabel icon={ListTodo}>Content Pillars</FieldLabel>
          {isEditing ? (
            <>
              <p className="text-[10px] text-muted-foreground/70 mb-1">Format: Name: Description</p>
              <Textarea
                value={pillarsString}
                onChange={(e) => setPillarsString(e.target.value)}
                placeholder={"Tool Checks: Blunt takes on AI tools\nJourney Notes: Building in public..."}
                className="bg-background/50 min-h-[90px] text-sm resize-none leading-relaxed"
              />
            </>
          ) : (
            <div className="flex flex-col gap-2.5 mt-2">
              {pillarsString.split("\n").filter(Boolean).length > 0 ? (
                pillarsString.split("\n").filter(Boolean).map((p, i) => {
                  const [title, ...rest] = p.split(":")
                  const desc = rest.join(":")
                  return (
                    <div key={i} className="bg-muted/30 rounded-md p-2.5 border border-border/40">
                      <span className="text-sm font-semibold text-foreground block">{title}</span>
                      {desc && <span className="text-xs text-muted-foreground block mt-0.5 leading-relaxed">{desc.trim()}</span>}
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-muted-foreground">No pillars defined.</p>
              )}
            </div>
          )}
        </div>

        {/* Audience */}
        <div className="space-y-2 border-t border-border/40 pt-4">
          <FieldLabel icon={Users}>Audience Target</FieldLabel>
          {isEditing ? (
            <Textarea
              value={audienceString}
              onChange={(e) => setAudienceString(e.target.value)}
              placeholder={"Indian indie devs\nPeople frustrated with AI hype..."}
              className="bg-background/50 min-h-[70px] text-sm resize-none"
            />
          ) : (
            <ul className="list-disc list-outside ml-4 space-y-1 mt-1 text-sm text-foreground marker:text-border">
              {audienceString.split("\n").filter(Boolean).length > 0 ? (
                audienceString.split("\n").filter(Boolean).map((a, i) => <li key={i}>{a}</li>)
              ) : (
                <li className="text-muted-foreground list-none -ml-4">No audience defined.</li>
              )}
            </ul>
          )}
        </div>

        {/* Goals */}
        <div className="space-y-2 border-t border-border/40 pt-4">
          <FieldLabel icon={Target}>Account Goals</FieldLabel>
          {isEditing ? (
            <Textarea
              value={goalsString}
              onChange={(e) => setGoalsString(e.target.value)}
              placeholder={"Grow engaged audience\nGet project visibility..."}
              className="bg-background/50 min-h-[70px] text-sm resize-none"
            />
          ) : (
            <ul className="list-disc list-outside ml-4 space-y-1 mt-1 text-sm text-foreground marker:text-border">
              {goalsString.split("\n").filter(Boolean).length > 0 ? (
                goalsString.split("\n").filter(Boolean).map((g, i) => <li key={i}>{g}</li>)
              ) : (
                <li className="text-muted-foreground list-none -ml-4">No goals defined.</li>
              )}
            </ul>
          )}
        </div>

        {/* Admired Accounts */}
        <div className="space-y-2 border-t border-border/40 pt-4">
          <FieldLabel icon={Contact}>Admired Accounts</FieldLabel>
          {isEditing ? (
            <Textarea
              value={admiredString}
              onChange={(e) => setAdmiredString(e.target.value)}
              placeholder={"shydev69\nadxtyahq..."}
              className="bg-background/50 min-h-[70px] text-sm resize-none"
            />
          ) : (
            <div className="flex flex-wrap gap-2 mt-1">
              {admiredString.split("\n").filter(Boolean).length > 0 ? (
                admiredString.split("\n").filter(Boolean).map((acc, i) => (
                  <span key={i} className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-muted text-foreground rounded-md border border-border/60">
                    @{acc.replace("@", "")}
                  </span>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No accounts defined.</p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
