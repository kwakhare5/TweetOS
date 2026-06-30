import { FileText, MoreVertical, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { RECENT_NOTES } from "@/data/mock-data"
export function RecentDrafts() {
  return (
    <section id="notes" className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Recent Drafts</h2>
          <p className="text-sm text-muted-foreground">Your latest captured ideas.</p>
        </div>
        <Dialog>
          <DialogTrigger render={
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Draft</DialogTitle>
              <DialogDescription>
                Capture your next viral idea here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Input id="title" placeholder="Thread Idea: 10 hooks that work" className="font-semibold text-lg" />
              </div>
              <div className="grid gap-2">
                <Textarea
                  id="content"
                  placeholder="Start typing your hook..."
                  className="min-h-[120px] resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Draft</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 flex-1 h-full">
        {RECENT_NOTES.map((note, i) => (
          <Card key={i} className="flex flex-col cursor-pointer border border-border hover:border-primary/50 transition-colors group">
            <CardHeader className="flex flex-row justify-between items-start pb-2">
              <div className={`px-2 py-1 rounded-md text-xs font-medium border ${note.color} mb-2`}>
                <FileText className="h-3 w-3 inline-block mr-1" />
                Note
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-8 w-8 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <MoreVertical className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit Note</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="flex-1">
              <CardTitle className="text-base mb-2">{note.title}</CardTitle>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-2">
                {note.content}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-4 border-t border-border/50">
              <div className="flex gap-1.5 overflow-hidden">
                {note.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 font-normal rounded-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {note.date}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
