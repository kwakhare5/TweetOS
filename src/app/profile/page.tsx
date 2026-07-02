"use client"

import { useState, useEffect, useRef } from "react"
import { useProfileStore } from "@/store/use-profile-store"
import { CoreIdentityCard } from "@/components/profile/core-identity-card"
import { ExtendedContextCard } from "@/components/profile/extended-context-card"
import { VoiceProfileCard } from "@/components/profile/voice-profile-card"
import { AvoidWordsCard } from "@/components/profile/avoid-words-card"
import { PageHeader } from "@/components/ui/page-header"
import { SaveIndicator } from "@/components/ui/save-indicator"
import { motion, useReducedMotion } from "motion/react"
import { containerVariants, itemVariants, reducedContainerVariants } from "@/lib/motion-variants"

export default function ProfilePage() {
  const { profile, updateProfile } = useProfileStore()
  const [mounted, setMounted] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const initialLoadDone = useRef(false)
  const prefersReduced = useReducedMotion()

  const [name, setName] = useState("")
  const [twitterHandle, setTwitterHandle] = useState("")
  const [niche, setNiche] = useState("")
  const [avoidListString, setAvoidListString] = useState("")
  const [inspirationsContext, setInspirationsContext] = useState("")
  const [bio, setBio] = useState("")
  const [goalsString, setGoalsString] = useState("")
  const [admiredString, setAdmiredString] = useState("")
  const [pillarsString, setPillarsString] = useState("")
  const [audienceString, setAudienceString] = useState("")

  // Seed local state from store on first mount
  useEffect(() => {
    if (!profile || mounted) return

    setTimeout(() => {
      setName(profile.name || "")
      setTwitterHandle(profile.twitterHandle || "")
      setNiche(profile.niche || "")
      setAvoidListString((profile.voice?.avoidList || []).join("\n"))
      setInspirationsContext(profile.inspirationsContext || "")
      setBio(profile.bio || "")
      setGoalsString((profile.goals || []).join("\n"))
      setAdmiredString((profile.admiredAccounts || []).join("\n"))
      setPillarsString(
        (profile.contentPillars || [])
          .map(p => p.name + (p.description ? ": " + p.description : ""))
          .join("\n")
      )
      setAudienceString(
        [
          profile.audience?.targetAudience || "",
          ...(profile.audience?.audienceProblems || []),
          ...(profile.audience?.audienceGoals || []),
        ]
          .filter(Boolean)
          .join("\n")
      )

      setMounted(true)
      setTimeout(() => { initialLoadDone.current = true }, 100)
    }, 0)
  }, [profile, mounted])

  // Auto-save with 1 s debounce whenever any field changes
  useEffect(() => {
    if (!mounted || !initialLoadDone.current) return

    setSaveStatus("saving")
    const t = setTimeout(() => {
      const parsedPillars = pillarsString
        .split("\n")
        .map((line, i) => {
          const [name, ...rest] = line.split(":")
          return {
            id: "pillar_" + (i + 1),
            name: name.trim(),
            description: rest.join(":").trim(),
            percentage: 20,
          }
        })
        .filter(p => p.name)

      updateProfile({
        name,
        twitterHandle,
        niche,
        inspirationsContext,
        bio,
        goals: goalsString.split("\n").map(s => s.trim()).filter(Boolean),
        admiredAccounts: admiredString.split("\n").map(s => s.trim()).filter(Boolean).map(s => s.replace("@", "")),
        audience: {
          currentAudience: profile.audience?.currentAudience || "",
          targetAudience: audienceString.split("\n").map(s => s.trim()).filter(Boolean).join(" | "),
          audienceProblems: profile.audience?.audienceProblems || [],
          audienceGoals: profile.audience?.audienceGoals || [],
        },
        contentPillars: parsedPillars,
        voice: {
          ...profile.voice,
          avoidList: avoidListString.split("\n").map(s => s.trim()).filter(Boolean),
        },
      })

      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }, 1000)

    return () => clearTimeout(t)
  // updateProfile and profile are stable Zustand refs — including them
  // would trigger auto-save on every external sync, causing a write loop.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, twitterHandle, niche, avoidListString, inspirationsContext, bio, goalsString, admiredString, pillarsString, audienceString])

  if (!mounted) return null

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader
        title="Profile"
        subtitle="Configure your local state, voice definitions, and context settings."
        actions={<SaveIndicator status={saveStatus} />}
      />

      <motion.div
        variants={prefersReduced ? reducedContainerVariants : containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-4"
      >
        {/* Left: Core Identity + Extended Context */}
        <motion.div variants={itemVariants} className="lg:col-span-6 flex flex-col gap-6">
          <CoreIdentityCard
            name={name} setName={setName}
            twitterHandle={twitterHandle} setTwitterHandle={setTwitterHandle}
            niche={niche} setNiche={setNiche}
          />
          <ExtendedContextCard
            bio={bio} setBio={setBio}
            goalsString={goalsString} setGoalsString={setGoalsString}
            admiredString={admiredString} setAdmiredString={setAdmiredString}
            pillarsString={pillarsString} setPillarsString={setPillarsString}
            audienceString={audienceString} setAudienceString={setAudienceString}
          />
        </motion.div>

        {/* Right: Voice Blueprint + Avoid Words */}
        <motion.div variants={itemVariants} className="lg:col-span-6 flex flex-col gap-6">
          <VoiceProfileCard
            inspirationsContext={inspirationsContext}
            setInspirationsContext={setInspirationsContext}
          />
          <AvoidWordsCard
            avoidListString={avoidListString}
            setAvoidListString={setAvoidListString}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
