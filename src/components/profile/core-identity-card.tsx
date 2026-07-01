import { Input } from "@/components/ui/input"
import { UserCircle } from "lucide-react"
import { WashiTape } from "@/components/ui/washi-tape"
import { CardHeaderRow } from "@/components/ui/card-header-row"
import { FieldLabel } from "@/components/ui/field-label"

interface CoreIdentityCardProps {
  name: string
  setName: (v: string) => void
  twitterHandle: string
  setTwitterHandle: (v: string) => void
  niche: string
  setNiche: (v: string) => void
}

export function CoreIdentityCard({
  name, setName,
  twitterHandle, setTwitterHandle,
  niche, setNiche
}: CoreIdentityCardProps) {
  return (
    <div className="relative flex flex-col border border-border rounded-xl p-5 bg-card text-card-foreground shadow-sm">
      <WashiTape className="rotate-[1deg]" />

      <CardHeaderRow
        icon={UserCircle}
        title="Core Identity"
        subtitle="Foundational elements of your digital persona."
      />

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="name">Display Name</FieldLabel>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Karan"
              className="bg-background/50 h-9"
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel htmlFor="handle">X Handle</FieldLabel>
            <div className="relative">
              <span className="absolute left-3 top-2 text-muted-foreground text-sm select-none font-semibold">@</span>
              <Input
                id="handle"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value.replace("@", ""))}
                placeholder="kwakhare5"
                className="pl-8 bg-background/50 h-9"
              />
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <FieldLabel htmlFor="niche">Content Niche &amp; Focus Areas</FieldLabel>
          <Input
            id="niche"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g. low-level systems, code aesthetics, sarcastic student takes"
            className="bg-background/50 h-9"
          />
        </div>
      </div>
    </div>
  )
}
